import pool from "../../../shared/infrastructure/postgresConnection.js";
import { ProductRepository } from "../../application/ProductRepository.js";

export class DatabaseProductRepository extends ProductRepository {
  async getAll() {
    try {
      
      const result = await pool.query("SELECT * FROM public.products");
      console.log(`El backend devuelve: ${result.rowCount} productos obtenidos desde el objeto`);
      console.log(result.rows);
      
      return result.rows;

    } catch (error) {
      console.error("❌ Error en getAll:", error);
      throw new Error("Error al obtener productos");
    }
  }

  async getById(id) {
    try {
      const result = await pool.query(
        "SELECT * FROM public.products WHERE id_ = $1",
        [id]
      );
      if (result.rows.length === 0) return null;
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en getById:", error);
      throw new Error("Error al obtener producto");
    }
  }

  async create(newProduct) {
    try {
      const columns = Object.keys(newProduct).join(", ");
      const placeholders = Object.keys(newProduct)
        .map((_, i) => `$${i + 1}`)
        .join(", ");
      const values = Object.values(newProduct);

      const result = await pool.query(
        `INSERT INTO public.products (${columns}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en create:", error);
      throw new Error("Error al crear producto");
    }
  }

  async update(updateProduct) {
    try {
      // Generamos la cláusula SET y los valores
      const setClause = Object.keys(updateProduct)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
      const values = Object.values(updateProduct);

      // El ID va al final para el WHERE
      const result = await pool.query(
        `UPDATE public.products SET ${setClause} WHERE id_ = $${values.length + 1} RETURNING *`,
        [...values, updateProduct.id_]
      );
      
      if (result.rows.length === 0) return null;
      console.log(`Producto con ID ${updateProduct.id_} actualizado:`, result.rows[0]);
      return result.rows[0]
    } catch (error) {
      console.error("❌ Error en update:", error);
      throw new Error("Error al actualizar producto");
    }
  }

  async delete(id) {
    try {
      const result = await pool.query(
        "DELETE FROM public.products WHERE id_ = $1",
        [id]
      );
      return result.rowCount === 1;
    } catch (error) {
      console.error("❌ Error en delete:", error);
      throw new Error("Error al eliminar producto");
    }
  }
}
