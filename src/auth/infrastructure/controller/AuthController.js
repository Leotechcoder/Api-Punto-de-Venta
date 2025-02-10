import { AuthenticateUser } from "../../application/AuthenticateUser.js"
import { RegisterUser } from "../../application/RegisterUser.js"

export class AuthController {
  constructor(authService, userRepository) {
    this.authenticateUser = new AuthenticateUser(authService)
    this.registerUser = new RegisterUser(userRepository)
  }

  async login(req, res) {
    try {
      const user = await this.authenticateUser.execute(req.body)
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in" })
        }
        return res.json({ user })
      })
    } catch (error) {
      res.status(401).json({ message: "Invalid credentials" })
    }
  }

  async register(req, res) {
    try {
      const user = await this.registerUser.execute(req.body)
      res.status(201).json({ user })
    } catch (error) {
      res.status(400).json({ message: "Error registering user" })
    }
  }
}

