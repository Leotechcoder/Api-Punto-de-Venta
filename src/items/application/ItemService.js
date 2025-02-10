
export class ItemService {
    constructor(itemRepository) {
      this.itemRepository = itemRepository;
    }
  
    async getAllItems() {
      return this.itemRepository.getAll();
    }
  
    async getItemById(id) {
      return this.itemRepository.getById(id);
    }
  
    async createItem(items) {
      return this.itemRepository.create(items);
    }
  
    async updateItem(id, itemData) {
      return this.itemRepository.update(id, itemData);
    }
  
    async deleteItem(id) {
      return this.itemRepository.delete(id);
    }
  }