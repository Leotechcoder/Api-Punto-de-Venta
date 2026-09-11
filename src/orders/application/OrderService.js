// src/modules/orders/application/OrderService.js
import { Item } from "../../items/domain/Item.js";
import pool from "../../shared/infrastructure/postgresConnection.js";
import { Order } from "../domain/Order.js";

/**
 * Compara los items actuales de la orden (filas de DB) contra los items
 * recibidos en el PATCH y arma el plan de sincronización.
 *
 * - Item recibido sin `id`, o con un `id` que ya no existe en la orden
 *   (pudo borrarse por otro proceso mientras se editaba) → se crea.
 * - Item con `id` existente → se compara quantity/unitPrice/description;
 *   si cambió alguno, se actualiza.
 * - Item que estaba en la orden y no vino en la lista recibida → se borra.
 */
function buildItemSyncPlan(currentRows, incomingItems) {
  const currentById = new Map(currentRows.map((row) => [row.id_, row]));
  const incomingIds = new Set(
    incomingItems.filter((item) => item.id).map((item) => item.id)
  );

  const toDelete = currentRows
    .filter((row) => !incomingIds.has(row.id_))
    .map((row) => row.id_);

  const toCreate = incomingItems.filter(
    (item) => !item.id || !currentById.has(item.id)
  );

  const toUpdate = incomingItems.filter((item) => {
    if (!item.id || !currentById.has(item.id)) return false;
    const current = currentById.get(item.id);
    return (
      Number(current.quantity) !== Number(item.quantity) ||
      Number(current.unit_price) !== Number(item.unitPrice) ||
      (current.description || "") !== (item.description || "")
    );
  });

  return { toDelete, toCreate, toUpdate };
}

export class OrderService {
  constructor(orderRepository, itemRepository) {
    this.orderRepository = orderRepository;
    this.itemRepository = itemRepository;
  }

  async getAllOrders() {
    const client = await pool.connect();
    try {
      const dbOrders = await this.orderRepository.getAll(client);
      return dbOrders.map(Order.fromPersistence).map((order) => order.toDTO());
    } finally {
      client.release();
    }
  }

  async getOrderById(id) {
    const client = await pool.connect();
    try {
      const dbOrder = await this.orderRepository.getById(id, client);
      if (!dbOrder) throw new Error("Order not found");
      return Order.fromPersistence(dbOrder).toDTO();
    } finally {
      client.release();
    }
  }

  // Único lugar que sabe calcular el total real de una orden. Se usa en
  // createOrder, updateOrder y los tres endpoints puntuales de items para
  // no repetir el mismo SQL en cinco lugares distintos.
  async recalculateOrderTotal(orderId, client) {
    const totalRes = await client.query(
      `SELECT COALESCE(SUM(quantity * unit_price),0)::numeric AS total FROM public.order_items WHERE order_id = $1`,
      [orderId]
    );
    return totalRes.rows[0].total;
  }

  // ⚠️ `source` NUNCA debe venir del body del cliente: lo determina el
  // propio backend según qué ruta/controller invocó la creación
  // (dashboard = "pos", store = "app", n8n whatsapp = "whatsapp").
  async createOrder(orderDTO, source = "other") {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderPersistence = Order.fromDTO({ ...orderDTO, source }).toPersistenceForCreate();

      const savedOrder = await this.orderRepository.create(orderPersistence, client);
      const orderId = savedOrder.id_;

      for (const it of orderDTO.items || []) {
        const itemPersistence = Item.fromDTO(it).toPersistenceForCreate();
        await this.itemRepository.createForOrder(orderId, itemPersistence, client);
      }

      const newTotal = await this.recalculateOrderTotal(orderId, client);
      const finalOrder = await this.orderRepository.update(orderId, { total_amount: newTotal }, client);

      await client.query("COMMIT");
      return Order.fromPersistence(finalOrder).toDTO();
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Único punto de edición completa de una orden. Si `updateDTO.items`
   * viene, sincroniza items (crear/actualizar/borrar) y recalcula
   * `total_amount` dentro de la misma transacción. Si no viene, se
   * comporta como antes: solo actualiza los campos de la orden.
   *
   * `totalAmount` nunca puede llegar acá desde el cliente — ni el schema
   * de validación ni `Order.toPersistenceForUpdate()` lo aceptan.
   */
  async updateOrder(id, updateDTO) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderRow = await client.query(
        `SELECT * FROM public.orders WHERE id_ = $1 FOR UPDATE`,
        [id]
      );
      if (orderRow.rowCount === 0) throw new Error("Order not found");
      const currentOrder = Order.fromPersistence(orderRow.rows[0]);

      let finalItems = null;

      if (updateDTO.items !== undefined) {
        if (currentOrder.status !== "pending") {
          const err = new Error("Solo se pueden editar los items de una orden pendiente");
          err.code = "ORDER_NOT_EDITABLE";
          throw err;
        }
        if (updateDTO.items.length === 0) {
          const err = new Error("La orden debe tener al menos un producto");
          err.code = "ORDER_EMPTY_ITEMS";
          throw err;
        }

        const currentRows = await this.itemRepository.getByOrderId(id, client);
        const { toDelete, toCreate, toUpdate } = buildItemSyncPlan(currentRows, updateDTO.items);

        if (toDelete.length) {
          await this.itemRepository.deleteMany(toDelete, client);
        }

        for (const item of toUpdate) {
          const fields = Item.fromDTO(item).toPersistenceForUpdate();
          await this.itemRepository.updateFields(item.id, fields, client);
        }

        if (toCreate.length) {
          const persistence = toCreate.map((it) => Item.fromDTO(it).toPersistenceForCreate());
          await this.itemRepository.createForOrder(id, persistence, client);
        }
      }

      const fieldsToUpdate = Order.fromDTO(updateDTO).toPersistenceForUpdate();

      if (updateDTO.items !== undefined) {
        fieldsToUpdate.total_amount = await this.recalculateOrderTotal(id, client);
      }

      const updatedRow = Object.keys(fieldsToUpdate).length
        ? await this.orderRepository.update(id, fieldsToUpdate, client)
        : orderRow.rows[0];

      if (updateDTO.items !== undefined) {
        finalItems = await this.itemRepository.getByOrderId(id, client);
      }

      await client.query("COMMIT");

      const dto = Order.fromPersistence(updatedRow).toDTO();
      if (finalItems) {
        dto.items = finalItems.map((row) => Item.fromPersistence(row).toDTO());
      }
      return dto;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteOrder(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const deleted = await this.orderRepository.delete(id, client);
      if (!deleted) throw new Error("Order not found");

      await client.query("COMMIT");
      return deleted;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Se mantienen para ediciones puntuales de un solo item (ej. OrderDetails.jsx
  // en el flujo POS Local) que no necesitan mandar la orden completa.
  async addItemToOrder(orderId, itemDTO) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderRow = await client.query(
        `SELECT * FROM public.orders WHERE id_ = $1 FOR UPDATE`,
        [orderId]
      );
      if (orderRow.rowCount === 0) throw new Error("Order not found");

      const order = Order.fromPersistence(orderRow.rows[0]);
      if (order.status !== "pending")
        throw new Error("Only pending orders can be modified");

      const newItem = await this.itemRepository.createForOrder(orderId, itemDTO, client);

      const newTotal = await this.recalculateOrderTotal(orderId, client);
      await this.orderRepository.update(orderId, { total_amount: newTotal }, client);
      await client.query("COMMIT");

      return { newItem };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async updateItemInOrder(orderId, itemId, updateFields) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderRow = await client.query(
        `SELECT * FROM public.orders WHERE id_ = $1 FOR UPDATE`,
        [orderId]
      );
      if (orderRow.rowCount === 0) throw new Error("Order not found");

      const order = Order.fromPersistence(orderRow.rows[0]);
      if (order.status !== "pending")
        throw new Error("Only pending orders can be modified");

      const currentItem = await this.itemRepository.getById(itemId, client);
      if (!currentItem) throw new Error("Item not found");

      const updateFieldsRef = Item.fromDTO(updateFields).toPersistenceForUpdate();
      const updatedItem = await this.itemRepository.updateFields(itemId, updateFieldsRef, client);

      const newTotal = await this.recalculateOrderTotal(orderId, client);
      await this.orderRepository.update(orderId, { total_amount: newTotal }, client);
      await client.query("COMMIT");

      return { updatedItem };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteItemFromOrder(orderId, itemId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderRow = await client.query(
        `SELECT * FROM public.orders WHERE id_ = $1 FOR UPDATE`,
        [orderId]
      );
      if (orderRow.rowCount === 0) throw new Error("Order not found");

      const order = Order.fromPersistence(orderRow.rows[0]);
      if (order.status !== "pending")
        throw new Error("Only pending orders can be modified");

      await this.itemRepository.delete(itemId, client);

      const newTotal = await this.recalculateOrderTotal(orderId, client);
      await this.orderRepository.update(orderId, { total_amount: newTotal }, client);
      await client.query("COMMIT");

      return { deletedItemId: itemId };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
