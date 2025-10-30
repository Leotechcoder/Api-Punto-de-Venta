import { Router } from "express"
import { AuthController } from "../controller/AuthController.js"

export const authRoutes = (authService, userRepository) => {
  const router = Router()
  const authController = new AuthController(authService, userRepository)

  router.post("/login", authController.login.bind(authController))
  router.post("/register", authController.register.bind(authController))

  return router
}

