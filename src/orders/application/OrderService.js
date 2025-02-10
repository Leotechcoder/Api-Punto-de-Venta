export class OrderService {
    constructor(orderRepository) {
      this.orderRepository = orderRepository
    }
  
    async getAllOrders() {
      return this.orderRepository.getAll()
    }
  
    async getOrderById(id) {
      return this.orderRepository.getById(id)
    }
  
    async createOrder(orderData) {
      return this.orderRepository.create(orderData)
    }
  
    async updateOrder(id, orderData) {
      return this.orderRepository.update(id, orderData)
    }
  
    async deleteOrder(id) {
      return this.orderRepository.delete(id)
    }
  }
  
  