import { User } from "../domain/User.js";
import pool from "../../shared/infrastructure/postgresConnection.js";

export class UserService {
  constructor(userRepository) {
    this.repository = userRepository;
  }

  async getAllUsers() {
    const client = await pool.connect();
    try {
      const users = await this.repository.getAll(client);
      return users.map(User.fromPersistence).map((u) => u.toDTO());
    } catch (error) {
      console.error("❌ [UserService] Error en getAllUsers:", error);
      throw error;
    } finally {
      client.release(); // ✅ libera el cliente al pool
    }
  }

  async getUserById(id) {
    const client = await pool.connect();
    try {
      const record = await this.repository.getById(id, client);
      if (!record) return null;
      return User.fromPersistence(record).toDTO();
    } catch (error) {
      console.error("❌ [UserService] Error en getUserById:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async createUser(userData) {
    const client = await pool.connect();
    try {
      const user = User.fromDTO(userData);
      const record = await this.repository.create(user.toPersistenceForCreate(), client);
      return User.fromPersistence(record).toDTO();
    } catch (error) {
      console.error("❌ [UserService] Error en createUser:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateUser(id, userData) {
    const client = await pool.connect();
    try {
      const existing = await this.repository.getById(id, client);
      if (!existing) return null;

      const user = User.fromPersistence(existing);
      user.updateProfileData(userData);

      const updatedRecord = await this.repository.update(id, user, client);
      return User.fromPersistence(updatedRecord).toDTO();
    } catch (error) {
      console.error("❌ [UserService] Error en updateUser:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteUser(id) {
    const client = await pool.connect();
    try {
      return await this.repository.delete(id, client);
    } catch (error) {
      console.error("❌ [UserService] Error en deleteUser:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
