import { Router } from "express";

import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

import { ProductService } from "../../../products/application/ProductService.js";
import { DatabaseProductRepository } from "../../../products/infrastructure/adapters/DatabaseProductRepository.js";
import { ProductImagesRepository } from "../../../products/infrastructure/adapters/productImagesRepository.js";

import { N8NProductController } from "../controllers/N8NProductController.js";

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

const productRepository = new DatabaseProductRepository();
const productImagesRepository = new ProductImagesRepository();

const productService = new ProductService(
  productRepository,
  productImagesRepository
);

const n8nProductController = new N8NProductController(
  productService
);

router.get(
  "/products",
  n8nProductController.getProducts
);

router.post(
  "/orders",
  orderController.create
);

export default router;