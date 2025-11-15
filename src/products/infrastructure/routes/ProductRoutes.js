// src/modules/products/infrastructure/routes/ProductRoutes.js
import { Router } from "express";
import { ProductController } from "../../infrastructure/controller/ProductController.js";
import { ProductService } from "../../application/ProductService.js";
import { DatabaseProductRepository } from "../adapters/DatabaseProductRepository.js";

//Middlewares
import { AccessControl } from "../../../shared/accessControlV2.js";
import { AuthMiddleware } from "../../../shared/middleware/authMiddlewareV2.js";
import upload from "../../../shared/middleware/uploadImage.js";

export const routerProducts = Router();

// Middlewares globales de acceso y autenticación
routerProducts.use(AccessControl.corsHandler);
routerProducts.use(AuthMiddleware.ensureAuthenticated);

// Inyección de dependencias
const productRepository = new DatabaseProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Rutas CRUD
routerProducts.get("/products", productController.getAll);
routerProducts.get("/products/:id", productController.getById);
routerProducts.post("/products", upload.single("image"), productController.create);
routerProducts.patch("/products/:id", upload.single("image"), productController.update);
routerProducts.delete("/products/:id", productController.delete);

export default routerProducts;
