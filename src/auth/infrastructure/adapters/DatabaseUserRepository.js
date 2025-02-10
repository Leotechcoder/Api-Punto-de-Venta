import pool from "../../../shared/infrastructure/postgresConnection.js"
import { UserRepository } from "../../application/UserRepository.js"

export class DatabaseUserRepository extends UserRepository {
  static async findOrCreate(thirdPartyId, username, email) {
    // Buscar usuario por thirdPartyId
    const userResult = await pool.query("SELECT * FROM public.users WHERE id_ = $1", [thirdPartyId])
    const user = userResult.rows[0]
    console.log('acaaaaqqq');
    
    if (!user) {
      // Crear un nuevo usuario si no existe
      const newUser = {
        id: thirdPartyId,
        username,
        email: email ?? "Facebook",
        registration_date: new Date().toLocaleString(),
      }
      const columns = ["id_", "username", "email", "registration_date"]
      const values = [newUser.id, newUser.username, newUser.email, newUser.registration_date]

      const filteredValues = values.map((value) => value ?? null)
      const placeholders = filteredValues.map((_, index) => `$${index + 1}`).join(", ")
      const insertQuery = `INSERT INTO public.users (${columns.join(", ")}) VALUES (${placeholders}`

      try {
        const insertResult = await pool.query(insertQuery, filteredValues)

        if (insertResult.rowCount === 1) {
          const user  = await pool.query('SELECT * FROM public.users WHERE id_ = $1', [thirdPartyId]);
          console.log(user);
          return user.rows[0];
        }
      } catch (error) {
        console.error("Error inserting user:", error)
        throw error
      }
    }
    return user
  }
}

