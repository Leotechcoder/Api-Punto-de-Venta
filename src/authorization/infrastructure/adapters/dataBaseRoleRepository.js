/**
 * @file dataBaseRoleRepository.js
 * @description Implementación concreta del repositorio de roles utilizando PostgreSQL.
 * Usa el pool de conexión compartido para realizar consultas seguras y parametrizadas.
 */

import pool from "../../../../shared/infrastructure/postgresConnection.js";
import { RoleRepository } from "../../application/roleRepository.js";
import { RoleEntity } from "../../domain/roleEntity.js";

export class DatabaseRoleRepository extends RoleRepository {
  /**
   * Devuelve todos los roles del sistema.
   * @returns {Promise<RoleEntity[]>}
   */
  async findAll() {
    try {
      const res = await pool.query("SELECT * FROM public.roles ORDER BY id_ ASC");
      return res.rows.map((r) => new RoleEntity({
        id: r.id_,
        name: r.name,
        description: r.description,
        createdAt: r.created_at
      }));
    } catch (error) {
      console.error("❌ Error en findAll:", error);
      throw error;
    }
  }

  /**
   * Busca un rol por su nombre.
   * @param {string} name
   * @returns {Promise<RoleEntity|null>}
   */
  async findByName(name) {
    try {
      const res = await pool.query("SELECT * FROM public.roles WHERE name = $1 LIMIT 1", [name]);
      if (res.rowCount === 0) return null;
      const r = res.rows[0];
      return new RoleEntity({
        id: r.id_,
        name: r.name,
        description: r.description,
        createdAt: r.created_at
      });
    } catch (error) {
      console.error("❌ Error en findByName:", error);
      throw error;
    }
  }

  /**
   * Crea un nuevo rol (si no existe).
   * @param {{ name: string, description?: string }} roleData
   * @returns {Promise<RoleEntity>}
   */
  async create(roleData) {
    try {
      const res = await pool.query(
        `INSERT INTO public.roles (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
         RETURNING *`,
        [roleData.name, roleData.description || null]
      );
      const r = res.rows[0];
      return new RoleEntity({
        id: r.id_,
        name: r.name,
        description: r.description,
        createdAt: r.created_at
      });
    } catch (error) {
      console.error("❌ Error en create:", error);
      throw error;
    }
  }

  /**
   * Asigna un rol a un usuario (si no está ya asignado).
   * @param {string} userId
   * @param {string} roleName
   * @param {string|null} assignedBy
   */
  async assignToUser(userId, roleName, assignedBy = null) {
    try {
      const role = await this.findByName(roleName);
      if (!role) throw new Error(`Rol no encontrado: ${roleName}`);

      const res = await pool.query(
        `INSERT INTO public.user_roles (user_id, role_id, assigned_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, role_id) DO NOTHING
         RETURNING *`,
        [userId, role.id, assignedBy]
      );

      return res.rowCount > 0;
    } catch (error) {
      console.error("❌ Error en assignToUser:", error);
      throw error;
    }
  }

  /**
   * Remueve un rol asignado a un usuario.
   * @param {string} userId
   * @param {string} roleName
   */
  async removeFromUser(userId, roleName) {
    try {
      const role = await this.findByName(roleName);
      if (!role) throw new Error(`Rol no encontrado: ${roleName}`);

      const res = await pool.query(
        "DELETE FROM public.user_roles WHERE user_id = $1 AND role_id = $2",
        [userId, role.id]
      );

      return res.rowCount > 0;
    } catch (error) {
      console.error("❌ Error en removeFromUser:", error);
      throw error;
    }
  }
}
