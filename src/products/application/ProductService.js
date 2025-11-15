import pool from "../../shared/infrastructure/postgresConnection.js";
import { idGenerator } from "../../shared/idGenerator.js";
import { Product } from "../domain/Product.js";

export class ProductService {
  constructor(productRepository) {
    this.repository = productRepository;
  }

  async getAllProducts() {
    const client = await pool.connect();
    try {
      const products = await this.repository.getAll(client);
      return products.map(Product.fromPersistence).map((p) => p.toDTO());
    } catch (error) {
      console.error("❌ [ProductService] Error en getAllProducts:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getProductById(id) {
    const client = await pool.connect();
    try {
      const record = await this.repository.getById(id, client);
      if (!record) return null;
      return Product.fromPersistence(record).toDTO();
    } catch (error) {
      console.error("❌ [ProductService] Error en getProductById:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async createProduct(data) {
    const client = await pool.connect();
    try {
      const id = idGenerator("Pr");
      const now = new Date().toISOString();

      const product = new Product({
        id,
        ...data,
        createdAt: now,
        updatedAt: null,
      });

      const record = await this.repository.create(
        product.toPersistenceForCreate(),
        client
      );
      return Product.fromPersistence(record).toDTO();
    } catch (error) {
      console.error("❌ [ProductService] Error en createProduct:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateProduct(id, data) {
    const client = await pool.connect();
    try {
      const existing = await this.repository.getById(id, client);
      if (!existing) return null;

      
      const product = Product.fromPersistence(existing);
      product.updateInfo(data);
      
      console.log(product);
      const updatedRecord = await this.repository.update(
        id,
        product.toPersistenceForUpdate(),
        client
      );

      return Product.fromPersistence(updatedRecord).toDTO();
    } catch (error) {
      console.error("❌ [ProductService] Error en updateProduct:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteProduct(id) {
    const client = await pool.connect();
    try {
      return await this.repository.delete(id, client);
    } catch (error) {
      console.error("❌ [ProductService] Error en deleteProduct:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
