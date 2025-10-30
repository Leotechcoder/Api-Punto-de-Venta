/**
 * @file roleEntity.js
 * @description Entidad de dominio que representa un rol de usuario dentro del sistema.
 * No tiene dependencias externas y se encarga solo de mantener la estructura y consistencia
 * de los datos relacionados con roles.
 */

export class RoleEntity {
  /**
   * @param {object} props - Propiedades del rol
   * @param {number|string} props.id - Identificador del rol
   * @param {string} props.name - Nombre único del rol (ej: 'admin', 'employee', 'customer')
   * @param {string} [props.description] - Descripción del rol
   * @param {Date|string} [props.createdAt] - Fecha de creación
   */
  constructor({ id, name, description = null, createdAt = new Date() }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  /**
   * Convierte la entidad en un objeto plano JSON.
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
    };
  }
}
