/**
 * AlertsRepository
 *
 * Puerto del módulo alerts.
 * Define los contratos de consulta a la base de datos.
 */
export class AlertsRepository {
  /**
   * Órdenes pendientes que llevan más de N minutos sin atender.
   * @param {number} thresholdMinutes
   * @returns {Promise<Array<{ id, userName, createdAt, minutesWaiting }>>}
   */
  async getDelayedOrders(thresholdMinutes = 30) {
    throw new Error("Method not implemented: getDelayedOrders")
  }

  /**
   * Verifica si la caja fue abierta hoy.
   * @returns {Promise<boolean>}
   */
  async isCashRegisterOpenToday() {
    throw new Error("Method not implemented: isCashRegisterOpenToday")
  }

  /**
   * Productos sin ventas en los últimos N días.
   * @param {number} days
   * @returns {Promise<Array<{ productName }>>}
   */
  async getProductsWithNoSales(days = 7) {
    throw new Error("Method not implemented: getProductsWithNoSales")
  }
}
