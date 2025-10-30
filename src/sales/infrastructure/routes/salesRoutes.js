import { Router } from "express"
import { SalesController } from "../controllers/salesController.js"
import { SalesRepositorySQL } from "../adapters/salesRepositoryImpl.js"
import { SalesService } from "../../application/salesService.js"
import pool from "../../../shared/infrastructure/postgresConnection.js"
import { AuthMiddleware } from "../../../shared/middleware/authMiddlewareV2.js" // <- tu middleware de autenticación
import { AccessControl } from "../../../shared/accessControlV2.js" // <- CORS si lo querés específico para sales

export const salesRoutes = Router()

// Middlewares globales para todas las rutas de sales
salesRoutes.use(AccessControl.corsHandler)          // CORS
salesRoutes.use(AuthMiddleware.ensureAuthenticated) // Asegura que el usuario esté logueado
// Inyección de dependencias
const repository = new SalesRepositorySQL(pool)
const service = new SalesService(repository)
const controller = new SalesController(service)

// ==========================
// 📦 Endpoints del módulo Sales
// ==========================

// Órdenes
salesRoutes.get("/orders/pending", controller.getPendingOrders)
salesRoutes.get("/orders/closed", controller.getClosedOrders)
salesRoutes.post("/orders/close", controller.closeOrder)

// Cajas
salesRoutes.get("/cash-registers/history", controller.getCashRegisterHistory)
salesRoutes.get("/cash-registers/active", controller.getActiveCashRegister)
salesRoutes.post("/cash-registers/open", controller.openCashRegister)
salesRoutes.post("/cash-registers/close", controller.closeCashRegister)

// Entregas
salesRoutes.post("/orders/deliver", controller.markOrderAsDelivered)
