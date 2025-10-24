import { validateUser, validateUserUpdate } from "../../domain/UserSchema.js";

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // 📜 Obtener todos los usuarios
  getAll = async (req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json({
        data: users,
        message: "Usuarios encontrados 🙌",
      });
    } catch (error) {
      console.error("❌ [UserController] Error en getAll:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  };

  // 🔎 Obtener usuario por ID
  getById = async (req, res) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });

      return res.status(200).json({
        user,
        message: "Usuario encontrado 🤝",
      });
    } catch (error) {
      console.error("❌ [UserController] Error en getById:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  };

  // ✳️ Crear nuevo usuario
  create = async (req, res) => {
    try {
      const validation = validateUser(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Datos inválidos",
          details: validation.error.errors,
        });
      }

      const newUser = await this.userService.createUser(validation.data);
      return res.status(201).json({
        data: newUser,
        message: "Usuario creado correctamente 🤘",
      });
    } catch (error) {
      console.error("❌ [UserController] Error en create:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  };

  // 🛠️ Actualizar parcialmente un usuario
  updatePartial = async (req, res) => {
    try {
      const validation = validateUserUpdate(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Datos inválidos",
          details: validation.error.errors,
        });
      }

      const updatedUser = await this.userService.updateUser(
        req.params.id,
        validation.data
      );

      if (!updatedUser)
        return res.status(404).json({ error: "Usuario no encontrado" });

      return res.status(200).json({
        data: updatedUser,
        message: "Usuario actualizado exitosamente 🤙",
      });
    } catch (error) {
      console.error("❌ [UserController] Error en updatePartial:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  };

  // 🗑️ Eliminar usuario
  delete = async (req, res) => {
    try {
      const deleted = await this.userService.deleteUser(req.params.id);
      if (!deleted)
        return res.status(404).json({ error: "Usuario no encontrado" });

      return res
        .status(200)
        .json({ message: "Usuario eliminado correctamente 👌" });
    } catch (error) {
      console.error("❌ [UserController] Error en delete:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  };
}
