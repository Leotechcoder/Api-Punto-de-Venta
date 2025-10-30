/**
 * @file permissionRepository.js
 * @description Interfaz abstracta que define los métodos necesarios para manipular
 * permisos dentro de la aplicación. Las implementaciones concretas deben extenderla.
 */

export class PermissionRepository {
  /**
   * Obtiene todos los permisos.
   * @abstract
   * @returns {Promise<PermissionEntity[]>}
   */
  async findAll() {
    throw new Error("Method not implemented: findAll()");
  }

  /**
   * Busca un permiso por nombre.
   * @param {string} name
   * @abstract
   * @returns {Promise<PermissionEntity|null>}
   */
  async findByName(name) {
    throw new Error("Method not implemented: findByName()");
  }

  /**
   * Crea un permiso.
   * @param {{ name: string, description?: string }} permissionData
   * @abstract
   * @returns {Promise<PermissionEntity>}
   */
  async create(permissionData) {
    throw new Error("Method not implemented: create()");
  }

  /**
   * Asigna un permiso a un rol.
   * @param {string} roleName
   * @param {string} permissionName
   * @abstract
   * @returns {Promise<boolean>}
   */
  async assignToRole(roleName, permissionName) {
    throw new Error("Method not implemented: assignToRole()");
  }

  /**
   * Remueve un permiso de un rol.
   * @param {string} roleName
   * @param {string} permissionName
   * @abstract
   * @returns {Promise<boolean>}
   */
  async removeFromRole(roleName, permissionName) {
    throw new Error("Method not implemented: removeFromRole()");
  }
}
