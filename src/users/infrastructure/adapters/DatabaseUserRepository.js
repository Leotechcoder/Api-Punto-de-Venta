import pool from "../../../shared/infrastructure/postgresConnection.js"
import { UserRepository } from "../../application/UserRepository.js"
import { User } from "../../domain/User.js"
import { idGenerator } from "../../../shared/idGenerator.js"

export class DatabaseUserRepository extends UserRepository {
  async getAll() {
    const result = await pool.query("SELECT * FROM public.users")
    return result.rows.map((row) => new User(row.id_, row.username, row.email, row.phone, row.address, row.avatar))
  }

  async getById(id) {
    const result = await pool.query("SELECT * FROM public.users WHERE id_ = $1", [id])
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return new User(row.id_, row.username, row.email, row.phone, row.address, row.avatar)
  }

  async create(userData) {
    const id = idGenerator("Users")
    const { username, email, phone, address, avatar } = userData
    const result = await pool.query(
      "INSERT INTO public.users (id_, username, email, phone, address, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, username, email, phone, address, avatar],
    )
    const row = result.rows[0]
    return new User(row.id_, row.username, row.email, row.phone, row.address, row.avatar)
  }

  async update(id, userData) {
    const { username, phone, address } = userData
    const result = await pool.query(
      "UPDATE public.users SET username = $1, phone = $2, address = $3 WHERE id_ = $4 RETURNING *",
      [username, phone, address, id],
    )
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return new User(row.id_, row.username, row.email, row.phone, row.address, row.avatar)
  }

  async delete(id) {
    const result = await pool.query("DELETE FROM public.users WHERE id_ = $1", [id])
    return result.rowCount === 1
  }

  async findOrCreate(thirdPartyId, username, email) {
    const userResult = await pool.query("SELECT * FROM public.users WHERE id_ = $1", [thirdPartyId])
    const user = userResult.rows[0]

    if (!user) {
      const newUser = {
        id: thirdPartyId,
        username,
        email: email ?? "Facebook",
        registration_date: new Date().toLocaleString(),
      }
      const columns = ["id_", "username", "email", "registration_date"]
      const values = [newUser.id, newUser.username, newUser.email, newUser.registration_date]

      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ")
      const insertQuery = `INSERT INTO public.users (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`

      try {
        const insertResult = await pool.query(insertQuery, values)
        return insertResult.rows[0]
      } catch (error) {
        console.error("Error inserting user:", error)
        throw error
      }
    }
    return user
  }
}

