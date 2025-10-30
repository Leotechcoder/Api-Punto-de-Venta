export class SalesEntity {
  constructor({
    id,
    userId,
    userName,
    totalAmount,
    status,
    paymentInfo,
    deliveryType,
    createdAt,
    paidAt,
    deliveredAt,
    cashRegisterId
  }) {
    this.id = id
    this.userId = userId
    this.userName = userName
    this.totalAmount = totalAmount
    this.status = status
    this.paymentInfo = paymentInfo
    this.deliveryType = deliveryType
    this.createdAt = createdAt
    this.paidAt = paidAt
    this.deliveredAt = deliveredAt
    this.cashRegisterId = cashRegisterId
  }

  static fromPersistence(dbRecord) {
    return new SalesEntity({
      id: dbRecord.id_,
      userId: dbRecord.user_id,
      userName: dbRecord.user_name,
      totalAmount: dbRecord.total_amount,
      status: dbRecord.status,
      paymentInfo: dbRecord.payment_info,
      deliveryType: dbRecord.delivery_type,
      createdAt: dbRecord.created_at,
      paidAt: dbRecord.paid_at,
      deliveredAt: dbRecord.delivered_at,
      cashRegisterId: dbRecord.cash_register_id
    })
  }
}
