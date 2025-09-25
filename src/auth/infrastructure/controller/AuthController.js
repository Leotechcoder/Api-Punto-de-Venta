import { AuthService } from "../adapters/LocalAuthService.js"

export class AuthController {
  constructor() {
    this.authService = new AuthService()
  }

  async login(req, res) {
    try {
      const user = this.authService.validateUser(req.body.email, req.body.password)
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Aquí puedes generar un token JWT o iniciar una sesión
      return res.status(200).json({ message: "Login successful", user })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }

  async register(req, res) {
    try {
      const user = await this.authService.createUser(req);
      if (!user) {
        return res.status(400).json({ message: "User creation failed" });
      }
      return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        return res.status(500).json({message:"Internal server error", error})
    }
    }
}
