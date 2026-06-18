import { Router } from "express";

import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

import { OrderController } from "../../../orders/infrastructure/controller/OrderController.js";
import { OrderService } from "../../../orders/application/OrderService.js";
import { DatabaseOrderRepository } from "../../../orders/infrastructure/adapters/DatabaseOrderRepository.js";
import { DatabaseItemRepository } from "../../../items/infrastructure/adapters/DatabaseItemRepository.js";

const router = Router();

router.use(apiKeyMiddleware);

const orderRepository = new DatabaseOrderRepository();
const itemRepository = new DatabaseItemRepository();

const orderService = new OrderService(
  orderRepository,
  itemRepository
);

const orderController = new OrderController(
  orderService
);

router.post(
  "/orders",
  orderController.create
);

export default router;