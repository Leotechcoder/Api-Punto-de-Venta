import { Router } from "express"
import passport from "passport"

export const localAuthRoutes = Router()

localAuthRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: process.env.LOGIN_URL,
    failureFlash: true,
  }),
)

localAuthRoutes.post("/register", (req, res, next) => {
  // Implement user registration logic here
})

