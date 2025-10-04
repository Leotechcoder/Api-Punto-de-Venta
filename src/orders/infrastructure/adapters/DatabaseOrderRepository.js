import pool from "../../../shared/infrastructure/postgresConnection.js";
import { OrderRepository } from "../../application/OrderRepository.js";
import { Order } from "../../domain/Order.js";
import { idGenerator } from "../../../shared/idGenerator.js";

export class DatabaseOrderRepository extends OrderRepository {
  async getAll() {
    const result = await pool.query("SELECT * FROM public.orders");
    return result.rows; // Devolvemos datos crudos, el servicio los transforma
  }

  async getById(id) {
    const result = await pool.query("SELECT * FROM public.orders WHERE id_ = $1", [id]);
    return result.rows[0] || null;
  }

  async create(orderData) {
    const createdAt = new Date().toISOString();
    const newOrder = {
      id_: idGenerator(),
      ...orderData,
      created_at: createdAt,
      updated_at: null,
    };

    const columns = Object.keys(newOrder).join(", ");
    const placeholders = Object.keys(newOrder)
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const values = Object.values(newOrder);

    const result = await pool.query(
      `INSERT INTO public.orders (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  async update(id, orderData) {
    const updatedAt = new Date().toISOString();
    const updateOrder = {
      ...orderData,
      updated_at: updatedAt,
    };

    const setClause = Object.keys(updateOrder)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = [id, ...Object.values(updateOrder)];

    const result = await pool.query(
      `UPDATE public.orders SET ${setClause} WHERE id_ = $1 RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  async delete(id) {
    await pool.query("DELETE FROM order_items WHERE order_id = $1", [id]);
    const result = await pool.query("DELETE FROM public.orders WHERE id_ = $1", [id]);
    return result.rowCount === 1;
  }
}
