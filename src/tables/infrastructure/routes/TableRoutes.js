import { Router } from "express";

import { TableController } from "../controllers/TableController.js";

import { TableService } from "../../application/TableServices.js";

import { DatabaseTableRepository } from "../adapter/DatabaseTableRepository.js";

import { AccessControl } from "../../../shared/accessControlV2.js";

import { AuthMiddleware } from "../../../shared/middleware/authMiddlewareV2.js";

export const routerTables = Router();

// Middlewares

routerTables.use(AccessControl.corsHandler);

routerTables.use(AuthMiddleware.ensureAuthenticated);

// Dependency Injection

const tableRepository = new DatabaseTableRepository();

const tableService = new TableService(tableRepository);

const tableController = new TableController(tableService);

// Routes

routerTables.get("/", tableController.getAll);

routerTables.get("/:id", tableController.getById);

routerTables.post("/", tableController.create);

routerTables.patch("/:id", tableController.update);

routerTables.delete("/:id", tableController.delete);

export default routerTables;
