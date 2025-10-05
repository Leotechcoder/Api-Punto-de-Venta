import { Product } from "./Product.js";

export class ProductFactory {
  static create(productData, idGenerator) {
    const id = idGenerator("Products");
    const createdAt = new Date().toISOString();

    return new Product({
      id_: id,
      name_: productData.name,
      price: productData.price,
      category: productData.category,
      stock: productData.stock,
      image_url: productData.image_url,
      description: productData.description,
      available: true,
      created_at: createdAt,
      updated_at: null,
    });
  }

  static prepareUpdate(id, productData, existingProduct) {
    const updatedAt = new Date().toISOString();

    const validFields = Object.entries(productData).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) acc[key] = value;
      return acc;
    }, {});

    return new Product({
      ...existingProduct,
      ...validFields,
      id_: id,
      updated_at: updatedAt,
    });
  }
}
