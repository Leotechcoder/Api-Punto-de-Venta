/**
 * AnalyticsController
 *
 * Handlers Express para el módulo analytics.
 * Recibe el servicio por constructor — no instancia nada directamente.
 * Solo traduce HTTP → service → HTTP response.
 */
export class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService
  }

  // ── Fase 2 ────────────────────────────────────────────────────────────────

  // GET /analytics/top-products?startDate=&endDate=&limit=10
  getTopProducts = async (req, res) => {
    try {
      const { startDate, endDate, limit } = req.query

      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate y endDate son requeridos" })
      }

      const result = await this.analyticsService.getTopProducts({ startDate, endDate, limit })
      res.json(result)
    } catch (error) {
      console.error("[AnalyticsController] getTopProducts:", error)
      res.status(500).json({ error: "Error al obtener top productos" })
    }
  }

  // GET /analytics/by-category?startDate=&endDate=
  getSalesByCategory = async (req, res) => {
    try {
      const { startDate, endDate } = req.query

      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate y endDate son requeridos" })
      }

      const result = await this.analyticsService.getSalesByCategory({ startDate, endDate })
      res.json(result)
    } catch (error) {
      console.error("[AnalyticsController] getSalesByCategory:", error)
      res.status(500).json({ error: "Error al obtener ventas por categoría" })
    }
  }

  // GET /analytics/by-hour?startDate=&endDate=
  getSalesByHour = async (req, res) => {
    try {
      const { startDate, endDate } = req.query

      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate y endDate son requeridos" })
      }

      const result = await this.analyticsService.getSalesByHour({ startDate, endDate })
      res.json(result)
    } catch (error) {
      console.error("[AnalyticsController] getSalesByHour:", error)
      res.status(500).json({ error: "Error al obtener ventas por hora" })
    }
  }

  // ── Fase 3 ────────────────────────────────────────────────────────────────

  // GET /analytics/comparison?p1Start=&p1End=&p2Start=&p2End=
  getSalesComparison = async (req, res) => {
    try {
      const { p1Start, p1End, p2Start, p2End } = req.query

      if (!p1Start || !p1End || !p2Start || !p2End) {
        return res.status(400).json({
          error: "Se requieren p1Start, p1End, p2Start y p2End"
        })
      }

      const result = await this.analyticsService.getSalesComparison({
        period1: { start: p1Start, end: p1End },
        period2: { start: p2Start, end: p2End },
      })
      res.json(result)
    } catch (error) {
      console.error("[AnalyticsController] getSalesComparison:", error)
      res.status(500).json({ error: "Error al comparar períodos" })
    }
  }

  // GET /analytics/low-rotation?startDate=&endDate=&threshold=5
  getLowRotationProducts = async (req, res) => {
    try {
      const { startDate, endDate, threshold } = req.query

      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate y endDate son requeridos" })
      }

      const result = await this.analyticsService.getLowRotationProducts({
        startDate,
        endDate,
        threshold,
      })
      res.json(result)
    } catch (error) {
      console.error("[AnalyticsController] getLowRotationProducts:", error)
      res.status(500).json({ error: "Error al obtener productos de baja rotación" })
    }
  }

  // ── Fase 4 ────────────────────────────────────────────────────────────────

  // GET /analytics/forecast?weeks=4
  getForecast = async (req, res) => {
    try {
      const { weeks = 4 } = req.query
      const result = await this.analyticsService.getForecast({ weeks })
      res.json(result)
    } catch (error) {
      console.error("[AnalyticsController] getForecast:", error)
      res.status(500).json({ error: "Error al calcular proyección" })
    }
  }
}
