// src/modules/orders/controller/OrderController.js
export class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  getAll = async (req, res) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.status(200).json({orders, message: "Ordenes encontradas 🙌"});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getById = async (req, res) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.status(200).json({order, message: "Orden encontrada 🤝"});
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };

  create = async (req, res) => {
    try {
      const order = await this.orderService.createOrder(req.body);
      res.status(201).json({order, message: "Orden creada correctamente 🤘"});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.orderService.deleteOrder(id);
      if (deleted) {
        res.status(200).json({ message: "Orden eliminada correctamente 🧺" });
      } else {
        res.status(404).json({ message: "Orden no encontrada 🤔" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  addItem = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(req.body)
      const result = await this.orderService.addItemToOrder(id, req.body);
      res.status(201).json({result, message: "Item agregado correctamente 👍"});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  updateItem = async (req, res) => {
    try {
      const { id, itemId } = req.params;
      const result = await this.orderService.updateItemInOrder(id, itemId, req.body);
      res.status(200).json({result, message: "Item actualizado correctamente 🤙"});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  deleteItem = async (req, res) => {
    try {
      const { id, itemId } = req.params;
      const result = await this.orderService.deleteItemFromOrder(id, itemId);
      res.status(200).json({result, message: "Item eliminado correctamente 👌"});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}
