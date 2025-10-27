import { ProductRepository } from "../../application/ProductRepository.js";

export class DatabaseProductRepository extends ProductRepository {
  async getAll(client) {
    try {
      const result = await client.query("SELECT * FROM public.products");
      console.log(`✅ ${result.rowCount} productos obtenidos`);
      return result.rows;
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      throw new Error("Error al obtener productos");
    }
  }

  async getById(id, client) {
    try {
      const result = await client.query(
        "SELECT * FROM public.products WHERE id_ = $1",
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error en getById:", error);
      throw new Error("Error al obtener producto");
    }
  }

  async create(newProduct, client) {
    try {
      const columns = Object.keys(newProduct).join(", ");
      const placeholders = Object.keys(newProduct)
        .map((_, i) => `$${i + 1}`)
        .join(", ");
      const values = Object.values(newProduct);

      const result = await client.query(
        `INSERT INTO public.products (${columns}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en create:", error);
      throw new Error("Error al crear producto");
    }
  }

  async update(id, data, client) {
    try {
      delete data.id;
      delete data.id_;
      delete data.created_at;
      delete data.createdAt;

      const setClause = Object.keys(data)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
      const values = Object.values(data);

      if (!setClause) {
        console.warn("⚠️ No hay campos válidos para actualizar en el producto");
        return null;
      }

      const result = await client.query(
        `UPDATE public.products SET ${setClause} WHERE id_ = $${
          values.length + 1
        } RETURNING *`,
        [...values, id]
      );

      if (!result.rows.length) return null;
      console.log(`🛠 Producto con ID ${id} actualizado correctamente`);
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en update:", error);
      throw new Error("Error al actualizar producto");
    }
  }

  async delete(id, client) {
    try {
      const result = await client.query(
        "DELETE FROM public.products WHERE id_ = $1",
        [id]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error("❌ Error en delete:", error);
      throw new Error("Error al eliminar producto");
    }
  }
}
