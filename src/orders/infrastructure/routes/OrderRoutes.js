import { Router } from "express";
import { OrderController } from "../controller/OrderController.js";
import { OrderService } from "../../application/OrderService.js";
import { DatabaseOrderRepository } from "../../infrastructure/adapters/DatabaseOrderRepository.js";
import { DatabaseItemRepository } from "../../../items/infrastructure/adapters/DatabaseItemRepository.js";
import { AccessControl } from "../../../shared/accessControlV2.js";
import { AuthMiddleware } from "../../../shared/middleware/authMiddlewareV2.js";

export const routerOrders = Router();

// Middlewares de acceso y autenticación
routerOrders.use(AccessControl.corsHandler);
routerOrders.use(AuthMiddleware.ensureAuthenticated);

// Inyección de dependencias
const orderRepository = new DatabaseOrderRepository();
const itemRepository = new DatabaseItemRepository();
const orderService = new OrderService(orderRepository, itemRepository);
const orderController = new OrderController(orderService);

// Rutas
routerOrders.get("/orders", orderController.getAll);
routerOrders.get("/orders/:id", orderController.getById);
routerOrders.post("/orders", orderController.create);
routerOrders.patch("/orders/:id", orderController.updateOrder);
routerOrders.delete("/orders/:id", orderController.delete);

routerOrders.post("/orders/:id/items", orderController.addItem);
routerOrders.patch("/orders/:id/items/:itemId", orderController.updateItem);
routerOrders.delete("/orders/:id/items/:itemId", orderController.deleteItem);

export default routerOrders;
