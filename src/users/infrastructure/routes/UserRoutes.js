import { Router } from "express";
import { UserController } from "../controller/UserController.js";
import { UserService } from "../../application/UserService.js";
import { DatabaseUserRepository } from "../../infrastructure/adapters/DatabaseUserRepository.js";
import { AccessControl } from "../../../shared/accessControlV2.js";
import { AuthMiddleware } from "../../../shared/middleware/authMiddlewareV2.js";

export const routerUsers = Router();

// Middlewares globales
routerUsers.use(AccessControl.corsHandler);
routerUsers.use(AuthMiddleware.ensureAuthenticated);

// Inyección de dependencias
const userRepository = new DatabaseUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Rutas
routerUsers.get("/users", userController.getAll);
routerUsers.get("/users/:id", userController.getById);
routerUsers.post("/users", userController.create);
routerUsers.patch("/users/:id", userController.updatePartial);
routerUsers.delete("/users/:id", userController.delete);

export default routerUsers;
