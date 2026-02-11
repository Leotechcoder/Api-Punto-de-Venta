import { Router } from "express";
import { ItemController } from "../../infrastructure/controller/ItemController.js";
import { ItemService } from "../../application/ItemService.js";
import { DatabaseItemRepository } from "../adapters/DatabaseItemRepository.js";
import { AccessControl } from "../../../shared/accessControlV2.js";

export const routerItemsStore = Router();

// 🛡️ Middlewares globales de acceso
routerItemsStore.use(AccessControl.corsHandler);

// 🧩 Inyección de dependencias
const itemRepository = new DatabaseItemRepository();
const itemService = new ItemService(itemRepository);
const itemController = new ItemController(itemService);

// 📦 Rutas publicas
routerItemsStore.get("/items", (req, res) => itemController.getAll(req, res));