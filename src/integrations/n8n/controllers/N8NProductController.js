
export class N8NProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getProducts = async (req, res) => {
    try {
      const products = await this.productService.getAllProducts();

      const catalog = products
        .filter(product => product.available)
        .map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
        }));

      return res.status(200).json({
        products: catalog,
      });
    } catch (error) {
      console.error("Error obteniendo productos para n8n:", error);

      return res.status(500).json({
        error: error.message,
      });
    }
  };
}