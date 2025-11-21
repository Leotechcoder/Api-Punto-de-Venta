import pool from "../../shared/infrastructure/postgresConnection.js";
import { idGenerator } from "../../shared/idGenerator.js";
import { Product } from "../domain/Product.js";

export class ProductService {
  constructor(productRepository, imagesRepository) {
    this.repository = productRepository;
    this.images = imagesRepository;
  }

  async getAllProducts() {
    const client = await pool.connect();
    try {
      const products = await this.repository.getAll(client);
      
      for (let product of products) {
        const imgs = await this.images.getImagesByProduct(product.id_, client);
        
        product.images = imgs;
      }

      const productsNew = products.map(Product.fromPersistence).map((p) => p.toDTO());
      return productsNew;
    } finally {
      client.release();
    }
  }

  async getProductById(id) {
    const client = await pool.connect();
    try {
      const record = await this.repository.getById(id, client);
      if (!record) return null;

      const images = await this.images.getImagesByProduct(record.id_, client);
      record.images = images;

      return Product.fromPersistence(record).toDTO();
    } finally {
      client.release();
    }
  }

  async createProduct(data, images) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

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

      let finalImages = [];
      if (images?.length) {
        let position = 0;
        for (const img of images) {
          const saved = await this.images.addImage(
            record.id_,
            img.url,
            img.cloudinaryId,
            position,
            client
          );
          finalImages.push(saved);
          position++;
        }
      }

      await client.query("COMMIT");

      return {
        ...Product.fromPersistence(record).toDTO(),
        images: finalImages,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateProduct(id, data, newImages, imagesToDelete, newOrder) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const existing = await this.repository.getById(id, client);
      if (!existing) return null;

      const product = Product.fromPersistence(existing);
      product.updateInfo(data);

      const updatedRecord = await this.repository.update(
        id,
        product.toPersistenceForUpdate(),
        client
      );

      if (imagesToDelete?.length) {
        for (const imageId of imagesToDelete) {
          await this.images.deleteImage(imageId, client);
        }
      }

      if (newImages?.length) {
        let position = 0;
        const current = await this.images.getImagesByProduct(id, client);
        if (current.length) {
          position = current.length;
        }

        for (const img of newImages) {
          await this.images.addImage(id, img.url, img.cloudinaryId, position, client);
          position++;
        }
      }

      if (newOrder?.length) {
        await this.images.updateImagePositions(id, newOrder, client);
      }

      await client.query("COMMIT");

      const finalImages = await this.images.getImagesByProduct(id, client);

      return {
        ...Product.fromPersistence(updatedRecord).toDTO(),
        images: finalImages,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteProduct(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await this.images.deleteImagesByProduct(id, client);

      const deleted = await this.repository.delete(id, client);

      await client.query("COMMIT");

      return deleted;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
