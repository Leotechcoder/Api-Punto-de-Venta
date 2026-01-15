export class StoreProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getAll = async (req, res) => {
    try {
      const products = await this.productService.getAllProducts();
      if (!products.length)
        return res.status(404).json({ message: "No se encontraron productos" });

      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
