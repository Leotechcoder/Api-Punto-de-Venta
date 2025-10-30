import { Router } from "express"
import passport from "passport"
import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'production'){
  dotenv.config(); 
}

export const googleAuthRoutes = Router()

googleAuthRoutes.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))

googleAuthRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: process.env.LOGIN_URL,
  }),
)

