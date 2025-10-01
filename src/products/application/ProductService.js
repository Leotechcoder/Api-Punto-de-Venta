import { idGenerator } from "../../shared/idGenerator.js";
import { Product } from "../domain/Product.js";

export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts() {
    const products = await this.productRepository.getAll();
    return products.map(
      (row) =>
        new Product(
          row.id_,
          row.name_,
          row.price,
          row.category,
          row.stock,
          row.image_url,
          row.description,
          row.available,
          row.created_at,
          row.updated_at
        )
    );
  }

  async getProductById(id) {
    const p = await this.productRepository.getById(id);
    return new Product(
      p.id_,
      p.name_,
      p.price,
      p.category,
      p.stock,
      p.image_url,
      p.description,
      p.available,
      p.created_at,
      p.updated_at
    );
  }

  async createProduct(productData) {
    const id = idGenerator("Products");
    const createdAt = new Date().toISOString();
    const product = new Product(
      id,
      productData.name,
      productData.price,
      productData.category,
      productData.stock,
      productData.image_url,
      productData.description,
      null,
      createdAt
    );
    return await this.productRepository.create(product);
  }

  async updateProduct(id, productData) {
    const updatedAt = new Date().toISOString();
    const updateProduct = new Product(
      id,
      productData.name,
      productData.price,
      productData.category,
      productData.stock,
      productData.image_url,
      productData.description,
      productData.available,
      updatedAt
    );
    return await this.productRepository.update(updateProduct);
  }

  async deleteProduct(id) {
    return await this.productRepository.delete(id);
  }
}
