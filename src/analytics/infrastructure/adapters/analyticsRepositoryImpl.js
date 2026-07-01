import { AnalyticsRepository } from "../../domain/analyticsRepository.js"

/**
 * AnalyticsRepositorySQL
 *
 * Tabla real: public.order_items
 * Columnas:   id_, order_id, product_id, product_name, description, quantity, unit_price
 * (No existe columna category — se usa product_name para agrupaciones)
 */
export class AnalyticsRepositorySQL extends AnalyticsRepository {
  constructor(db) {
    super()
    this.db = db
  }

  // ── getTopProducts ────────────────────────────────────────────────────────
  async getTopProducts(startDate, endDate, limit = 10) {
    const result = await this.db.query(
      `
      SELECT
        i.product_name                     AS "productName",
        SUM(i.quantity)::int               AS "quantity",
        SUM(i.quantity * i.unit_price)     AS "totalRevenue"
      FROM public.order_items i
      INNER JOIN orders o ON o.id_ = i.order_id
      WHERE o.status IN ('paid', 'delivered')
        AND o.paid_at BETWEEN $1 AND $2
      GROUP BY i.product_name
      ORDER BY "quantity" DESC
      LIMIT $3
      `,
      [startDate, endDate, limit]
    )

    return result.rows.map((r) => ({
      productName:  r.productName,
      quantity:     Number(r.quantity),
      totalRevenue: Number(r.totalRevenue),
    }))
  }

  // ── getSalesByCategory ────────────────────────────────────────────────────
  // Sin columna category real → agrupa por product_name como fallback útil
  async getSalesByCategory(startDate, endDate) {
    const result = await this.db.query(
      `
      SELECT
        i.product_name                     AS "category",
        SUM(i.quantity)::int               AS "quantity",
        SUM(i.quantity * i.unit_price)     AS "totalRevenue"
      FROM public.order_items i
      INNER JOIN orders o ON o.id_ = i.order_id
      WHERE o.status IN ('paid', 'delivered')
        AND o.paid_at BETWEEN $1 AND $2
      GROUP BY i.product_name
      ORDER BY "totalRevenue" DESC
      `,
      [startDate, endDate]
    )

    return result.rows.map((r) => ({
      category:     r.category,
      quantity:     Number(r.quantity),
      totalRevenue: Number(r.totalRevenue),
    }))
  }

  // ── getSalesByHour ────────────────────────────────────────────────────────
  async getSalesByHour(startDate, endDate) {
    const result = await this.db.query(
      `
      SELECT
        EXTRACT(HOUR FROM o.paid_at)::int  AS "hour",
        COUNT(o.id_)::int                  AS "ordersCount",
        SUM(o.total_amount)                AS "totalRevenue"
      FROM orders o
      WHERE o.status IN ('paid', 'delivered')
        AND o.paid_at BETWEEN $1 AND $2
      GROUP BY EXTRACT(HOUR FROM o.paid_at)
      ORDER BY "hour" ASC
      `,
      [startDate, endDate]
    )

    // Rellenar horas sin ventas con 0 para gráfico continuo 0-23
    const byHour = {}
    result.rows.forEach((r) => {
      byHour[r.hour] = {
        hour:         r.hour,
        ordersCount:  Number(r.ordersCount),
        totalRevenue: Number(r.totalRevenue),
      }
    })

    return Array.from({ length: 24 }, (_, h) =>
      byHour[h] ?? { hour: h, ordersCount: 0, totalRevenue: 0 }
    )
  }

  // ── getSalesComparison (Fase 3) ───────────────────────────────────────────
  async getSalesComparison(period1, period2) {
    const kpisQuery = `
      SELECT
        COUNT(id_)::int                    AS "ordersCount",
        COALESCE(SUM(total_amount), 0)     AS "totalRevenue",
        COALESCE(AVG(total_amount), 0)     AS "avgTicket"
      FROM orders
      WHERE status IN ('paid', 'delivered')
        AND paid_at BETWEEN $1 AND $2
    `

    const [r1, r2] = await Promise.all([
      this.db.query(kpisQuery, [period1.start, period1.end]),
      this.db.query(kpisQuery, [period2.start, period2.end]),
    ])

    const toKPIs = (rows) => ({
      ordersCount:  rows[0].ordersCount,
      totalRevenue: Number(rows[0].totalRevenue),
      avgTicket:    Number(rows[0].avgTicket),
    })

    return {
      period1: toKPIs(r1.rows),
      period2: toKPIs(r2.rows),
    }
  }

  // ── getLowRotationProducts (Fase 3) ──────────────────────────────────────
  async getLowRotationProducts(startDate, endDate, threshold = 5) {
    const result = await this.db.query(
      `
      SELECT
        i.product_name                     AS "productName",
        SUM(i.quantity)::int               AS "quantity"
      FROM public.order_items i
      INNER JOIN orders o ON o.id_ = i.order_id
      WHERE o.status IN ('paid', 'delivered')
        AND o.paid_at BETWEEN $1 AND $2
      GROUP BY i.product_name
      HAVING SUM(i.quantity) <= $3
      ORDER BY "quantity" ASC
      `,
      [startDate, endDate, threshold]
    )

    return result.rows.map((r) => ({
      productName: r.productName,
      quantity:    Number(r.quantity),
    }))
  }

  // ── Fase 4: Forecasting ──────────────────────────────────────────────────
  async getWeeklySalesHistory(weeks = 4) {
    const result = await this.db.query(
      `
      SELECT
        DATE_TRUNC('week', paid_at)                          AS "weekStart",
        DATE_TRUNC('week', paid_at) + INTERVAL '6 days'     AS "weekEnd",
        COALESCE(SUM(total_amount), 0)                       AS "totalRevenue"
      FROM orders
      WHERE status IN ('paid', 'delivered')
        AND paid_at >= NOW() - ($1 || ' weeks')::INTERVAL
      GROUP BY DATE_TRUNC('week', paid_at)
      ORDER BY "weekStart" ASC
      `,
      [weeks]
    )
    return result.rows.map((r) => ({
      weekStart:    r.weekStart,
      weekEnd:      r.weekEnd,
      totalRevenue: Number(r.totalRevenue),
    }))
  }
}
