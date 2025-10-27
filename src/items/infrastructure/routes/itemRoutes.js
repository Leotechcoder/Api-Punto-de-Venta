import { Router } from "express";
import { ItemController } from "../../infrastructure/controller/ItemController.js";
import { ItemService } from "../../application/ItemService.js";
import { DatabaseItemRepository } from "../adapters/DatabaseItemRepository.js";
import { AccessControl } from "../../../shared/accessControlV2.js";
import { AuthMiddleware } from "../../../shared/middleware/authMiddlewareV2.js";

export const routerItems = Router();

// 🛡️ Middlewares globales de acceso y autenticación
routerItems.use(AccessControl.corsHandler);
routerItems.use(AuthMiddleware.ensureAuthenticated);

// 🧩 Inyección de dependencias
const itemRepository = new DatabaseItemRepository();
const itemService = new ItemService(itemRepository);
const itemController = new ItemController(itemService);

// 📦 Rutas protegidas
routerItems.get("/items", (req, res) => itemController.getAll(req, res));
routerItems.get("/items/:id", (req, res) => itemController.getById(req, res));

// ❌ No se permiten POST, PATCH o DELETE fuera del contexto de órdenes.
//    Estos métodos deben manejarse únicamente a través del módulo `orders`.

export default routerItems;
