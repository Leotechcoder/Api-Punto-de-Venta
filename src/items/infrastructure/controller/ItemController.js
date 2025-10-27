// src/modules/items/controller/ItemController.js

/**
 * ItemController (ligero)
 * - Por política de dominio los endpoints que modifican items están guardados dentro del contexto orders:
 *   (POST /orders, POST /orders/:id/items, PATCH /orders/:id/items/:itemId, DELETE /orders/:id/items/:itemId)
 *
 * - Este controlador ofrece endpoints de sólo lectura y da mensajes claros si alguien intenta crear items fuera del agregado.
 */

export class ItemController {
  constructor(itemService) {
    this.itemService = itemService;

    // bind para usar directamente como handlers
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
  }

  // GET /items
  async getAll(req, res) {
    try {
      const items = await this.itemService.getAllItems();
      return res.status(200).json({ items, message: "OK" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /items/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await this.itemService.getItemById(id);
      if (!item) return res.status(404).json({ message: "Item no encontrado 👎" });
      return res.status(200).json({ item, message: "Item encontrado 🤙"});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

}
