import { AlertsRepository } from "../../domain/alertsRepository.js"

/**
 * AlertsRepositorySQL
 *
 * Implementación concreta usando pg Pool.
 * Todas las queries son de solo lectura — no mutan estado.
 */
export class AlertsRepositorySQL extends AlertsRepository {
  constructor(db) {
    super()
    this.db = db
  }

  // Órdenes pendientes que llevan más de N minutos
  async getDelayedOrders(thresholdMinutes = 30) {
    const result = await this.db.query(
      `
      SELECT
        id_                                                    AS id,
        user_name                                              AS "userName",
        created_at                                             AS "createdAt",
        EXTRACT(EPOCH FROM (NOW() - created_at)) / 60         AS "minutesWaiting"
      FROM orders
      WHERE status = 'pending'
        AND EXTRACT(EPOCH FROM (NOW() - created_at)) / 60 > $1
      ORDER BY created_at ASC
      `,
      [thresholdMinutes]
    )

    return result.rows.map((r) => ({
      id:             r.id,
      userName:       r.userName,
      createdAt:      r.createdAt,
      minutesWaiting: Math.floor(Number(r.minutesWaiting)),
    }))
  }

  // Verifica si hay una caja abierta hoy
  async isCashRegisterOpenToday() {
    const result = await this.db.query(
      `
      SELECT COUNT(*) AS count
      FROM cash_registers
      WHERE status = 'open'
        AND DATE(opened_at) = CURRENT_DATE
      `
    )
    return Number(result.rows[0].count) > 0
  }

  // Productos sin ventas en los últimos N días
  async getProductsWithNoSales(days = 7) {
    const result = await this.db.query(
      `
      SELECT DISTINCT p.name_ AS "productName"
      FROM products p
      WHERE p.name_ NOT IN (
        SELECT DISTINCT i.product_name
        FROM public.order_items i
        INNER JOIN orders o ON o.id_ = i.order_id
        WHERE o.status IN ('paid', 'delivered')
          AND o.paid_at >= NOW() - ($1 || ' days')::INTERVAL
      )
      ORDER BY p.name_ ASC
      `,
      [days]
    )
    return result.rows
  }
}
