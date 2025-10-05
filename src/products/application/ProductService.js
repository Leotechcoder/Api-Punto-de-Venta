// src/products/application/ProductService.js
import { idGenerator } from "../../shared/idGenerator.js";
import { Product } from "../domain/Product.js";
import { ProductFactory } from "../domain/productFactory.js";

export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  // Obtener todos los productos (BD → dominio)
  async getAllProducts() {
    const products = await this.productRepository.getAll();
    return products.map((row) => new Product(row));
  }

  // Obtener producto por ID
  async getProductById(id) {
    const p = await this.productRepository.getById(id);
    if (!p) throw new Error("Producto no encontrado");
    return new Product(p);
  }

  // Crear producto nuevo (frontend → dominio → BD)
  async createProduct(productData) {
    const product = ProductFactory.create(productData, idGenerator);
    const persistedProduct = await this.productRepository.create(product.toPersistence());
    return new Product(persistedProduct); // devolvemos normalizado (camelCase)
  }

  // Actualizar producto existente
  async updateProduct(id, productData) {
    const existingProduct = await this.productRepository.getById(id);
    if (!existingProduct) throw new Error("Producto no encontrado");

    const updatedProduct = ProductFactory.prepareUpdate(id, productData, existingProduct);
    const persistedProduct = await this.productRepository.update(updatedProduct.toPersistence());
    return new Product(persistedProduct);
  }

  // Eliminar producto
  async deleteProduct(id) {
    return await this.productRepository.delete(id);
  }
}
