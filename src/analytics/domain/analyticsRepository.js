/**
 * AnalyticsRepository
 *
 * Puerto (interfaz) del módulo analytics.
 * Define los contratos que la capa de infraestructura debe implementar.
 * Ninguna capa externa debe romper esta interfaz.
 */
export class AnalyticsRepository {

  /**
   * Top N productos más vendidos en un período.
   * @param {string} startDate
   * @param {string} endDate
   * @param {number} limit  — default 10
   * @returns {Promise<Array<{ productName, quantity, totalRevenue }>>}
   */
  async getTopProducts(startDate, endDate, limit = 10) {
    throw new Error("Method not implemented: getTopProducts")
  }

  /**
   * Ventas agrupadas por categoría de producto en un período.
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Promise<Array<{ category, totalRevenue, quantity }>>}
   */
  async getSalesByCategory(startDate, endDate) {
    throw new Error("Method not implemented: getSalesByCategory")
  }

  /**
   * Ventas agrupadas por hora del día (0-23) en un período.
   * Útil para identificar picos operativos.
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Promise<Array<{ hour, totalRevenue, ordersCount }>>}
   */
  async getSalesByHour(startDate, endDate) {
    throw new Error("Method not implemented: getSalesByHour")
  }

  /**
   * KPIs comparativos entre dos períodos.
   * @param {{ start: string, end: string }} period1
   * @param {{ start: string, end: string }} period2
   * @returns {Promise<{ period1: KPIs, period2: KPIs }>}
   */
  async getSalesComparison(period1, period2) {
    throw new Error("Method not implemented: getSalesComparison")
  }

  /**
   * Productos con pocas ventas en un período (baja rotación).
   * @param {string} startDate
   * @param {string} endDate
   * @param {number} threshold — máximo de unidades vendidas para considerar "baja rotación"
   * @returns {Promise<Array<{ productName, quantity, category }>>}
   */
  async getLowRotationProducts(startDate, endDate, threshold = 5) {
    throw new Error("Method not implemented: getLowRotationProducts")
  }

  // ── Fase 4: Forecasting ──────────────────────────────────────────────────

  /**
   * Ventas agrupadas por semana de las últimas N semanas.
   * @param {number} weeks
   * @returns {Promise<Array<{ weekStart, weekEnd, totalRevenue }>>}
   */
  async getWeeklySalesHistory(weeks = 4) {
    throw new Error("Method not implemented: getWeeklySalesHistory")
  }
}
