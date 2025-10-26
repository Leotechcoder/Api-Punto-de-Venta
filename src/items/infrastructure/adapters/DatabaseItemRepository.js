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

  async createForOrder(orderId, items, client) {
    // Asegurarse de que siempre sea un array
    const itemsArray = Array.isArray(items) ? items : [items];

    // Generar los valores dinámicos
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
    return result.rows; // devuelve un array de items insertados
  }

  async updateFields(itemId, { description, quantity }, client) {
  const q = `
    UPDATE public.order_items
    SET 
      description = $1,
      quantity = $2
    WHERE id_ = $3
    RETURNING *;
  `;
  const values = [description, quantity, itemId];
  const result = await client.query(q, values);
  return result.rows[0] || null;
}

  async delete(itemId, client) {
    await client.query(`DELETE FROM public.order_items WHERE id_ = $1`, [
      itemId,
    ]);
    return true;
  }
}
