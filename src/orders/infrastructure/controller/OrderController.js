// src/modules/orders/controller/OrderController.js
import { validatePartialItem } from "../../../items/domain/itemsSchema.js";
import {
  validateOrder,
  validateOrderUpdate,
} from "../../domain/orderSchema.js"; // Ajustá el path según tu estructura

import { getIO } from "../../../config/socket.js";

export class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  getAll = async (req, res) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.status(200).json({ orders, message: "Órdenes encontradas 🙌" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getById = async (req, res) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.status(200).json({ order, message: "Orden encontrada 🤝" });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };

  create = async (req, res) => {
    try {
      // ✅ Validación con Zod
      const validation = validateOrder(req.body);
      console.log("Validation result:", validation);

      if (!validation.success) {
        console.log("Validation errors:", validation.error.errors);
        return res.status(400).json({
          error: "Datos inválidos",
          details: validation.error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      const order = await this.orderService.createOrder(validation.data);
      getIO().emit("order:new", order);
      res.status(201).json({ order, message: "Orden creada correctamente 🤘" });
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(400).json({ error: err.message });
    }
  };

  updateOrder = async (req, res) => {
    try {
      const { id } = req.params;

      // ✅ Validar datos parcialmente (solo campos enviados)
      const validation = validateOrderUpdate(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Datos inválidos para la actualización de la orden",
          details: validation.error.errors.map((e) => e.message),
        });
      }

      const updatedOrder = await this.orderService.updateOrder(
        id,
        validation.data
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Orden no encontrada 🤔" });
      }

      res.status(200).json({
        order: updatedOrder,
        message: "Orden actualizada correctamente 🔁",
      });
    } catch (err) {
      console.error("❌ Error en updateOrder:", err);
      res.status(500).json({ error: err.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.orderService.deleteOrder(id);
      if (deleted) {
        res.status(200).json({ deletedId: id, message: "Orden eliminada correctamente 🧺" });
      } else {
        res.status(404).json({ message: "Orden no encontrada 🤔" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  addItem = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.orderService.addItemToOrder(id, req.body);
      res
        .status(201)
        .json({ result, message: "Item agregado correctamente 👍" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  updateItem = async (req, res) => {
    try {
      const { id, itemId } = req.params;

      // Validar solo los campos que vengan (camelCase)
      const validation = validatePartialItem(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Datos inválidos para actualización del ítem",
          details:
            validation.error.errors?.map((e) => e.message) || validation.error,
        });
      }

      // Pasamos directamente la data validada al servicio
      const result = await this.orderService.updateItemInOrder(
        id,
        itemId,
        validation.data
      );

      res
        .status(200)
        .json({ result, message: "Item actualizado correctamente 🤙" });
    } catch (err) {
      console.error("❌ Error en updateItem:", err);
      res.status(400).json({ error: err.message });
    }
  };

  deleteItem = async (req, res) => {
    try {
      const { id, itemId } = req.params;
      const result = await this.orderService.deleteItemFromOrder(id, itemId);
      res
        .status(200)
        .json({ result, message: "Item eliminado correctamente 👌" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}
