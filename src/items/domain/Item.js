// src/modules/items/domain/Item.js

/**
 * Entidad de dominio OrderItem (Item dentro del agregado Order)
 * NOTE: los items son parte del agregado Order — no son Aggregate Roots.
 */

export class Item {
  constructor({ id_, order_id, product_id, product_name, unit_price, quantity, size, pizza_type, additional_comments }) {
    this.id_ = id_;
    this.order_id = order_id;
    this.product_id = product_id;
    this.product_name = product_name;
    this.unit_price = unit_price;
    this.quantity = quantity;
    this.size = size;
    this.pizza_type = pizza_type;
    this.additional_comments = additional_comments;
  }

  // Factory desde registro DB (snake_case)
  static fromPersistence(dbRecord) {
    if (!dbRecord) return null;
    return new Item({
      id_: dbRecord.id_,
      order_id: dbRecord.order_id,
      product_id: dbRecord.product_id,
      product_name: dbRecord.product_name,
      unit_price: dbRecord.unit_price,
      quantity: dbRecord.quantity,
      size: dbRecord.size,
      pizza_type: dbRecord.pizza_type,
      additional_comments: dbRecord.additional_comments,
    });
  
  }

  // Factory desde DTO (frontend -> camelCase)
  static fromDTO(dto) {
    if (!dto) return null;
    return new Item({
      id_: dto.id_ || dto.id,
      product_id: dto.productId || dto.product_id,
      product_name: dto.productName || dto.product_name,
      unit_price: dto.unitPrice || dto.unit_price,
      quantity: dto.quantity,
      size: dto.size,
      pizza_type: dto.pizzaType || dto.pizza_type,
      additional_comments: dto.additionalComments || dto.additional_comments,
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
    if (fields.size !== undefined) this.size = fields.size;
    if (fields.pizza_type !== undefined) this.pizza_type = fields.pizza_type;
    if (fields.additional_comments !== undefined) this.additional_comments = fields.additional_comments;
  }

  // Serializadores
  toDTO() {
    return {
      id: this.id_,
      orderId: this.order_id,
      productId: this.product_id,
      productName: this.product_name,
      unitPrice: this.unit_price,
      quantity: this.quantity,
      size: this.size,
      pizzaType: this.pizza_type,
      additionalComments: this.additional_comments,
    };
  }

  toPersistence() {
    return {
      id_: this.id_,
      order_id: this.order_id,
      product_id: this.product_id,
      product_name: this.product_name,
      unit_price: this.unit_price,
      quantity: this.quantity,
      size: this.size,
      pizza_type: this.pizza_type,
      additional_comments: this.additional_comments,
    };
  }

  toPersistenceForCreate() {
    return {
      product_id: this.product_id,
      product_name: this.product_name,
      unit_price: this.unit_price,
      quantity: this.quantity,
      size: this.size,
      pizza_type: this.pizza_type,
      additional_comments: this.additional_comments,
    };
  }

  toPersistenceForUpdate() {
    const fields = {};
    if (this.unit_price !== undefined) fields.unit_price = this.unit_price;
    if (this.quantity !== undefined) fields.quantity = this.quantity;
    if (this.size !== undefined) fields.size = this.size;
    if (this.pizza_type !== undefined) fields.pizza_type = this.pizza_type;
    if (this.additional_comments !== undefined) fields.additional_comments = this.additional_comments;undefined;
    return fields;
  }
}
