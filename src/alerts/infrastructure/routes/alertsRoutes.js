import { Router } from "express"
import { AlertsController }       from "../controllers/alertsController.js"
import { AlertsRepositorySQL }    from "../adapters/alertsRepositoryImpl.js"
import { AlertsService }          from "../../application/alertsService.js"
import pool                       from "../../../shared/infrastructure/postgresConnection.js"
import { AuthMiddleware }         from "../../../shared/middleware/authMiddlewareV2.js"
import { AccessControl }          from "../../../shared/accessControlV2.js"

export const alertsRoutes = Router()

alertsRoutes.use(AccessControl.corsHandler)
alertsRoutes.use(AuthMiddleware.ensureAuthenticated)

// DI
const repository = new AlertsRepositorySQL(pool)
const service    = new AlertsService(repository)
const controller = new AlertsController(service)

// GET /alerts
alertsRoutes.get("/", controller.getActiveAlerts)
