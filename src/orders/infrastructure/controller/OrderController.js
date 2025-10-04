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
      return res.status(200).json({ orders, message: "OK" });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      AccessControl.handleRequest(req, res);
      const { id } = req.params;
      const order = await orderService.getOrderById(id);

      if (!order)
        return res.status(404).json({ message: "Orden no encontrada" });

      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const result = validateOrder(req.body);
      if (!result.success)
        return res.status(400).json({
          message: "Error en los datos de la orden",
          errors: result.error.errors,
        });

      AccessControl.handleRequest(req, res);
      const newOrder = await orderService.createOrder(result.data);

      return res.status(201).json({
        message: "Orden creada exitosamente",
        order: newOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePartial(req, res, next) {
    try {
      const { id } = req.params;
      const result = validateOrderUpdate(req.body);

      if (!result.success)
        return res.status(400).json({
          message: "Datos de actualización inválidos",
          errors: result.error.errors,
        });

      AccessControl.handleRequest(req, res);
      const updatedOrder = await orderService.updateOrder(id, result.data);

      if (!updatedOrder)
        return res.status(404).json({ message: "Orden no encontrada" });

      return res.status(200).json({
        message: "Orden actualizada exitosamente",
        order: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      AccessControl.handleRequest(req, res);
      const { id } = req.params;
      const deleted = await orderService.deleteOrder(id);

      if (!deleted)
        return res.status(404).json({ message: "Orden no encontrada" });

      // 204 No Content debe cerrar el response
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
