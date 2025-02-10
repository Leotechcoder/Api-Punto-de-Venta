import pool from "../../../shared/infrastructure/postgresConnection.js"
import { OrderRepository } from "../../application/OrderRepository.js"
import { Order } from "../../domain/Order.js"
import { idGenerator } from "../../../shared/idGenerator.js"

export class DatabaseOrderRepository extends OrderRepository {
  async getAll() {
    const result = await pool.query("SELECT * FROM public.orders")
    return result.rows.map(
      (row) =>
        new Order(
          row.id_,
          row.user_id,
          row.user_name,
          row.total_amount,
          row.status,
          row.items_id,
          row.created_at,
          row.updated_at,
        ),
    )
  }

  async getById(id) {
    const result = await pool.query("SELECT * FROM public.orders WHERE id_ = $1", [id])
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return new Order(
      row.id_,
      row.user_id,
      row.user_name,
      row.total_amount,
      row.status,
      row.items_id,
      row.created_at,
      row.updated_at,
    )
  }

  async create(orderData) {
    const id = idGenerator("Orders")
    const createdAt = new Date().toLocaleString()
    const newOrder = {
      id_: id,
      ...orderData,
      created_at: createdAt,
      updated_at: createdAt,
    }
    const columns = Object.keys(newOrder).join(", ")
    const placeholders = Object.keys(newOrder)
      .map((_, index) => `$${index + 1}`)
      .join(", ")
    const values = Object.values(newOrder)

    const result = await pool.query(
      `INSERT INTO public.orders (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    )
    const row = result.rows[0]
    return new Order(
      row.id_,
      row.user_id,
      row.user_name,
      row.total_amount,
      row.status,
      row.items_id,
      row.created_at,
      row.updated_at,
    )
  }

  async update(id, orderData) {
    const updatedAt = new Date().toLocaleString()
    const updateOrder = {
      ...orderData,
      updated_at: updatedAt,
    }
    const setClause = Object.keys(updateOrder)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")
    const values = [id, ...Object.values(updateOrder)]

    const result = await pool.query(`UPDATE public.orders SET ${setClause} WHERE id_ = $1 RETURNING *`, values)
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return new Order(
      row.id_,
      row.user_id,
      row.user_name,
      row.total_amount,
      row.status,
      row.items_id,
      row.created_at,
      row.updated_at,
    )
  }

  async delete(id) {
    await pool.query("DELETE FROM items WHERE order_id = $1", [id])
    const result = await pool.query("DELETE FROM public.orders WHERE id_ = $1", [id])
    return result.rowCount === 1
  }
}

