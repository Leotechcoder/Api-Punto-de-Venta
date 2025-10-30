/**
 * @file authorizationRoutes.js
 * @description Rutas Express para manejar la autorización (roles, permisos, auditorías).
 * Todas las rutas responden en formato JSON y están pensadas para usarse junto con el módulo Auth.
 */

import { Router } from "express";
import { AuthorizationController } from "../infrastructure/controllers/AuthorizationController.js";

const router = Router();
const controller = new AuthorizationController();

// === Rutas principales ===

// Obtener los roles asignados a un usuario
router.get("/roles/:userId", controller.getRolesByUser);

// Asignar un rol a un usuario
router.post("/roles/assign", controller.assignRole);

// Verificar si un usuario tiene un permiso
router.post("/permissions/check", controller.checkPermission);

export { router as authorizationRoutes };
