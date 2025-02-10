import pool from "../../../shared/infrastructure/postgresConnection.js"
import { ProductRepository } from "../../application/ProductRepository.js"
import { Product } from "../../domain/Product.js"
import { idGenerator } from "../../../shared/idGenerator.js"

export class DatabaseProductRepository extends ProductRepository {
  async getAll() {
    const result = await pool.query("SELECT * FROM public.products")    
    return result.rows.map(
      (row) =>
        new Product(
          row.id_,
          row.name_,
          row.description,
          row.price,
          row.image_url,
          row.category,
          row.stock,
          row.available,
          row.state,
          row.created_at,
          row.updated_at,
        ),
    )
  }

  async getById(id) {
    const result = await pool.query("SELECT * FROM public.products WHERE id_ = $1", [id])
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return new Product(
      row.id_,
      row.name_,
      row.description,
      row.price,
      row.image_url,
      row.category,
      row.stock,
      row.available,
      row.state,
      row.created_at,
      row.updated_at,
    )
  }

  async create(productData) {
    const id = idGenerator("Products")
    const createdAt = new Date().toLocaleString()
    const newProduct = {
      id_: id,
      ...productData,
      created_at: createdAt,
      updated_at: createdAt,
    }
    const columns = Object.keys(newProduct).join(", ")
    const placeholders = Object.keys(newProduct)
      .map((_, index) => `$${index + 1}`)
      .join(", ")
    const values = Object.values(newProduct)

    const result = await pool.query(
      `INSERT INTO public.products (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    )
    const row = result.rows[0]
    return new Product(
      row.id_,
      row.name_,
      row.description,
      row.price,
      row.image_url,
      row.category,
      row.stock,
      row.available,
      row.state,
      row.created_at,
      row.updated_at,
    )
  }

  async update(id, productData) {
    const updatedAt = new Date().toLocaleString()
    const updateProduct = {
      ...productData,
      updated_at: updatedAt,
    }
    const setClause = Object.keys(updateProduct)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")
    const values = [id, ...Object.values(updateProduct)]

    const result = await pool.query(`UPDATE public.products SET ${setClause} WHERE id_ = $1 RETURNING *`, values)
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return new Product(
      row.id_,
      row.name_,
      row.description,
      row.price,
      row.image_url,
      row.category,
      row.stock,
      row.available,
      row.state,
      row.created_at,
      row.updated_at,
    )
  }

  async delete(id) {
    const result = await pool.query("DELETE FROM public.products WHERE id_ = $1", [id])
    return result.rowCount === 1
  }
}

