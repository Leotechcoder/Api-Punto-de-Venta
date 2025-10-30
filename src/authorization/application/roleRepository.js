/**
 * @file roleRepository.js
 * @description Interfaz abstracta que define los métodos necesarios para manipular
 * roles dentro de la aplicación. Las implementaciones concretas (por ejemplo, PostgreSQL)
 * deben extender esta clase y definir sus métodos.
 */

export class RoleRepository {
  /**
   * Obtiene todos los roles existentes.
   * @abstract
   */
  async findAll() {
    throw new Error("Method not implemented: findAll()");
  }

  /**
   * Busca un rol por su nombre.
   * @param {string} name
   * @abstract
   */
  async findByName(name) {
    throw new Error("Method not implemented: findByName()");
  }

  /**
   * Crea un nuevo rol.
   * @param {object} roleData - { name, description }
   * @abstract
   */
  async create(roleData) {
    throw new Error("Method not implemented: create()");
  }

  /**
   * Asigna un rol a un usuario.
   * @param {string} userId
   * @param {string} roleName
   * @param {string|null} assignedBy
   * @abstract
   */
  async assignToUser(userId, roleName, assignedBy = null) {
    throw new Error("Method not implemented: assignToUser()");
  }

  /**
   * Remueve un rol asignado a un usuario.
   * @param {string} userId
   * @param {string} roleName
   * @abstract
   */
  async removeFromUser(userId, roleName) {
    throw new Error("Method not implemented: removeFromUser()");
  }
}
