import { OrderService } from "../../application/OrderService.js";
import { DatabaseOrderRepository } from "../adapters/DatabaseOrderRepository.js";
import { validateOrder, validateOrderUpdate } from "../../domain/orderSchema.js";
import { AccessControl } from "../../../shared/AccessControl.js";

const orderRepository = new DatabaseOrderRepository();
const orderService = new OrderService(orderRepository);

export class OrderController {
  static async getAll(req, res, next) {
    try {
      AccessControl.handleRequest(req, res);
      const orders = await orderService.getAllOrders();
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      AccessControl.handleRequest(req, res);
      const orderId = req.params.id;
      const order = await orderService.getOrderById(orderId);
      if (!order) return res.status(404).json({ message: "Orden no encontrada" });

      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // Primero validar los datos antes de validar permisos
      const result = validateOrder(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Error en los datos de la orden", errors: result.error.errors });
      }

      AccessControl.handleRequest(req, res);
      const newOrder = await orderService.createOrder(result.data);

      return res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }

  static async updatePartial(req, res, next) {
    try {
      const orderId = req.params.id;
      const result = validateOrderUpdate(req.body);

      if (!result.success) {
        return res.status(400).json({ message: "Datos de actualización inválidos", errors: result.error.errors });
      }

      AccessControl.handleRequest(req, res);
      const updatedOrder = await orderService.updateOrder(orderId, result.data);

      if (!updatedOrder) return res.status(404).json({ message: "Orden no encontrada" });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      AccessControl.handleRequest(req, res);
      const orderId = req.params.id;
      const deleted = await orderService.deleteOrder(orderId);

      if (!deleted) return res.status(404).json({ message: "Orden no encontrada" });

      return res.status(204); // Código 204 para eliminación exitosa sin contenido
    } catch (error) {
      next(error);
    }
  }
}
