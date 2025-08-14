
import pool from "../../../shared/infrastructure/postgresConnection.js";
import { ProductRepository } from "../../application/ProductRepository.js";
import { Product } from "../../domain/Product.js";
import { idGenerator } from "../../../shared/idGenerator.js";

export class DatabaseProductRepository extends ProductRepository {
  async getAll() {
    try {
      const result = await pool.query("SELECT * FROM public.products");
      console.log(`El backend devuelve: ${result.rowCount} productos obtenidos desde el objeto ${result.rows}`);

      return result.rows.map((row) => new Product( 
        row.id_,
        row.name_,
        row.description,
        row.price,
        row.imageUrl,
        row.category,
        row.stock,
        row.available,
        row.created_at,
        row.updated_at));
    } catch (error) {
        console.error("❌ Error en getAll:", error);
        throw new Error("Error al obtener productos");
    }
  }

  async getById(id) {
    try {
      const result = await pool.query("SELECT * FROM public.products WHERE id_ = $1", [id]);
      if (result.rows.length === 0) return null;
      return new Product(...Object.values(result.rows[0]));
    } catch (error) {
      console.error("❌ Error en getById:", error);
      throw new Error("Error al obtener producto");
    }
  }

  async create(productData) {
    try {
      const id = idGenerator("Products");
      const createdAt = new Date().toISOString();
      const newProduct = { id_: id, ...productData, created_at: createdAt, available: true };
      const columns = Object.keys(newProduct).join(", ");
      const placeholders = Object.keys(newProduct).map((_, i) => `$${i + 1}`).join(", ");
      const values = Object.values(newProduct);
      
      const result = await pool.query(
        `INSERT INTO public.products (${columns}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      return new Product(...Object.values(result.rows[0]));
    } catch (error) {
      console.error("❌ Error en create:", error);
      throw new Error("Error al crear producto");
    }
  }

  async update(id, productData) {
    try {
      const updatedAt = new Date().toISOString();
      const updateProduct = { ...productData, updated_at: updatedAt };
      const setClause = Object.keys(updateProduct)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");
      const values = [id, ...Object.values(updateProduct)];

      const result = await pool.query(
        `UPDATE public.products SET ${setClause} WHERE id_ = $1 RETURNING *`,
        values
      );
      if (result.rows.length === 0) return null;
      return new Product(...Object.values(result.rows[0]));
    } catch (error) {
      console.error("❌ Error en update:", error);
      throw new Error("Error al actualizar producto");
    }
  }

  async delete(id) {
    try {
      const result = await pool.query("DELETE FROM public.products WHERE id_ = $1", [id]);
      return result.rowCount === 1;
    } catch (error) {
      console.error("❌ Error en delete:", error);
      throw new Error("Error al eliminar producto");
    }
  }
}
