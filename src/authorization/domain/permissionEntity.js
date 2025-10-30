/**
 * @file permissionEntity.js
 * @description Entidad de dominio que representa un permiso del sistema.
 * Es una entidad pura sin dependencias externas.
 */

export class PermissionEntity {
  /**
   * @param {object} props
   * @param {number|string} props.id - Identificador del permiso
   * @param {string} props.name - Nombre único del permiso (ej: 'create_product')
   * @param {string} [props.description] - Descripción del permiso
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
   * @returns {{ id: number|string, name: string, description: string|null, createdAt: Date }}
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
