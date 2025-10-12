// src/modules/items/application/ItemService.js

/**
 * ItemService
 * - Exposición pública limitada: lectura de items y helpers para ser usados por OrderService.
 * - No permite crear items "sueltos" desde aquí (ese acto pertenece a OrderService al crear/crearItem dentro de la transacción).
 *
 * Los métodos que modifican/deleting aceptan un `client` opcional para ser usados dentro de transacciones orquestadas
 * por OrderService (recomendado). Si se llama sin client, el repository debe manejar la conexión por defecto.
 */

import { Item } from "../domain/Item.js";
import pool from "../../shared/infrastructure/postgresConnection.js";

export class ItemService {
  constructor(itemRepository) {
    this.itemRepository = itemRepository;
  }

  // Lectura: devuelve DTOs amigables al frontend
  async getAllItems() {
    const rows = await this.itemRepository.getAll(pool);
    return rows.map(Item.fromPersistence).map((i) => i.toDTO());
  }

  async getItemById(id) {
    const row = await this.itemRepository.getById(id, pool);
    const item = Item.fromPersistence(row);
    if (!item) return null;
    return item.toDTO();
  }

  // Obtener items por orderId (útil para GET /orders/:id, o internamente)
  async getItemsByOrderId(orderId) {
    const rows = await this.itemRepository.getByOrderId(orderId, pool);
    return rows.map(Item.fromPersistence).map((i) => i.toDTO());
  }

  /* ---------- Métodos de modificación (deben ser llamados por OrderService dentro de transacción) ---------- */

  // Actualiza campos del item. Se recomienda pasar client para usar la misma transacción de la orden.
  async updateItemFields(itemId, fields, client = pool) {
    // Validaciones de dominio leve: quantity/price si vienen
    if (fields.quantity !== undefined) {
      const q = Number(fields.quantity);
      if (!Number.isFinite(q) || q < 0) throw new Error("Quantity must be a non-negative number");
    }
    if (fields.unit_price !== undefined) {
      const p = Number(fields.unit_price);
      if (!Number.isFinite(p) || p < 0) throw new Error("Unit price must be non-negative");
    }

    const updated = await this.itemRepository.updateFields(itemId, fields, client);
    return Item.fromPersistence(updated).toDTO();
  }

  // Borrar item (dentro de la orden). Pasar client cuando se llame desde OrderService.
  async deleteItem(itemId, client = pool) {
    await this.itemRepository.delete(itemId, client);
    return true;
  }

}
