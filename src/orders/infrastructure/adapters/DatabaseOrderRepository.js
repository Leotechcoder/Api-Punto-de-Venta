// src/modules/orders/infrastructure/DatabaseOrderRepository.js
import { OrderRepository } from "../../application/OrderRepository.js";
import { idGenerator } from "../../../shared/idGenerator.js";

export class DatabaseOrderRepository extends OrderRepository {
  async getAll(client) {
    const result = await client.query("SELECT * FROM public.orders");
    return result.rows;
  }

  async getById(id, client) {
    const result = await client.query("SELECT * FROM public.orders WHERE id_ = $1", [id]);
    return result.rows[0] || null;
  }

  async create(orderData, client) {
    const created_at = new Date().toISOString();
    const newOrder = { id_:idGenerator("Orders"), ...orderData, created_at };
    const cols = Object.keys(newOrder).join(", ");
    const ph = Object.keys(newOrder).map((_, i) => `$${i + 1}`).join(", ");
    const vals = Object.values(newOrder);
    const result = await client.query(
      `INSERT INTO public.orders (${cols}) VALUES (${ph}) RETURNING *`,
      vals
    );
    console.log("Created Order:", result.rows[0]);
    return result.rows[0];
  }

  async update(id, orderData, client) {
    if (!orderData || Object.keys(orderData).length === 0) return null;
    const setClause = Object.keys(orderData)
      .map((k, i) => `${k} = $${i + 2}`)
      .join(", ");
    const values = [id, ...Object.values(orderData)];
    const result = await client.query(
      `UPDATE public.orders SET ${setClause} WHERE id_ = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id, client) {
    const result = await client.query("DELETE FROM public.orders WHERE id_ = $1", [id]);
    return result.rowCount === 1;
  }
}
