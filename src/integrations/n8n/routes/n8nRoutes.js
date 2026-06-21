import { Router } from "express";

import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

import { ProductService } from "../../../products/application/ProductService.js";
import { DatabaseProductRepository } from "../../../products/infrastructure/adapters/DatabaseProductRepository.js";
import { ProductImagesRepository } from "../../../products/infrastructure/adapters/productImagesRepository.js";

import { N8NProductController } from "../controllers/N8NProductController.js";
import { N8NOrderController } from "../controllers/N8NOrderController.js";
import crypto from "crypto";

import { OrderController } from "../../../orders/infrastructure/controller/OrderController.js";
import { OrderService } from "../../../orders/application/OrderService.js";
import { DatabaseOrderRepository } from "../../../orders/infrastructure/adapters/DatabaseOrderRepository.js";
import { DatabaseItemRepository } from "../../../items/infrastructure/adapters/DatabaseItemRepository.js";

const router = Router();

router.use(apiKeyMiddleware);

// ✅ Primero repositories
const orderRepository = new DatabaseOrderRepository();
const itemRepository = new DatabaseItemRepository();
const productRepository = new DatabaseProductRepository();
const productImagesRepository = new ProductImagesRepository();

// ✅ Luego services
const orderService = new OrderService(orderRepository, itemRepository);
const productService = new ProductService(productRepository, productImagesRepository);

// ✅ Luego controllers (ahora productService ya existe)
const orderController = new OrderController(orderService);
const n8nOrderController = new N8NOrderController(orderService, productService);
const n8nProductController = new N8NProductController(productService);

// ✅ Rutas
router.get("/products", n8nProductController.getProducts);
router.post("/orders", orderController.create);
router.post("/whatsapp/orders", n8nOrderController.createWhatsappOrder);

export default router;