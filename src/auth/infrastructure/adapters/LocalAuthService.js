// src/auth/infrastructure/adapters/LocalAuthService.js
import bcrypt from "bcrypt"
import { DatabaseUserRepository } from "./DatabaseUserRepository"

export class AuthService {
  constructor() {
    this.userRepository = new DatabaseUserRepository()
  }

  /**
   * Valida las credenciales de un usuario.
   * @param {string} email - El email del usuario.
   * @param {string} password - La contraseña en texto plano.
   * @returns {object|null} El usuario si las credenciales son válidas, o null si no.
   */
  async validateUser(email, password) {
    // Buscar usuario en la base de datos
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      return null
    }

    // Comparar contraseñas
    const isValid = await bcrypt.compare(password, user.password_)
    if (!isValid) {
      return null
    }

    // Retornar el usuario si todo es correcto
    return user
  }

  async createUser ({email, password}){
    
  }
}
