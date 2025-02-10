import { UserService } from "../../application/UserService.js";
import { DatabaseUserRepository } from "../adapters/DatabaseUserRepository.js";
import { UserSchema } from "../../domain/userSchema.js";
import { AccessControl } from "../../../shared/AccessControl.js";

const userRepository = new DatabaseUserRepository();
const userService = new UserService(userRepository);

export class UserController {
  static async getAll(req, res) {
    const acceso = AccessControl.handleRequest(req, res);
    if(acceso){
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }}
  }

  static async getById(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async create(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const result = UserSchema.validatePartialUser(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid user data" });
      }
      const newUser = await userService.createUser(result.data);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updatePartial(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const userId = req.params.id;
      const result = UserSchema.validateUserUpdate(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid user data" });
      }
      const updatedUser = await userService.updateUser(userId, result.data);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async delete(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const userId = req.params.id;
      const deleted = await userService.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
