import { OrderService } from "../../application/OrderService.js";
import { DatabaseOrderRepository } from "../adapters/DatabaseOrderRepository.js";
import { validateOrder, validateOrderUpdate } from "../../domain/orderSchema.js";
import { AccessControl } from "../../../shared/AccessControl.js";

const orderRepository = new DatabaseOrderRepository();
const orderService = new OrderService(orderRepository);

export class OrderController {
  static async getAll(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const orders = await orderService.getAllOrders();
      if (!orders) {
        return res.status(404).json({ message: "No se encontraron órdenes" });
      }
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async getById(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const orderId = req.params.id;
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async create(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const result = validateOrder(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Error en los datos de la orden", errors: result.error.errors });
      }

      const newOrder = await orderService.createOrder(result.data);
      if (!newOrder) {
        return res.status(500).json({ message: "Error al crear la orden" });
      }
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async updatePartial(req, res) {
    AccessControl.handleRequest(req, res);
    try {
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
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async delete(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const orderId = req.params.id;
      const deleted = await orderService.deleteOrder(orderId);
      if (!deleted) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
