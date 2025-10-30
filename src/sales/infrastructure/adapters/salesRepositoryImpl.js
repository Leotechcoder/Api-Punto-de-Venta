import { SalesRepository } from "../../domain/salesRepository.js"
import { SalesEntity } from "../../domain/salesEntity.js"

export class SalesRepositorySQL extends SalesRepository {
  constructor(db) {
    super()
    this.db = db
  }

  async getPendingOrders() {
    const result = await this.db.query(
      `SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC`
    )
    return result.rows.map(SalesEntity.fromPersistence)
  }

  async getClosedOrders(startDate, endDate) {
  const result = await this.db.query(
    `
    SELECT * FROM orders
    WHERE status IN ('paid', 'delivered')
    AND paid_at BETWEEN $1 AND $2
    ORDER BY paid_at DESC
    `,
    [startDate, endDate]
  )

  const orders = result.rows.map(SalesEntity.fromPersistence)
  const totalEarnings = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)

  return {
    totalEarnings,
    count: orders.length,
    orders
  }
}

  async closeOrder(orderId, paymentInfo, cashRegisterId) {
    const result = await this.db.query(
      `
      UPDATE orders
      SET status = 'paid',
          payment_info = $2,
          paid_at = NOW(),
          cash_register_id = $3,
          updated_at = NOW()
      WHERE id_ = $1
      RETURNING *
      `,
      [orderId, paymentInfo, cashRegisterId]
    )

    if (result.rows.length === 0) throw new Error("Order not found")

    return SalesEntity.fromPersistence(result.rows[0])
  }

  async getCashRegisterHistory() {
    const result = await this.db.query(
      `SELECT * FROM cash_registers ORDER BY opened_at DESC`
    )
    return result.rows
  }

  async getActiveCashRegister() {
    const result = await this.db.query(
      `SELECT * FROM cash_registers WHERE status = 'open' LIMIT 1`
    )
    return result.rows[0] || null
  }

  async openCashRegister(initialAmount, openedBy) {
    const result = await this.db.query(
      `
      INSERT INTO cash_registers (initial_amount, opened_by, status, opened_at)
      VALUES ($1, $2, 'open', NOW())
      RETURNING *
      `,
      [initialAmount, openedBy]
    )
    return result.rows[0]
  }

  async closeCashRegister(cashRegisterId, finalAmount, closedBy) {
    const result = await this.db.query(
      `
      UPDATE cash_registers
      SET status = 'closed',
          final_amount = $2,
          closed_by = $3,
          closed_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [cashRegisterId, finalAmount, closedBy]
    )
    return result.rows[0]
  }

  async markAsDelivered(orderId) {
    const result = await this.db.query(
      `
      UPDATE orders
      SET delivered_at = NOW(),
          updated_at = NOW()
      WHERE id_ = $1
      RETURNING *
      `,
      [orderId]
    )

    if (result.rows.length === 0) throw new Error("Order not found")
    return result.rows[0]
  }

}
