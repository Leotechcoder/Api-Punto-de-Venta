export class StoreProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getAll = async (req, res) => {
    try {
      const products = await this.productService.getAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const product = await this.productService.getById(req.params.id);
      res.json(product);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
}
