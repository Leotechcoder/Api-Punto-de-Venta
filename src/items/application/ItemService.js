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

}
