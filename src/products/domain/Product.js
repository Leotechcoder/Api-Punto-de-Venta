// src/modules/products/domain/Product.js

export class Product {
  constructor({
    id,
    name,
    price,
    category,
    stock,
    imageUrl,
    description,
    available,
    cloudinaryId,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.imageUrl = imageUrl;
    this.description = description;
    this.available = available ?? true;
    this.cloudinaryId = cloudinaryId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // ✅ FACTORY METHODS

  /**
   * Crea una entidad Product a partir de un registro de base de datos (snake_case).
   */
  static fromPersistence(dbRecord) {
    return new Product({
      id: dbRecord.id_,
      name: dbRecord.name_,
      price: dbRecord.price,
      category: dbRecord.category,
      stock: dbRecord.stock,
      imageUrl: dbRecord.image_url,
      description: dbRecord.description,
      available: dbRecord.available,
      cloudinaryId: dbRecord.cloudinary_id,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at
    });
  }

  /**
   * Crea una entidad Product a partir de un DTO (camelCase).
   */
  static fromDTO(dto) {
    return new Product({
      id: dto.id,
      name: dto.name,
      price: dto.price,
      category: dto.category,
      stock: dto.stock,
      imageUrl: dto.imageUrl,
      description: dto.description,
      available: dto.available,
      cloudinaryId: dto.cloudinaryId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    });
  }

  // ✅ MÉTODOS DE DOMINIO

  updateInfo({ name, price, category, stock, imageUrl, description, available, cloudinaryId }) {
    if (name !== undefined) this.name = name;
    if (price !== undefined && price >= 0) this.price = price;
    if (category !== undefined) this.category = category;
    if (stock !== undefined && stock >= 0) this.stock = stock;
    if (imageUrl !== undefined) this.imageUrl = imageUrl;
    if (description !== undefined) this.description = description;
    if (available !== undefined) this.available = available;
    if (cloudinaryId !== undefined) this.cloudinaryId = cloudinaryId;
    this.updatedAt = new Date().toISOString();
  }

  updateStock(newStock) {
    if (newStock < 0) throw new Error("El stock no puede ser negativo");
    this.stock = newStock;
    this.updatedAt = new Date().toISOString();
  }

  toggleAvailability() {
    this.available = !this.available;
    this.updatedAt = new Date().toISOString();
  }

  // ✅ SERIALIZERS

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      stock: this.stock,
      imageUrl: this.imageUrl,
      description: this.description,
      available: this.available,
      cloudinaryId: this.cloudinaryId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toPersistence() {
    return {
      id_: this.id,
      name_: this.name,
      price: this.price,
      category: this.category,
      stock: this.stock,
      image_url: this.imageUrl,
      description: this.description,
      available: this.available,
      cloudinary_id: this.cloudinaryId,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  /**
   * Prepara un producto para inserción (CREATE) en la base de datos.
   * No incluye id_ ni created_at porque el repositorio o la app los generan.
   */
  toPersistenceForCreate() {
    return {
      id_: this.id,
      name_: this.name,
      price: this.price,
      category: this.category,
      stock: this.stock,
      image_url: this.imageUrl,
      description: this.description,
      available: this.available,
      cloudinary_id: this.cloudinaryId,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
  // Prepara un producto para actualización (UPDATE) en la base de datos.
  toPersistenceForUpdate() {
    return {
      name_: this.name,
      price: this.price,
      category: this.category,
      stock: this.stock,
      image_url: this.imageUrl,
      description: this.description,
      available: this.available,
      cloudinary_id: this.cloudinaryId,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
}
