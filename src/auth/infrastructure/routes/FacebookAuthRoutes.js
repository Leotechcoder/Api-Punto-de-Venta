import { Router } from "express"
import passport from "passport"

export const facebookAuthRoutes = Router()

facebookAuthRoutes.get("/auth/facebook", passport.authenticate("facebook", { scope: ["public_profile"] }))

facebookAuthRoutes.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: process.env.LOGIN_URL }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL)
  },
)

