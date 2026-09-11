// src/modules/orders/controller/OrderController.js
import { validatePartialItem } from "../../../items/domain/itemsSchema.js";
import {
  validateOrder,
  validateOrderUpdate,
} from "../../domain/orderSchema.js"; // Ajustá el path según tu estructura

import { getIO } from "../../../config/socket.js";

export class OrderController {
  // `defaultSource` lo fija quien instancia el controller según la ruta
  // que lo monta (dashboard -> "pos", store -> "app"). Nunca debe salir
  // del body del request.
  constructor(orderService, defaultSource = "other") {
    this.orderService = orderService;
    this.defaultSource = defaultSource;
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

      const order = await this.orderService.createOrder(validation.data, this.defaultSource);

      getIO().emit("order:new", order);

      res.status(201).json({ order, message: "Orden creada correctamente 🤘" });
    } catch (err) {
      console.error("Error creating order:", err);
      res.status(400).json({ error: err.message });
    }
  };

  // PATCH /orders/:id — único endpoint para edición completa (estado, pago
  // y, opcionalmente, sincronización de items). `totalAmount` no forma
  // parte del contrato: el schema de update lo excluye y el servicio
  // siempre lo recalcula si vinieron items.
  updateOrder = async (req, res) => {
    try {
      const { id } = req.params;

      const validation = validateOrderUpdate(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Datos inválidos para la actualización de la orden",
          details: validation.error.errors.map((e) => e.message),
        });
      }

      const updatedOrder = await this.orderService.updateOrder(id, validation.data);

      if (!updatedOrder) {
        return res.status(404).json({ message: "Orden no encontrada 🤔" });
      }

      getIO().emit("order:updated", updatedOrder);

      res.status(200).json({
        order: updatedOrder,
        message: "Orden actualizada correctamente 🔁",
      });
    } catch (err) {
      console.error("❌ Error en updateOrder:", err);

      if (err.message === "Order not found") {
        return res.status(404).json({ error: err.message });
      }
      // Conflicto de estado: se intentó tocar items de una orden que ya
      // no está pending (ready-to-pay/paid/cancelled).
      if (err.code === "ORDER_NOT_EDITABLE") {
        return res.status(409).json({ error: err.message });
      }
      // Se mandó `items: []` — no se permite vaciar una orden por acá.
      if (err.code === "ORDER_EMPTY_ITEMS") {
        return res.status(400).json({ error: err.message });
      }

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
