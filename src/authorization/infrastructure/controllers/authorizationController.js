/**
 * @file authorizationController.js
 * @description Controlador Express para manejar la autorización de usuarios:
 * roles, permisos y verificaciones de acceso.
 * Utiliza AuthorizationService como capa intermedia.
 */

import { AuthorizationService } from "../../application/authorizationService.js";
import { DatabaseRoleRepository } from "../adapters/dataBaseRoleRepository.js";
import { DatabasePermissionRepository } from "../adapters/dataBasePermissionRepository.js";
import { DatabaseAuditRepository } from "../adapters/DatabaseAuditRepository.js";

export class AuthorizationController {
  constructor() {
    // Inyección manual de dependencias (repositorios concretos)
    const roleRepo = new DatabaseRoleRepository();
    const permRepo = new DatabasePermissionRepository();
    const auditRepo = new DatabaseAuditRepository();

    this.authorizationService = new AuthorizationService(roleRepo, permRepo, auditRepo);

    // Binding de métodos para usarlos directamente en las rutas
    this.getRolesByUser = this.getRolesByUser.bind(this);
    this.assignRole = this.assignRole.bind(this);
    this.checkPermission = this.checkPermission.bind(this);
  }

  /**
   * Devuelve todos los roles asignados a un usuario.
   * @route GET /roles/:userId
   */
  async getRolesByUser(req, res) {
    try {
      const { userId } = req.params;
      const roles = await this.authorizationService.getUserRoles(userId);
      return res.status(200).json({ userId, roles });
    } catch (error) {
      console.error("❌ Error en getRolesByUser:", error);
      return res.status(500).json({ message: "Error obteniendo roles del usuario" });
    }
  }

  /**
   * Asigna un rol a un usuario.
   * @route POST /roles/assign
   * @body { userId: string, roleName: string }
   */
  async assignRole(req, res) {
    try {
      const { userId, roleName } = req.body;

      if (!userId || !roleName) {
        return res.status(400).json({ message: "userId y roleName son requeridos" });
      }

      const result = await this.authorizationService.assignRole(userId, roleName);
      if (!result) {
        return res.status(400).json({ message: "No se pudo asignar el rol" });
      }

      return res.status(200).json({ message: "Rol asignado correctamente", userId, roleName });
    } catch (error) {
      console.error("❌ Error en assignRole:", error);
      return res.status(500).json({ message: "Error asignando rol al usuario" });
    }
  }

  /**
   * Verifica si un usuario tiene un permiso específico.
   * @route POST /permissions/check
   * @body { userId: string, permissionName: string }
   */
  async checkPermission(req, res) {
    try {
      const { userId, permissionName } = req.body;

      if (!userId || !permissionName) {
        return res.status(400).json({ message: "userId y permissionName son requeridos" });
      }

      const hasPermission = await this.authorizationService.hasPermission(userId, permissionName);
      return res.status(200).json({ userId, permissionName, hasPermission });
    } catch (error) {
      console.error("❌ Error en checkPermission:", error);
      return res.status(500).json({ message: "Error verificando permiso del usuario" });
    }
  }
}
