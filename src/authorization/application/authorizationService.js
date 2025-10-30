/**
 * @file authorizationService.js
 * @description Servicio de aplicación responsable de integrar la lógica de roles y permisos.
 * En esta primera versión maneja roles; luego se extenderá con permisos y auditorías.
 */

export class AuthorizationService {
  /**
   * @param {object} deps
   * @param {import("./roleRepository.js").RoleRepository} deps.roleRepository
   * @param {import("../../infrastructure/adapters/DatabaseAuditRepository.js").DatabaseAuditRepository} [deps.auditRepository]
   */
  constructor({ roleRepository, auditRepository = null }) {
    this.roleRepository = roleRepository;
    this.auditRepository = auditRepository;
  }

  /**
   * Devuelve los roles de un usuario por su ID.
   * @param {string} userId
   * @returns {Promise<string[]>} - Lista de nombres de roles
   */
  async getUserRoles(userId) {
    try {
      const roles = await this.roleRepository.findAll(); // podrías optimizar con un findByUserId
      const assigned = roles.filter((r) => r.user_id === userId);
      return assigned.map((r) => r.name);
    } catch (error) {
      console.error("❌ Error en getUserRoles:", error);
      throw error;
    }
  }

  /**
   * Asigna un rol a un usuario.
   * @param {string} userId
   * @param {string} roleName
   * @param {string|null} assignedBy
   */
  async assignRole(userId, roleName, assignedBy = null) {
    try {
      const success = await this.roleRepository.assignToUser(userId, roleName, assignedBy);
      if (success && this.auditRepository) {
        await this.auditRepository.log("ASSIGN_ROLE", assignedBy || userId, {
          userId,
          roleName,
        });
      }
      return success;
    } catch (error) {
      console.error("❌ Error en assignRole:", error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario tiene un rol específico.
   * @param {string} userId
   * @param {string} roleName
   * @returns {Promise<boolean>}
   */
  async hasRole(userId, roleName) {
    try {
      const roles = await this.getUserRoles(userId);
      return roles.includes(roleName);
    } catch (error) {
      console.error("❌ Error en hasRole:", error);
      throw error;
    }
  }
}
