import { Router } from "express"
import { AnalyticsController } from "../controllers/analyticsController.js"
import { AnalyticsRepositorySQL } from "../adapters/analyticsRepositoryImpl.js"
import { AnalyticsService } from "../../application/analyticsService.js"
import pool from "../../../shared/infrastructure/postgresConnection.js"
import { AuthMiddleware } from "../../../shared/middleware/authMiddlewareV2.js"
import { AccessControl } from "../../../shared/accessControlV2.js"

export const analyticsRoutes = Router()

// Middlewares globales — mismo patrón que salesRoutes
analyticsRoutes.use(AccessControl.corsHandler)
analyticsRoutes.use(AuthMiddleware.ensureAuthenticated)

// Inyección de dependencias
const repository = new AnalyticsRepositorySQL(pool)
const service    = new AnalyticsService(repository)
const controller = new AnalyticsController(service)

// ============================================================
// 📊 Endpoints del módulo Analytics
// ============================================================

// ── Fase 2: Dashboard Comercial ──────────────────────────────
// GET /analytics/top-products?startDate=&endDate=&limit=10
analyticsRoutes.get("/top-products",  controller.getTopProducts)

// GET /analytics/by-category?startDate=&endDate=
analyticsRoutes.get("/by-category",   controller.getSalesByCategory)

// GET /analytics/by-hour?startDate=&endDate=
analyticsRoutes.get("/by-hour",       controller.getSalesByHour)

// ── Fase 3: Analítica avanzada ───────────────────────────────
// GET /analytics/comparison?p1Start=&p1End=&p2Start=&p2End=
analyticsRoutes.get("/comparison",    controller.getSalesComparison)

// GET /analytics/low-rotation?startDate=&endDate=&threshold=5
analyticsRoutes.get("/low-rotation",  controller.getLowRotationProducts)

// ── Fase 4 ────────────────────────────────────────────────────────────────
// GET /analytics/forecast?weeks=4
analyticsRoutes.get("/forecast",      controller.getForecast)
