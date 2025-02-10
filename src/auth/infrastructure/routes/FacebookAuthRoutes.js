import { Router } from "express"
import passport from "passport"
import { CLIENT_URL, LOGIN_URL } from "../../../shared/config.js"

export const facebookAuthRoutes = Router()

facebookAuthRoutes.get("/auth/facebook", passport.authenticate("facebook", { scope: ["public_profile"] }))

facebookAuthRoutes.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: LOGIN_URL }),
  (req, res) => {
    res.redirect(CLIENT_URL)
  },
)

