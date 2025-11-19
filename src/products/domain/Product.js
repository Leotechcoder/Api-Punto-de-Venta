// src/modules/products/domain/Product.js

export class Product {
  constructor({
    id,
    name,
    price,
    category,
    stock,
    description,
    available,
    images = [],
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.description = description;
    this.available = available ?? true;
    this.images = images; // ← ahora maneja array de imágenes
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // ---------- FACTORY: DB → ENTIDAD ----------
  static fromPersistence(dbRecord) {
    return new Product({
      id: dbRecord.id_,
      name: dbRecord.name_,
      price: dbRecord.price,
      category: dbRecord.category,
      stock: dbRecord.stock,
      description: dbRecord.description,
      available: dbRecord.available,
      images: dbRecord.images || [], // ← añadimos imágenes
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at,
    });
  }

  // ---------- FACTORY: DTO → ENTIDAD ----------
  static fromDTO(dto) {
    return new Product({
      id: dto.id,
      name: dto.name,
      price: dto.price,
      category: dto.category,
      stock: dto.stock,
      description: dto.description,
      available: dto.available,
      images: dto.images || [],
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    });
  }

  // ---------- DOMINIO ----------
  updateInfo({ name, price, category, stock, description, available }) {
    if (name !== undefined) this.name = name;
    if (price !== undefined && price >= 0) this.price = price;
    if (category !== undefined) this.category = category;
    if (stock !== undefined && stock >= 0) this.stock = stock;
    if (description !== undefined) this.description = description;
    if (available !== undefined) this.available = available;
    this.updatedAt = new Date().toISOString();
  }

  // ---------- SERIALIZERS ----------
  toDTO() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      stock: this.stock,
      description: this.description,
      available: this.available,
      images: this.images,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toPersistenceForCreate() {
    return {
      id_: this.id,
      name_: this.name,
      price: this.price,
      category: this.category,
      stock: this.stock,
      description: this.description,
      available: this.available,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  toPersistenceForUpdate() {
    return {
      name_: this.name,
      price: this.price,
      category: this.category,
      stock: this.stock,
      description: this.description,
      available: this.available,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
