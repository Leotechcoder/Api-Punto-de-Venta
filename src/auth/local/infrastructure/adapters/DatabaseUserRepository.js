import { idGenerator } from "../../../../shared/idGenerator.js";
import pool from "../../../../shared/infrastructure/postgresConnection.js";
import { UserRepository } from "../../application/UserRepository.js";

export class DatabaseUserRepository extends UserRepository {
  static async findOrCreate(thirdPartyId, username, email) {
    try {
      const userResult = await pool.query(
        "SELECT * FROM public.users WHERE id_ = $1",
        [thirdPartyId]
      );
      const user = userResult.rows[0];

      if (!user) {
        const newUser = {
          id: thirdPartyId,
          username,
          email: email ?? "Facebook",
          registration_date: new Date().toISOString(),
        };

        const columns = ["id_", "username", "email", "registration_date"];
        const values = [
          newUser.id,
          newUser.username,
          newUser.email,
          newUser.registration_date,
        ];

        const placeholders = values
          .map((_, index) => `$${index + 1}`)
          .join(", ");
        const insertQuery = `INSERT INTO public.users (${columns.join(
          ", "
        )}) VALUES (${placeholders})`;

        const insertResult = await pool.query(insertQuery, values);
        if (insertResult.rowCount === 1) {
          const user = await pool.query(
            "SELECT * FROM public.users WHERE id_ = $1",
            [thirdPartyId]
          );
          return user.rows[0];
        }
      }

      return user;
    } catch (error) {
      console.error("❌ Error en findOrCreate:", error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const result = await pool.query(
        "SELECT * FROM public.users WHERE email = $1",
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en findByEmail:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const result = await pool.query(
        "SELECT * FROM public.users WHERE id_ = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en findById:", error);
      throw error;
    }
  }

  async createUser({ username, email, password }) {
    try {
      const newUser = {
        id: idGenerator("Users"),
        username,
        email,
        password_: password,
        registration_date: new Date().toISOString(),
      };
      const result = await pool.query(
        "INSERT INTO public.users (id_, username, email, password_, registration_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          newUser.id,
          newUser.username,
          newUser.email,
          newUser.password_,
          newUser.registration_date,
        ]
      );
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("❌ Error en createUser:", error);
      throw error;
    }
  }
}
