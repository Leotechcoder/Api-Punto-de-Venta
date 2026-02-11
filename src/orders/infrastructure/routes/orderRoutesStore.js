import { Router } from "express";
import { OrderController } from "../controller/OrderController.js";
import { OrderService } from "../../application/OrderService.js";
import { DatabaseOrderRepository } from "../../infrastructure/adapters/DatabaseOrderRepository.js";
import { DatabaseItemRepository } from "../../../items/infrastructure/adapters/DatabaseItemRepository.js";
import { AccessControl } from "../../../shared/accessControlV2.js";

export const routerOrdersStore = Router();

// Middlewares de acceso y autenticación
routerOrdersStore.use(AccessControl.corsHandler);

// Inyección de dependencias
const orderRepository = new DatabaseOrderRepository();
const itemRepository = new DatabaseItemRepository();
const orderService = new OrderService(orderRepository, itemRepository);
const orderController = new OrderController(orderService);

// Rutas
routerOrdersStore.get("/orders", orderController.getAll);
routerOrdersStore.post("/orders", orderController.create);
routerOrdersStore.patch("/orders/:id", orderController.updateOrder);

export default routerOrdersStore;
