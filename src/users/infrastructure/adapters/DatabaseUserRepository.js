
import pool from "../../../shared/infrastructure/postgresConnection.js";
import { UserRepository } from "../../application/UserRepository.js";
import { User } from "../../domain/User.js";
import { idGenerator } from "../../../shared/idGenerator.js";

export class DatabaseUserRepository extends UserRepository {
  async getAll() {
    try {
      const result = await pool.query("SELECT * FROM public.users");
      return result.rows.map((row) => new User(row.id_, row.username, row.email, row.phone, row.address, row.avatar, row.registration_date));
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      throw new Error("Error al obtener usuarios");
    }
  }

  async getById(id) {
    try {
      const result = await pool.query("SELECT * FROM public.users WHERE id_ = $1", [id]);
      if (result.rows.length === 0) return null;
      return new User(...Object.values(result.rows[0]));
    } catch (error) {
      console.error("❌ Error en getById:", error);
      throw new Error("Error al obtener usuario");
    }
  }

  async create(userData) {
    try {
      const id = idGenerator("Users");
      const { username, email, phone, address, password_ } = userData;

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password_, 10)

      const registration_date = new Date().toISOString()
      const result = await pool.query(
        "INSERT INTO public.users (id_, username, email, phone, address, password_, registration_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [id, username, email, phone, address, hashedPassword, registration_date]
      );
      return new User(...Object.values(result.rows[0]));
    } catch (error) {
      console.error("❌ Error en create:", error);
      throw new Error("Error al crear usuario");
    }
  }

  async update(id, userData) {
    try {
      const { username, phone, address } = userData;
      const result = await pool.query(
        "UPDATE public.users SET username = $1, phone = $2, address = $3 WHERE id_ = $4 RETURNING *",
        [username, phone, address, id]
      );
      if (result.rows.length === 0) return null;
      return new User(...Object.values(result.rows[0]));
    } catch (error) {
      console.error("❌ Error en update:", error);
      throw new Error("Error al actualizar usuario");
    }
  }

  async delete(id) {
    try {
      const result = await pool.query("DELETE FROM public.users WHERE id_ = $1", [id]);
      return result.rowCount === 1;
    } catch (error) {
      console.error("❌ Error en delete:", error);
      throw new Error("Error al eliminar usuario");
    }
  }

  async findOrCreate(thirdPartyId, username, email) {
    try {
      const userResult = await pool.query("SELECT * FROM public.users WHERE id_ = $1", [thirdPartyId]);
      const user = userResult.rows[0];
      if (user) return user;

      const newUser = {
        id: thirdPartyId,
        username,
        email: email ?? "Facebook",
        registration_date: new Date().toISOString(),
      };
      const columns = ["id_", "username", "email", "registration_date"];
      const values = [newUser.id, newUser.username, newUser.email, newUser.registration_date];
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
      const insertQuery = `INSERT INTO public.users (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`;
      const insertResult = await pool.query(insertQuery, values);
      return insertResult.rows[0];
    } catch (error) {
      console.error("❌ Error en findOrCreate:", error);
      throw new Error("Error al buscar o crear usuario");
    }
  }
}
