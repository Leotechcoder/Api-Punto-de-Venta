// src/modules/products/domain/ProductFactory.js
import { Product } from "./Product.js";

export class ProductFactory {
  /**
   * Crea una nueva instancia de Product desde datos crudos del frontend.
   * @param {object} productData - Datos provenientes del frontend.
   * @param {function} idGenerator - Función para generar IDs únicos.
   * @returns {Product}
   */
  static create(productData, idGenerator) {
    const id = idGenerator("Pr"); // prefijo consistente con órdenes: Or-, It-, Us-, etc.
    const createdAt = new Date().toISOString();

    return new Product({
      id,
      name: productData.name,
      price: productData.price,
      category: productData.category,
      stock: productData.stock,
      imageUrl: productData.image_url || null,
      description: productData.description || null,
      available: productData.available ?? true,
      createdAt,
      updatedAt: null,
    });
  }

  /**
   * Prepara una instancia de Product para actualización parcial.
   * Combina datos existentes + nuevos campos válidos.
   * @param {string} id - ID del producto a actualizar.
   * @param {object} productData - Campos nuevos enviados por el cliente.
   * @param {object} existingProduct - Producto actual recuperado del repositorio.
   * @returns {Product}
   */
  static prepareUpdate(id, productData, existingProduct) {
  const updatedAt = new Date().toISOString();

  const validFields = Object.entries(productData).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && key !== "id") acc[key] = value;
    return acc;
  }, {});

  return new Product({
    ...existingProduct,
    ...validFields,
    // id, // <-- solo para referencia interna, no debe terminar en SET
    updatedAt,
  });
}
}
