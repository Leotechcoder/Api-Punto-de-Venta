import { Router } from "express";
import { ItemController } from "../controller/ItemController.js";

export const routerItems = Router();

// GET - Obtener todos los items
routerItems.get("/items", ItemController.getAll);

// GET - Obtener un item por su id
routerItems.get("/items/:id", ItemController.getById);

// POST - Crear un item
routerItems.post("/items", ItemController.create);

// PATCH - Actualizar un item
routerItems.patch("/items/:id", ItemController.updatePartial);

// DELETE - Eliminar un item
routerItems.delete("/items/:id", ItemController.delete);
