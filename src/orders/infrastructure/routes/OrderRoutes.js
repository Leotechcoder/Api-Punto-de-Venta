import { Router } from "express";
import { OrderController } from "../controller/OrderController.js";
import { OrderService } from "../../application/OrderService.js";
import { DatabaseOrderRepository } from "../../infrastructure/adapters/DatabaseOrderRepository.js";
import { DatabaseItemRepository } from "../../../items/infrastructure/adapters/DatabaseItemRepository.js";

export const routerOrders = Router();

const orderRepository = new DatabaseOrderRepository();
const itemRepository = new DatabaseItemRepository();
const orderService = new OrderService(orderRepository, itemRepository);
const orderController = new OrderController(orderService);

routerOrders.get("/orders", orderController.getAll); 
routerOrders.get("/orders/:id", orderController.getById);
routerOrders.post("/orders", orderController.create);
routerOrders.delete("/orders/:id", orderController.delete)

// Items gestionados dentro del agregado Order
routerOrders.post("/orders/:id/items", orderController.addItem);
routerOrders.patch("/orders/:id/items/:itemId", orderController.updateItem);
routerOrders.delete("/orders/:id/items/:itemId", orderController.deleteItem);

export default routerOrders;
