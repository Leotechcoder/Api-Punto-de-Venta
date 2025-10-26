// src/modules/orders/application/OrderService.js
import { Item } from "../../items/domain/Item.js";
import pool from "../../shared/infrastructure/postgresConnection.js";
import { Order } from "../domain/Order.js";

export class OrderService {
  constructor(orderRepository, itemRepository) {
    this.orderRepository = orderRepository;
    this.itemRepository = itemRepository;
  }

  async getAllOrders() {
    const client = await pool.connect();
    const dbOrders = await this.orderRepository.getAll(client);
    return dbOrders.map(Order.fromPersistence).map((order) => order.toDTO());
  }

  async getOrderById(id) {
    const client = await pool.connect();
    const dbOrder = await this.orderRepository.getById(id, client);
    if (!dbOrder) throw new Error("Order not found");
    return Order.fromPersistence(dbOrder).toDTO();
  }

  async createOrder(orderDTO) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderPersistence = Order.fromDTO(orderDTO).toPersistenceForCreate();
      
      const savedOrder = await this.orderRepository.create(orderPersistence, client);
      const orderId = savedOrder.id_;
      

      // Insertar items asociados
      for (const it of (orderDTO.items || [])) {
        const itemPersistence = Item.fromDTO(it).toPersistenceForCreate()
        await this.itemRepository.createForOrder(orderId, itemPersistence, client);
      }

      // Recalcular total
      const totalRes = await client.query(
        `SELECT COALESCE(SUM(quantity * unit_price),0)::numeric AS total FROM public.order_items WHERE order_id = $1`,
        [orderId]
      );
      const newTotal = totalRes.rows[0].total;

      await this.orderRepository.update(orderId, { total_amount: newTotal }, client);
      await client.query("COMMIT");

      return Order.fromPersistence(savedOrder).toDTO();
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


  async addItemToOrder(orderId, itemDTO) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderRow = await client.query(`SELECT * FROM public.orders WHERE id_ = $1 FOR UPDATE`, [orderId]);
      if (orderRow.rowCount === 0) throw new Error("Order not found");

      const order = Order.fromPersistence(orderRow.rows[0]);
      if (order.status !== "pending") throw new Error("Only pending orders can be modified");

      const newItem = await this.itemRepository.createForOrder(orderId, itemDTO, client);

      const totalRes = await client.query(
        `SELECT COALESCE(SUM(quantity * unit_price),0)::numeric AS total FROM public.order_items WHERE order_id = $1`,
        [orderId]
      );
      const newTotal = totalRes.rows[0].total;

      await this.orderRepository.update(orderId, { total_amount: newTotal }, client);
      await client.query("COMMIT");

      return { newItem, total: newTotal };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async updateItemInOrder(orderId, itemId, updateFields) {
    const client = await pool.connect();
      console.log(updateFields);

    try {
      await client.query("BEGIN");

      const orderRow = await client.query(`SELECT * FROM public.orders WHERE id_ = $1 FOR UPDATE`, [orderId]);
      if (orderRow.rowCount === 0) throw new Error("Order not found");

      const order = Order.fromPersistence(orderRow.rows[0]);
      if (order.status !== "pending") throw new Error("Only pending orders can be modified");

      const currentItem = await this.itemRepository.getById(itemId, client);
      if (!currentItem) throw new Error("Item not found");

      const updateFieldsRef = Item.fromDTO(updateFields).toPersistenceForUpdate();
      console.log(updateFieldsRef);
      
      const updatedItem = await this.itemRepository.updateFields(itemId, updateFieldsRef, client);

      const totalRes = await client.query(
        `SELECT COALESCE(SUM(quantity * unit_price),0)::numeric AS total FROM public.order_items WHERE order_id = $1`,
        [orderId]
      );
      const newTotal = totalRes.rows[0].total;

      await this.orderRepository.update(orderId, { total_amount: newTotal }, client);
      await client.query("COMMIT");

      return { updatedItem, total: newTotal };
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

      const orderRow = await client.query(`SELECT * FROM public.orders WHERE id_ = $1 FOR UPDATE`, [orderId]);
      if (orderRow.rowCount === 0) throw new Error("Order not found");

      const order = Order.fromPersistence(orderRow.rows[0]);
      if (order.status !== "pending") throw new Error("Only pending orders can be modified");

      await this.itemRepository.delete(itemId, client);

      const totalRes = await client.query(
        `SELECT COALESCE(SUM(quantity * unit_price),0)::numeric AS total FROM public.order_items WHERE order_id = $1`,
        [orderId]
      );
      const newTotal = totalRes.rows[0].total;

      await this.orderRepository.update(orderId, { total_amount: newTotal }, client);
      await client.query("COMMIT");

      return { deletedItemId: itemId, total: newTotal };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
