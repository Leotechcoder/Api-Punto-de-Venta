import bcrypt from "bcrypt";
import { UserRepository } from "../../application/UserRepository.js";
import { idGenerator } from "../../../shared/idGenerator.js";

export class DatabaseUserRepository extends UserRepository {
  /**
   * Obtiene todos los usuarios
   * @param {object} client - Cliente activo de PostgreSQL (pool.connect())
   */
  async getAll(client) {
    try {
      const result = await client.query("SELECT * FROM public.users");
      
      
      return result.rows;
    } catch (error) {
      console.error("❌ [UserRepository] Error en getAll:", error);
      throw new Error("Error al obtener usuarios");
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  async getById(id, client) {
    try {
      const result = await client.query("SELECT * FROM public.users WHERE id_ = $1", [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ [UserRepository] Error en getById:", error);
      throw new Error("Error al obtener usuario");
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async create(userData, client) {
    try {
      const id = idGenerator("Users");
      const { username, email, phone, address, password_, avatar } = userData;

      const hashedPassword = password_ ? await bcrypt.hash(password_, 10) : null;
      const registration_date = new Date().toISOString();

      const query = `
        INSERT INTO public.users (id_, username, email, phone, address, avatar, password_, registration_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [id, username, email, phone, address, avatar, hashedPassword, registration_date];
      const result = await client.query(query, values);
      console.log(result.rows);
      return result.rows[0];
    } catch (error) {
      console.error("❌ [UserRepository] Error en create:", error);
      throw new Error("Error al crear usuario");
    }
  }

  /**
   * Actualiza parcialmente un usuario
   */
  async update(id, userData, client) {
    try {
      const { username, phone, address } = userData;
      const update_profile = new Date().toISOString();

      const query = `
        UPDATE public.users
        SET username = $1, phone = $2, address = $3, update_profile = $4
        WHERE id_ = $5
        RETURNING *;
      `;
      const values = [username, phone, address, update_profile, id];
      const result = await client.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ [UserRepository] Error en update:", error);
      throw new Error("Error al actualizar usuario");
    }
  }

  /**
   * Elimina un usuario por ID
   */
  async delete(id, client) {
    try {
      const result = await client.query("DELETE FROM public.users WHERE id_ = $1", [id]);
      return result.rowCount === 1;
    } catch (error) {
      console.error("❌ [UserRepository] Error en delete:", error);
      throw new Error("Error al eliminar usuario");
    }
  }

  /**
   * Busca un usuario existente o lo crea (usado en login con terceros)
   */
  async findOrCreate(thirdPartyId, username, email, client) {
    try {
      const found = await client.query("SELECT * FROM public.users WHERE id_ = $1", [thirdPartyId]);
      if (found.rows[0]) return found.rows[0];

      const registration_date = new Date().toISOString();
      const query = `
        INSERT INTO public.users (id_, username, email, registration_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [thirdPartyId, username, email ?? "FacebookUser", registration_date];
      const result = await client.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("❌ [UserRepository] Error en findOrCreate:", error);
      throw new Error("Error al buscar o crear usuario");
    }
  }
}
