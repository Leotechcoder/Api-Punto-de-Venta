import { Router } from "express"
import passport from "passport"
import { CLIENT_URL, LOGIN_URL } from "../../../shared/config.js"

export const localAuthRoutes = Router()

localAuthRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: CLIENT_URL,
    failureRedirect: LOGIN_URL,
    failureFlash: true,
  }),
)

localAuthRoutes.post("/register", (req, res, next) => {
  // Implement user registration logic here
})

