export class SalesService {
  constructor(repository) {
    this.repository = repository
  }

  async getDashboardData({ startDate, endDate }) {
  return this.repository.getClosedOrders(startDate, endDate)
}


  async handleCloseOrder({ orderId, paymentInfo, userId }) {
    const activeRegister = await this.repository.getActiveCashRegister()
    if (!activeRegister) throw new Error("No hay una caja abierta")

    return this.repository.closeOrder(orderId, paymentInfo, activeRegister.id)
  }

  async handleOpenCashRegister({ initialAmount, user }) {
    return this.repository.openCashRegister(initialAmount, user)
  }

  async handleCloseCashRegister({ cashRegisterId, finalAmount, user }) {
    return this.repository.closeCashRegister(cashRegisterId, finalAmount, user)
  }
}
