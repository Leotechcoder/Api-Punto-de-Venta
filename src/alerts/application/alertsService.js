/**
 * AlertsService
 *
 * Evalúa las reglas de negocio y construye el array de alertas activas.
 * Las reglas son:
 *  1. Caja sin abrir hoy → warning
 *  2. Órdenes sin atender > 30 min → danger
 *  3. Productos sin ventas en los últimos 7 días → info
 */
export class AlertsService {
  constructor(repository) {
    this.repository = repository
  }

  async getActiveAlerts() {
    const alerts = []

    const [cashOpen, delayedOrders, noSalesProducts] = await Promise.all([
      this.repository.isCashRegisterOpenToday(),
      this.repository.getDelayedOrders(30),
      this.repository.getProductsWithNoSales(7),
    ])

    if (!cashOpen) {
      alerts.push({
        type:    "warning",
        code:    "CASH_NOT_OPEN",
        message: "La caja no fue abierta hoy.",
        detail:  null,
      })
    }

    if (delayedOrders.length > 0) {
      alerts.push({
        type:    "danger",
        code:    "DELAYED_ORDERS",
        message: `${delayedOrders.length} pedido${delayedOrders.length > 1 ? "s" : ""} llevan más de 30 minutos sin atender.`,
        detail:  delayedOrders.map((o) => `#${o.id} (${o.minutesWaiting} min)`).join(", "),
      })
    }

    if (noSalesProducts.length > 0) {
      alerts.push({
        type:    "info",
        code:    "NO_SALES_PRODUCTS",
        message: `${noSalesProducts.length} producto${noSalesProducts.length > 1 ? "s" : ""} sin ventas en los últimos 7 días.`,
        detail:  noSalesProducts.map((p) => p.productName).join(", "),
      })
    }

    return alerts
  }
}
