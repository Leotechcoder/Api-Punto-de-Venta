import { Order } from "../domain/Order.js";

export class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async getAllOrders() {
    const dbOrders = await this.orderRepository.getAll();
    return dbOrders.map(Order.fromPersistence).map(order => order.toDTO());
  }

  async getOrderById(id) {
    const dbOrder = await this.orderRepository.getById(id);
    if (!dbOrder) return null;
    return Order.fromPersistence(dbOrder).toDTO();
  }

  async createOrder(orderData) {
    // Validación de negocio simple
    if (!orderData.userId || !orderData.totalAmount) {
      throw new Error("Missing required order fields: userId or totalAmount");
    }

    const order = Order.fromDTO(orderData);
    const savedOrder = await this.orderRepository.create(order.toPersistence());
    return Order.fromPersistence(savedOrder).toDTO();
  }

  async updateOrder(id, orderData) {
    const orderToUpdate = Order.fromDTO(orderData);
    const updated = await this.orderRepository.update(id, orderToUpdate.toPersistence());
    if (!updated) return null;
    return Order.fromPersistence(updated).toDTO();
  }

  async deleteOrder(id) {
    return await this.orderRepository.delete(id);
  }
}
