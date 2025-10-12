import { Router } from "express";
import { ItemController } from "../controller/ItemController.js";
import { ItemService } from "../../application/ItemService.js";
import { DatabaseItemRepository } from "../../infrastructure/adapters/DatabaseItemRepository.js";

export const routerItems = Router();

const itemRepository = new DatabaseItemRepository();
const itemService = new ItemService(itemRepository);
const itemController = new ItemController(itemService);

routerItems.get("/items", (req, res) => itemController.getAll(req, res));
routerItems.get("/items/:id", (req, res) => itemController.getById(req, res));
// ❌ No más POST /item, PATCH, DELETE fuera del contexto de órdenes.
