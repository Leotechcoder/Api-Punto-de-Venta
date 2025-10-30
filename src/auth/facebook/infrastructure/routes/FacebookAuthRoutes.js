import { Router } from "express"
import passport from "passport"
import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'production'){
  dotenv.config(); 
}

export const facebookAuthRoutes = Router()

facebookAuthRoutes.get("/auth/facebook", passport.authenticate("facebook", { scope: ["public_profile"] }))

facebookAuthRoutes.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: process.env.LOGIN_URL }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL)
  },
)

