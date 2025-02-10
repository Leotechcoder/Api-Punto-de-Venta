import { Router } from "express"
import { UserController } from "../controller/UserController.js"

export const routerUsers = Router()

routerUsers.get("/users", UserController.getAll)
routerUsers.get("/users/:id", UserController.getById)
routerUsers.post("/users", UserController.create)
routerUsers.patch("/users/:id", UserController.updatePartial)
routerUsers.delete("/users/:id", UserController.delete)

