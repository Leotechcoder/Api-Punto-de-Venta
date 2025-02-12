import { OrderService } from "../../application/OrderService.js";
import { DatabaseOrderRepository } from "../adapters/DatabaseOrderRepository.js";
import { validateOrder, validateOrderUpdate } from "../../domain/orderSchema.js";
import { AccessControl } from "../../../shared/AccessControl.js";

const orderRepository = new DatabaseOrderRepository();
const orderService = new OrderService(orderRepository);

export class OrderController {
  static async getAll(req, res) {
    try {
      AccessControl.handleRequest(req, res);
      const orders = await orderService.getAllOrders();
      return res.status(200).json(orders);
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      AccessControl.handleRequest(req, res);
      const orderId = req.params.id;
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }
      return res.status(200).json(order);
    } catch (error) {
      console.error("❌ Error en getById:", error);
      return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  }

  static async create(req, res) {
    try {
      AccessControl.handleRequest(req, res);
      const result = validateOrder(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Error en los datos de la orden", errors: result.error.errors });
      }
      const newOrder = await orderService.createOrder(result.data);
      return res.status(201).json(newOrder);
    } catch (error) {
      console.error("❌ Error en create:", error);
      return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  }

  static async updatePartial(req, res) {
    try {
      AccessControl.handleRequest(req, res);
      const orderId = req.params.id;
      const result = validateOrderUpdate(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Datos de actualización inválidos", errors: result.error.errors });
      }
      const updatedOrder = await orderService.updateOrder(orderId, result.data);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }
      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("❌ Error en updatePartial:", error);
      return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      AccessControl.handleRequest(req, res);
      const orderId = req.params.id;
      const deleted = await orderService.deleteOrder(orderId);
      if (!deleted) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }
      return res.status(200).json({ message: "Orden eliminada correctamente" });
    } catch (error) {
      console.error("❌ Error en delete:", error);
      return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  }
}

