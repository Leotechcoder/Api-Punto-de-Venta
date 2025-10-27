// src/shared/domain/BaseEntity.js
export class BaseEntity {
  constructor(props = {}) {
    Object.assign(this, BaseEntity.toCamelCase(props || {}));
  }

  static toCamelCase(obj) {
    if (Array.isArray(obj)) return obj.map(BaseEntity.toCamelCase);
    if (obj && typeof obj === "object")
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        acc[camelKey] = BaseEntity.toCamelCase(obj[key]);
        return acc;
      }, {});
    return obj;
  }

  static toSnakeCase(obj) {
    if (Array.isArray(obj)) return obj.map(BaseEntity.toSnakeCase);
    if (obj && typeof obj === "object")
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key
          .replace(/([A-Z])/g, "_$1")
          .replace(/__/g, "_")
          .toLowerCase();
        acc[snakeKey] = BaseEntity.toSnakeCase(obj[key]);
        return acc;
      }, {});
    return obj;
  }

  toPersistence() {
    return BaseEntity.toSnakeCase(this);
  }

  toJSON() {
    return BaseEntity.toCamelCase(this);
  }
}
