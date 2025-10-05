// src/shared/domain/BaseEntity.js
export class BaseEntity {
  constructor(props = {}) {
    Object.assign(this, BaseEntity.toCamelCase(props));
  }

  // Convierte snake_case → camelCase
  static toCamelCase(obj) {
    if (Array.isArray(obj)) {
      return obj.map((v) => BaseEntity.toCamelCase(v));
    } else if (obj && typeof obj === "object") {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = BaseEntity.toCamelCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  // Convierte camelCase → snake_case (CORREGIDA)
  static toSnakeCase(obj) {
    if (Array.isArray(obj)) {
      return obj.map((v) => BaseEntity.toSnakeCase(v));
    } else if (obj && typeof obj === "object") {
      return Object.keys(obj).reduce((acc, key) => {
        // Maneja mayúsculas y guiones bajos existentes correctamente
        const snakeKey = key
          .replace(/([A-Z])/g, "_$1") // inserta _ antes de mayúsculas
          .replace(/__/g, "_")        // elimina dobles underscores si los hay
          .toLowerCase();
        acc[snakeKey] = BaseEntity.toSnakeCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  toPersistence() {
    return BaseEntity.toSnakeCase(this);
  }

  toJSON() {
    return BaseEntity.toCamelCase(this);
  }
}
