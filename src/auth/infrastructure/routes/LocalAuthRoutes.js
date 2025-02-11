import { Router } from "express"
import passport from "passport"
import dotenv from 'dotenv';
if(process.env.NODE_ENV !== 'production'){
  dotenv.config(); 
}

// Local authentication routes
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

