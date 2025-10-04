/*Asi entran los datos desde el frontend y salen los datos desde la api hacia la base de datos. Con
esto conseguimos mantener la consistencia en el uso de camelCase en el dominio del frontend
y snake_case en la base de datos y backend */


export class Order {
  constructor({ id, userId, userName, totalAmount, status, itemsId, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.totalAmount = totalAmount;
    this.status = status;
    this.itemsId = itemsId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // ---- FACTORY METHODS ----

  /** Crea una Order a partir de los datos en formato de la base de datos (snake_case) */
  static fromPersistence(dbRecord) {
    if (!dbRecord) return null;

    return new Order({
      id: dbRecord.id_,
      userId: dbRecord.user_id,
      userName: dbRecord.user_name,
      totalAmount: dbRecord.total_amount,
      status: dbRecord.status,
      itemsId: dbRecord.items_id,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at,
    });
  }

  /** Crea una Order a partir de los datos que vienen desde el frontend o API */
  static fromDTO(dto) {
    if (!dto) return null;

    return new Order({
      id: dto.id,
      userId: dto.userId,
      userName: dto.userName,
      totalAmount: dto.totalAmount,
      status: dto.status,
      itemsId: dto.itemsId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    });
  }

  // ---- SERIALIZERS ----

  /** Convierte una Order al formato que espera el frontend (camelCase) */
  toDTO() {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName,
      totalAmount: this.totalAmount,
      status: this.status,
      itemsId: this.itemsId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /** Convierte una Order al formato que espera la base de datos (snake_case) */
  toPersistence() {
    return {
      id_: this.id,
      user_id: this.userId,
      user_name: this.userName,
      total_amount: this.totalAmount,
      status: this.status,
      items_id: this.itemsId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

  