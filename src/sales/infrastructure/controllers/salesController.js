export class SalesController {
  constructor(salesService) {
    this.salesService = salesService
  }

  // 📦 Órdenes pendientes
  getPendingOrders = async (req, res) => {
    try {
      const result = await this.salesService.repository.getPendingOrders()
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error al obtener órdenes pendientes" })
    }
  }

  // 💰 Órdenes cerradas (filtradas por fecha)
  getClosedOrders = async (req, res) => {
    try {
      const { startDate, endDate } = req.query
      const result = await this.salesService.getDashboardData({ startDate, endDate })
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error al obtener ventas cerradas" })
    }
  }

  // ✅ Cerrar una orden (marcar como pagada)
  closeOrder = async (req, res) => {
    try {
      const { orderId, paymentInfo } = req.body
      const userId = req.user?.id || "system"

      const result = await this.salesService.handleCloseOrder({
        orderId,
        paymentInfo,
        userId
      })
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(400).json({ error: error.message })
    }
  }

  // 🧾 Historial de cajas
  getCashRegisterHistory = async (req, res) => {
    try {
      const result = await this.salesService.repository.getCashRegisterHistory()
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error al obtener historial de cajas" })
    }
  }

  // 📤 Obtener caja activa
  getActiveCashRegister = async (req, res) => {
    try {
      const result = await this.salesService.repository.getActiveCashRegister()
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error al obtener caja activa" })
    }
  }

  // 🟢 Abrir caja
  openCashRegister = async (req, res) => {
    try {
      const { initialAmount } = req.body
      const user = req.user?.username || "system"

      const result = await this.salesService.handleOpenCashRegister({ initialAmount, user })
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(400).json({ error: error.message })
    }
  }

  // 🔴 Cerrar caja
  closeCashRegister = async (req, res) => {
    try {
      const { cashRegisterId, finalAmount } = req.body
      const user = req.user?.username || "system"

      const result = await this.salesService.handleCloseCashRegister({
        cashRegisterId,
        finalAmount,
        user
      })
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(400).json({ error: error.message })
    }
  }

  // 🚚 Marcar orden como entregada
  markOrderAsDelivered = async (req, res) => {
    try {
      const { orderId } = req.body
      const result = await this.salesService.repository.markAsDelivered(orderId)
      res.json(result)
    } catch (error) {
      console.error(error)
      res.status(400).json({ error: error.message })
    }
  }

}
