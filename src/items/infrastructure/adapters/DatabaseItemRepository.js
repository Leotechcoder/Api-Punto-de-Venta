// src/modules/items/infrastructure/DatabaseItemRepository.js
import { ItemRepository } from "../../application/ItemRepository.js";
import { idGenerator } from "../../../shared/idGenerator.js";

export class DatabaseItemRepository extends ItemRepository {
  async getAll(client) {
    const result = await client.query("SELECT * FROM public.order_items");
    return result.rows;
  }

  async getById(id, client) {
    const result = await client.query(
      "SELECT * FROM public.order_items WHERE id_ = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  // Usado por el sync de PATCH /orders/:id para comparar estado actual vs recibido.
  async getByOrderId(orderId, client) {
    const result = await client.query(
      "SELECT * FROM public.order_items WHERE order_id = $1",
      [orderId]
    );
    return result.rows;
  }

  async createForOrder(orderId, items, client) {
    const itemsArray = Array.isArray(items) ? items : [items];
    if (!itemsArray.length) return [];

    const values = [];
    const placeholders = [];

    itemsArray.forEach((item, index) => {
      const itemId = idGenerator("Items");
      const baseIndex = index * 7;

      placeholders.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${
          baseIndex + 4
        }, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7})`
      );

      values.push(
        itemId,
        orderId,
        item.product_id,
        item.product_name,
        item.description,
        item.quantity,
        item.unit_price
      );
    });

    const query = `
    INSERT INTO public.order_items 
      (id_, order_id, product_id, product_name, description, quantity, unit_price)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;

    const result = await client.query(query, values);
    return result.rows;
  }

  // ⚠️ Antes solo persistía description/quantity. El sync de PATCH /orders/:id
  // también puede necesitar actualizar unit_price (ej: cambió el precio del
  // producto entre que se agregó y se guardó la orden), así que se agrega acá.
  async updateFields(itemId, { description, quantity, unit_price }, client) {
    const q = `
      UPDATE public.order_items
      SET 
        description = $1,
        quantity = $2,
        unit_price = $3
      WHERE id_ = $4
      RETURNING *;
    `;
    const values = [description, quantity, unit_price, itemId];
    const result = await client.query(q, values);
    return result.rows[0] || null;
  }

  async delete(itemId, client) {
    await client.query(`DELETE FROM public.order_items WHERE id_ = $1`, [
      itemId,
    ]);
    return true;
  }

  // Usado por el sync para borrar en un solo query los items que ya no
  // están en la lista recibida, en vez de un DELETE por cada uno.
  async deleteMany(ids, client) {
    if (!ids?.length) return 0;
    const result = await client.query(
      `DELETE FROM public.order_items WHERE id_ = ANY($1::text[])`,
      [ids]
    );
    return result.rowCount;
  }
}
