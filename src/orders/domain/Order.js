export class Order {
  constructor({ id, userId, userName, totalAmount, status, items, createdAt, updatedAt, paymentInfo, deliveryType }) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.totalAmount = totalAmount;
    this.status = status || "pending";
    this.items = items || [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.paymentInfo = paymentInfo;
    this.deliveryType = deliveryType
  }

  // FACTORY METHODS
  static fromPersistence(dbRecord) {
    return new Order({
      id: dbRecord.id_,
      userId: dbRecord.user_id,
      userName: dbRecord.user_name,
      totalAmount: dbRecord.total_amount,
      status: dbRecord.status,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at,
      paymentInfo: dbRecord.payment_info,
      deliveryType: dbRecord.delivery_type
    });
  }

  static fromDTO(dto) {
    return new Order({
      id: dto.id,
      userId: dto.userId,
      userName: dto.userName,
      totalAmount: dto.totalAmount,
      status: dto.status,
      items: dto.items,
      createdAt: dto.createdAt,
      paymentInfo: dto.paymentInfo,
      deliveryType:dto.deliveryType
    });
  }

  // MÉTODOS DE DOMINIO
  updateStatus(newStatus) {
    const valid = ["pending", "paid", "cancelled", "completed"];
    if (!valid.includes(newStatus)) throw new Error("Invalid order status");
    this.status = newStatus;
  }

  updateTotal(newTotal) {
    if (newTotal < 0) throw new Error("Total amount cannot be negative");
    this.totalAmount = newTotal;
  }

  addItem(itemId) {
    if (!this.itemsId.includes(itemId)) this.itemsId.push(itemId);
  }

  removeItem(itemId) {
    this.itemsId = this.itemsId.filter((id) => id !== itemId);
  }

  // SERIALIZERS
  toDTO() {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName,
      totalAmount: this.totalAmount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      paymentInfo: this.paymentInfo,
      deliveryType: this.deliveryType
    };
  }

  toPersistence() {
    return {
      id_: this.id,
      user_id: this.userId,
      user_name: this.userName,
      total_amount: this.totalAmount,
      status: this.status,
      created_at: this.createdAt,
      payment_info: this.paymentInfo,
      delivery_type: this.deliveryType
    };
  }

   /**
   * Prepara los datos para crear una nueva orden en la base de datos.
   * No incluye `id_` ni `created_at` porque esos los genera el repositorio.
   */
  toPersistenceForCreate() {
    return {
      user_id: this.userId,
      user_name: this.userName,
      total_amount: this.totalAmount,
      status: this.status,
      payment_info: this.paymentInfo,
      delivery_type: this.deliveryType
    };
  }
}
