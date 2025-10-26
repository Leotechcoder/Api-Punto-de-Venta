// src/modules/items/domain/Item.js

/**
 * Entidad de dominio OrderItem (Item dentro del agregado Order)
 * NOTE: los items son parte del agregado Order — no son Aggregate Roots.
 */

export class Item {
  constructor({ id_, order_id, product_id, product_name, description, unit_price, quantity }) {
    this.id_ = id_;
    this.order_id = order_id;
    this.product_id = product_id;
    this.product_name = product_name;
    this.description = description;
    this.unit_price = unit_price;
    this.quantity = quantity;
  }

  // Factory desde registro DB (snake_case)
  static fromPersistence(dbRecord) {
    if (!dbRecord) return null;
    return new Item({
      id_: dbRecord.id_,
      order_id: dbRecord.order_id,
      product_id: dbRecord.product_id,
      product_name: dbRecord.product_name,
      description: dbRecord.description,
      unit_price: dbRecord.unit_price,
      quantity: dbRecord.quantity,
    });
  }

  // Factory desde DTO (frontend -> camelCase)
  static fromDTO(dto) {
    if (!dto) return null;
    return new Item({
      id_: dto.id_ || dto.id,
      product_id: dto.productId || dto.product_id,
      product_name: dto.productName || dto.product_name,
      description: dto.description,
      unit_price: dto.unitPrice || dto.unit_price,
      quantity: dto.quantity,
    });
  }

  // Reglas de dominio
  updateQuantity(newQuantity) {
    const q = Number(newQuantity);
    if (!Number.isFinite(q) || q < 0) throw new Error("Quantity must be a non-negative number");
    this.quantity = q;
  }

  updatePrice(newPrice) {
    const p = Number(newPrice);
    if (!Number.isFinite(p) || p < 0) throw new Error("Unit price must be a non-negative number");
    this.unit_price = p;
  }

  updateDetails(fields = {}) {
    if (fields.quantity !== undefined) this.updateQuantity(fields.quantity);
    if (fields.unit_price !== undefined) this.updatePrice(fields.unit_price);
    if (fields.product_name !== undefined) this.product_name = fields.product_name;
    if (fields.description !== undefined) this.description = fields.description;
  }

  // Serializadores
  toDTO() {
    return {
      id: this.id_,
      orderId: this.order_id,
      productId: this.product_id,
      productName: this.product_name,
      description: this.description,
      unitPrice: this.unit_price,
      quantity: this.quantity,
    };
  }

  toPersistence() {
    return {
      id_: this.id_,
      order_id: this.order_id,
      product_id: this.product_id,
      product_name: this.product_name,
      description: this.description,
      unit_price: this.unit_price,
      quantity: this.quantity,
    };
  }

  toPersistenceForCreate() {
    return {
      product_id: this.product_id,
      product_name: this.product_name,
      description: this.description,
      unit_price: this.unit_price,
      quantity: this.quantity,
    };
  }

  toPersistenceForUpdate() {
    const fields = {};
    if (this.description !== undefined) fields.description = this.description;
    if (this.unit_price !== undefined) fields.unit_price = this.unit_price;
    if (this.quantity !== undefined) fields.quantity = this.quantity;
    return fields;
  }
}
