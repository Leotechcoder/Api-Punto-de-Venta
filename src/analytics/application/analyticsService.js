/**
 * AnalyticsService
 *
 * Capa de aplicación del módulo analytics.
 * Recibe el repositorio por constructor (inversión de dependencias).
 * No sabe nada de HTTP ni de SQL — solo orquesta casos de uso.
 */
export class AnalyticsService {
  constructor(repository) {
    this.repository = repository
  }

  // ── Fase 2: Dashboard Comercial ──────────────────────────────────────────

  async getTopProducts({ startDate, endDate, limit = 10 }) {
    return this.repository.getTopProducts(startDate, endDate, Number(limit))
  }

  async getSalesByCategory({ startDate, endDate }) {
    return this.repository.getSalesByCategory(startDate, endDate)
  }

  async getSalesByHour({ startDate, endDate }) {
    return this.repository.getSalesByHour(startDate, endDate)
  }

  // ── Fase 3: Analítica avanzada ───────────────────────────────────────────

  async getSalesComparison({ period1, period2 }) {
    return this.repository.getSalesComparison(period1, period2)
  }

  async getLowRotationProducts({ startDate, endDate, threshold = 5 }) {
    return this.repository.getLowRotationProducts(startDate, endDate, Number(threshold))
  }

  // ── Fase 4: Forecasting ──────────────────────────────────────────────────

  async getForecast({ weeks = 4 }) {
    const history = await this.repository.getWeeklySalesHistory(Number(weeks))

    if (!history.length) return { weeklyAvg: 0, projectedMonth: 0, history: [] }

    const weeklyAvg = history.reduce((s, w) => s + w.totalRevenue, 0) / history.length

    // Proyección del mes: promedio semanal × 4.33 (semanas promedio por mes)
    const projectedMonth = weeklyAvg * 4.33

    return { weeklyAvg, projectedMonth, history }
  }
}
