
import { UserService } from "../../application/UserService.js";
import { DatabaseUserRepository } from "../adapters/DatabaseUserRepository.js";
import { UserSchema } from "../../domain/userSchema.js";
import { AccessControl } from "../../../shared/AccessControl.js";

const userRepository = new DatabaseUserRepository();
const userService = new UserService(userRepository);

export class UserController {
  static async getAll(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const users = await userService.getAllUsers();
      return res.status(200).json({data:users, message: "OK"});
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }

  static async getById(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
      return res.status(200).json({data:user, message: "Usuario encontrado"});
    } catch (error) {
      console.error("❌ Error en getById:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }

  static async create(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const result = UserSchema.validatePartialUser(req.body);
      if (!result.success) return res.status(400).json({ error: "Datos de usuario invalidos", details: result.error.errors });
      const newUser = await userService.createUser(result.data);
      return res.status(201).json({ data: newUser , message: "Usuario creado exitosamente" });
    } catch (error) {
      console.error("❌ Error en create:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }

  static async updatePartial(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const result = UserSchema.validateUserUpdate(req.body);
      if (!result.success) return res.status(400).json({ error: "Invalid user data", details: result.error.errors });
      const updatedUser = await userService.updateUser(req.params.id, result.data);
      if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
      const usuarioActualizado = { ...updatedUser }
      console.log("✅ Usuario actualizado:", usuarioActualizado);
      
      return res.status(200).json({data: usuarioActualizado, message: "Usuario actualizado exitosamente"});
    } catch (error) {
      console.error("❌ Error en updatePartial:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }

  static async delete(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const deleted = await userService.deleteUser(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
      return res.status(200).json({message: "Usuario eliminado exitosamente"});
    } catch (error) {
      console.error("❌ Error en delete:", error);
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }
}
