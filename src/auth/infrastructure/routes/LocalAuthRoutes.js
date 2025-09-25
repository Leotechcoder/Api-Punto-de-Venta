// src/routes/localAuthRoutes.js
import { Router } from "express"
import passport from "passport"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { DatabaseUserRepository } from "../adapters/DatabaseUserRepository.js"

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const userRepository = new DatabaseUserRepository()
export const localAuthRoutes = Router()

// Login sin redirect, responde JSON
localAuthRoutes.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err)

    if (!user) {
      return res.status(401).json({ message: info?.message || "Invalid credentials" })
    }

    req.login(user, (err) => {
      if (err) return next(err)

      // Devuelve el usuario y flag de login
      return res.json({ user, message: "Logged in successfully" })
    })
  })(req, res, next)
})

// Registro de usuario
localAuthRoutes.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Email, contraseña y nombre de usuario son requeridos" })
    }

    // Revisar si ya existe
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" })
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario en DB
    const newUser = await userRepository.createUser({
      username,
      email,
      password: hashedPassword,
    })

    return res.status(201).json({ user: newUser })
  } catch (error) {
    console.error("❌ Error en /register:", error)
    return res.status(500).json({ message: "Error registrando usuario" })
  }
})

// Logout
localAuthRoutes.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)

    return res.json({ message: "Logged out successfully" })
  })
})
