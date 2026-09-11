export class Table {
  constructor({
    id,
    number,
    shape,
    capacity,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.number = number;
    this.shape = shape;
    this.capacity = capacity;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // FACTORY METHODS

  static fromPersistence(dbRecord) {
    return new Table({
      id: dbRecord.id,
      number: dbRecord.number,
      shape: dbRecord.shape,
      capacity: dbRecord.capacity,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at
    });
  }

  static fromDTO(dto) {
    return new Table({
      id: dto.id,
      number: dto.number,
      shape: dto.shape,
      capacity: dto.capacity,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    });
  }

  // DOMAIN METHODS

  updateNumber(number) {
    if (!Number.isInteger(number) || number <= 0) {
      throw new Error("Table number must be a positive integer");
    }

    this.number = number;
  }

  updateCapacity(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Table capacity must be greater than zero");
    }

    this.capacity = capacity;
  }

  updateShape(shape) {
    const validShapes = ["round", "square"];

    if (!validShapes.includes(shape)) {
      throw new Error("Invalid table shape");
    }

    this.shape = shape;
  }

  // MAPPERS

  toDTO() {
    return {
      id: this.id,
      number: this.number,
      shape: this.shape,
      capacity: this.capacity,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toPersistenceForCreate() {
    return {
      number: this.number,
      shape: this.shape,
      capacity: this.capacity
    };
  }

  toPersistenceForUpdate() {
    const data = {};

    if (this.number !== undefined) {
      data.number = this.number;
    }

    if (this.shape !== undefined) {
      data.shape = this.shape;
    }

    if (this.capacity !== undefined) {
      data.capacity = this.capacity;
    }

    return data;
  }
}