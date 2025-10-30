/**
 * @file dataBaseAuditRepository.js
 * @description Repositorio para registrar y consultar eventos de auditoría en la tabla `user_audit_log`.
 * Usar para loguear acciones como LOGIN, LOGOUT, ASSIGN_ROLE, REMOVE_ROLE, UPDATE_PROFILE, etc.
 *
 * Ruta esperada del pool: ../../../../shared/infrastructure/postgresConnection.js
 */

import pool from "../../../../shared/infrastructure/postgresConnection.js";

export class DatabaseAuditRepository {
  /**
   * Registra una acción de auditoría.
   * @param {string} action - Nombre de la acción (ej: 'LOGIN', 'ASSIGN_ROLE')
   * @param {string|null} userId - ID del usuario relacionado (puede ser null para acciones del sistema)
   * @param {object} [details={}] - Objeto con información adicional (ip, payload, before/after, assignedBy, etc.)
   * @returns {Promise<object>} - Retorna el row insertado convertido a objeto (sin transformaciones complejas)
   */
  async log(action, userId = null, details = {}) {
    try {
      const res = await pool.query(
        `INSERT INTO public.user_audit_log (user_id, action, details)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, action, JSON.stringify(details)]
      );

      // Devolver el registro insertado (rows[0]) para quien quiera usarlo
      return res.rows[0];
    } catch (error) {
      console.error("❌ Error en DatabaseAuditRepository.log:", error);
      throw error;
    }
  }

  /**
   * Obtiene logs de un usuario con paginación simple.
   * @param {string} userId
   * @param {number} [limit=50]
   * @param {number} [offset=0]
   * @returns {Promise<Array>} - Array de rows (cada row contiene details como JSON)
   */
  async findByUser(userId, limit = 50, offset = 0) {
    try {
      const res = await pool.query(
        `SELECT * FROM public.user_audit_log
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return res.rows;
    } catch (error) {
      console.error("❌ Error en DatabaseAuditRepository.findByUser:", error);
      throw error;
    }
  }

  /**
   * Obtener logs filtrando por acción, rango de fechas y paginación.
   * @param {object} filters
   * @param {string|null} [filters.action] - Filtrar por tipo de acción (ej 'LOGIN')
   * @param {string|null} [filters.userId] - Filtrar por userId
   * @param {string|null} [filters.from] - Fecha ISO inicio (inclusive)
   * @param {string|null} [filters.to] - Fecha ISO fin (inclusive)
   * @param {number} [limit=100]
   * @param {number} [offset=0]
   * @returns {Promise<Array>}
   */
  async findByFilters({ action = null, userId = null, from = null, to = null } = {}, limit = 100, offset = 0) {
    try {
      const conditions = [];
      const values = [];
      let idx = 1;

      if (userId) {
        conditions.push(`user_id = $${idx++}`);
        values.push(userId);
      }
      if (action) {
        conditions.push(`action = $${idx++}`);
        values.push(action);
      }
      if (from) {
        conditions.push(`created_at >= $${idx++}`);
        values.push(from);
      }
      if (to) {
        conditions.push(`created_at <= $${idx++}`);
        values.push(to);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const query = `
        SELECT * FROM public.user_audit_log
        ${where}
        ORDER BY created_at DESC
        LIMIT $${idx++} OFFSET $${idx++}
      `;

      values.push(limit);
      values.push(offset);

      const res = await pool.query(query, values);
      return res.rows;
    } catch (error) {
      console.error("❌ Error en DatabaseAuditRepository.findByFilters:", error);
      throw error;
    }
  }

  /**
   * Contador de logs (útil para paginación).
   * @param {object} filters - Mismos filtros que findByFilters
   * @returns {Promise<number>} - Cantidad de registros que cumplen filtros
   */
  async countByFilters({ action = null, userId = null, from = null, to = null } = {}) {
    try {
      const conditions = [];
      const values = [];
      let idx = 1;

      if (userId) {
        conditions.push(`user_id = $${idx++}`);
        values.push(userId);
      }
      if (action) {
        conditions.push(`action = $${idx++}`);
        values.push(action);
      }
      if (from) {
        conditions.push(`created_at >= $${idx++}`);
        values.push(from);
      }
      if (to) {
        conditions.push(`created_at <= $${idx++}`);
        values.push(to);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const query = `SELECT COUNT(*)::INT AS total FROM public.user_audit_log ${where}`;

      const res = await pool.query(query, values);
      return res.rows[0]?.total ?? 0;
    } catch (error) {
      console.error("❌ Error en DatabaseAuditRepository.countByFilters:", error);
      throw error;
    }
  }
}
