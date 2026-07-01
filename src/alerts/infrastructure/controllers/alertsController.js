/**
 * AlertsController
 * GET /alerts → retorna array de alertas activas
 */
export class AlertsController {
  constructor(alertsService) {
    this.alertsService = alertsService
  }

  getActiveAlerts = async (req, res) => {
    try {
      const alerts = await this.alertsService.getActiveAlerts()
      res.json(alerts)
    } catch (error) {
      console.error("[AlertsController] getActiveAlerts:", error)
      res.status(500).json({ error: "Error al obtener alertas" })
    }
  }
}
