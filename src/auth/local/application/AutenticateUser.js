// src/application/AuthenticateUser.js

export class AuthenticateUser {
  constructor(authService) {
    this.authService = authService
  }

  async execute({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    // el authService se encarga de la lógica de validación
    const user = await this.authService.validateUser(email, password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    return user
  }
}
