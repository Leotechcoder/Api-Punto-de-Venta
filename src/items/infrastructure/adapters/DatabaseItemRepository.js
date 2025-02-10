import pool from "../../../shared/infrastructure/postgresConnection.js"
import { ItemRepository } from "../../application/ItemRepository.js"
import { idGenerator } from "../../../shared/idGenerator.js"

export class DatabaseItemRepository extends ItemRepository {
  async getAll() {
    const result = await pool.query("SELECT * FROM public.items")
    return result.rows
  }

  async getById(id) {
    const result = await pool.query("SELECT * FROM public.items WHERE id = $1", [id])
    return result.rows[0] || null
  }

  async create(items) {
    const insertedItems = []
    for (const item of items) {
      const id = idGenerator("Items")
      const { order_id, product_id, product_name, description, quantity, unit_price } = item
      const result = await pool.query(
        "INSERT INTO public.items (id, order_id, product_id, product_name, description, quantity, unit_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [id, order_id, product_id, product_name, description, quantity, unit_price],
      )
      insertedItems.push(result.rows[0])
    }
    return insertedItems
  }

  async update(id, itemData) {
    const { product_name, description, quantity, unit_price } = itemData
    const result = await pool.query(
      "UPDATE public.items SET product_name = $1, description = $2, quantity = $3, unit_price = $4 WHERE id = $5 RETURNING *",
      [product_name, description, quantity, unit_price, id],
    )
    return result.rows[0]
  }

  async delete(id) {
    await pool.query("DELETE FROM public.items WHERE id = $1", [id])
    return true
  }
}

