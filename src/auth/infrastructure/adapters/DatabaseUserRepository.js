import pool from "../../../shared/infrastructure/postgresConnection.js";
import { UserRepository } from "../../application/UserRepository.js";

export class DatabaseUserRepository extends UserRepository {
  static async findOrCreate(thirdPartyId, username, email) {
    try {
      // Buscar usuario por thirdPartyId
      const userResult = await pool.query("SELECT * FROM public.users WHERE id_ = $1", [thirdPartyId]);
      const user = userResult.rows[0];

      if (!user) {
        // Crear un nuevo usuario si no existe
        const newUser = {
          id: thirdPartyId,
          username,
          email: email ?? "Facebook",
          registration_date: new Date().toISOString(), // Mejor formato para PostgreSQL
        };

        const columns = ["id_", "username", "email", "registration_date"];
        const values = [newUser.id, newUser.username, newUser.email, newUser.registration_date];

        const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
        const insertQuery = `INSERT INTO public.users (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`;

        const insertResult = await pool.query(insertQuery, values);

        if (insertResult.rowCount === 1) {
          return insertResult.rows[0];
        }
      }

      return user;
    } catch (error) {
      console.error("❌ Error en findOrCreate:", error);
      throw error;
    }
  }
}
