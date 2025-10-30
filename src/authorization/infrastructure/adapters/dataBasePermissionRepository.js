/**
 * @file dataBasePermissionRepository.js
 * @description Implementación del repositorio de permisos usando PostgreSQL (pool).
 * Realiza consultas parametrizadas y devuelve PermissionEntity cuando corresponde.
 */

import pool from "../../../../shared/infrastructure/postgresConnection.js";
import { PermissionRepository } from "../../application/PermissionRepository.js";
import { PermissionEntity } from "../../domain/permissionEntity.js";

export class DatabasePermissionRepository extends PermissionRepository {
  /**
   * Devuelve todos los permisos.
   * @returns {Promise<PermissionEntity[]>}
   */
  async findAll() {
    try {
      const res = await pool.query("SELECT * FROM public.permissions ORDER BY id_ ASC");
      return res.rows.map((p) => new PermissionEntity({
        id: p.id_,
        name: p.name,
        description: p.description,
        createdAt: p.created_at
      }));
    } catch (error) {
      console.error("❌ Error en findAll (permissions):", error);
      throw error;
    }
  }

  /**
   * Busca un permiso por su nombre.
   * @param {string} name
   * @returns {Promise<PermissionEntity|null>}
   */
  async findByName(name) {
    try {
      const res = await pool.query("SELECT * FROM public.permissions WHERE name = $1 LIMIT 1", [name]);
      if (res.rowCount === 0) return null;
      const p = res.rows[0];
      return new PermissionEntity({
        id: p.id_,
        name: p.name,
        description: p.description,
        createdAt: p.created_at
      });
    } catch (error) {
      console.error("❌ Error en findByName (permissions):", error);
      throw error;
    }
  }

  /**
   * Crea un nuevo permiso (o actualiza la descripción si ya existe).
   * @param {{ name: string, description?: string }} permissionData
   * @returns {Promise<PermissionEntity>}
   */
  async create(permissionData) {
    try {
      const res = await pool.query(
        `INSERT INTO public.permissions (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
         RETURNING *`,
        [permissionData.name, permissionData.description || null]
      );
      const p = res.rows[0];
      return new PermissionEntity({
        id: p.id_,
        name: p.name,
        description: p.description,
        createdAt: p.created_at
      });
    } catch (error) {
      console.error("❌ Error en create (permissions):", error);
      throw error;
    }
  }

  /**
   * Asigna un permiso a un rol (por nombre).
   * @param {string} roleName
   * @param {string} permissionName
   * @returns {Promise<boolean>}
   */
  async assignToRole(roleName, permissionName) {
    try {
      // Obtener role id
      const roleRes = await pool.query("SELECT id_ FROM public.roles WHERE name = $1 LIMIT 1", [roleName]);
      if (roleRes.rowCount === 0) throw new Error(`Rol no encontrado: ${roleName}`);
      const roleId = roleRes.rows[0].id_;

      // Obtener permission id (si no existe, crearla)
      let permRes = await pool.query("SELECT id_ FROM public.permissions WHERE name = $1 LIMIT 1", [permissionName]);
      let permissionId;
      if (permRes.rowCount === 0) {
        const insertPerm = await pool.query(
          "INSERT INTO public.permissions (name, description) VALUES ($1, $2) RETURNING *",
          [permissionName, null]
        );
        permissionId = insertPerm.rows[0].id_;
      } else {
        permissionId = permRes.rows[0].id_;
      }

      // Insertar relación role_permissions
      const insert = await pool.query(
        `INSERT INTO public.role_permissions (role_id, permission_id)
         VALUES ($1, $2)
         ON CONFLICT (role_id, permission_id) DO NOTHING
         RETURNING *`,
        [roleId, permissionId]
      );

      return insert.rowCount > 0;
    } catch (error) {
      console.error("❌ Error en assignToRole (permissions):", error);
      throw error;
    }
  }

  /**
   * Remueve un permiso de un rol.
   * @param {string} roleName
   * @param {string} permissionName
   * @returns {Promise<boolean>}
   */
  async removeFromRole(roleName, permissionName) {
    try {
      const roleRes = await pool.query("SELECT id_ FROM public.roles WHERE name = $1 LIMIT 1", [roleName]);
      if (roleRes.rowCount === 0) return false;
      const roleId = roleRes.rows[0].id_;

      const permRes = await pool.query("SELECT id_ FROM public.permissions WHERE name = $1 LIMIT 1", [permissionName]);
      if (permRes.rowCount === 0) return false;
      const permissionId = permRes.rows[0].id_;

      const del = await pool.query(
        "DELETE FROM public.role_permissions WHERE role_id = $1 AND permission_id = $2",
        [roleId, permissionId]
      );

      return del.rowCount > 0;
    } catch (error) {
      console.error("❌ Error en removeFromRole (permissions):", error);
      throw error;
    }
  }
}
