import { Router } from "express"
import { ProductController } from "../controller/ProductController.js"

export const routerProducts = Router()

routerProducts.get("/products", ProductController.getAll)
routerProducts.get("/products/:id", ProductController.getById)
routerProducts.post("/products", ProductController.create)
routerProducts.patch("/products/:id", ProductController.update)
routerProducts.delete("/products/:id", ProductController.delete)

