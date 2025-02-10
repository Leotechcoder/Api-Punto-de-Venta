import { Router } from "express"
import { OrderController } from "../controller/OrderController.js"

export const routerOrders = Router()

routerOrders.get("/orders", OrderController.getAll)
routerOrders.get("/orders/:id", OrderController.getById)
routerOrders.post("/orders", OrderController.create)
routerOrders.patch("/orders/:id", OrderController.updatePartial)
routerOrders.delete("/orders/:id", OrderController.delete)

