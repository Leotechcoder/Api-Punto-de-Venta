
import { ItemService } from "../../application/ItemService.js";
import { DatabaseItemRepository } from "../adapters/DatabaseItemRepository.js";
import { validateItems, validatePartialItems, validateArray } from "../../domain/itemsSchema.js";

const itemRepository = new DatabaseItemRepository();
const itemService = new ItemService(itemRepository);

export class ItemController {
  static async getAll(req, res) {
    try {
      const items = await itemService.getAllItems();
      const arrayPlano = Object.values(items).filter(value => typeof value === 'object');
      return res.status(200).json({items: arrayPlano, message: "OK"});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await itemService.getItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.status(200).json(item);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // static async create(req, res) {
  //   const validation = validateArray(req.body);
  //   if (!validation.success) {
  //     return res.status(400).json({ error: validation.error });
  //   }

  //   try {
  //     const newItems = await itemService.createItem(validation.data);
  //     return res.status(201).json(newItems);
  //   } catch (error) {
  //     return res.status(500).json({ error: error.message });
  //   }
  // }

  static async createOrder(req, res) {
  
  console.log('Objeto json para crear una orden',req.body);
  
  const validation = validatePartialItems(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }
  
  try {
    const createdOrdersItems = await itemService.createItem(validation.data);
    console.log(createdOrdersItems);
    return res.status(200).json(`Orden creada numero: ${createdOrdersItems}`);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
    
  };

  static async updatePartial(req, res) {
    const { id } = req.params;
    const validation = validatePartialItems(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    try {
      const updatedItem = await itemService.updateItem(id, validation.data);
      return res.status(200).json(updatedItem);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await itemService.deleteItem(id);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}