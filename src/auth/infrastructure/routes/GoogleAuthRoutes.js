import { Router } from "express"
import passport from "passport"
import { CLIENT_URL, LOGIN_URL } from "../../../shared/config.js"

export const googleAuthRoutes = Router()

googleAuthRoutes.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))

googleAuthRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: LOGIN_URL,
  }),
)

