export class N8NOrderController {
  constructor(orderService, productService) {
    this.orderService = orderService;
    this.productService = productService;
  }

  createWhatsappOrder = async (req, res) => {
    try {
      const {
        customer_phone,
        customer_name,
        delivery_address,
        items,
      } = req.body;

      const products = await this.productService.getAllProducts();

      const orderItems = [];
      let total = 0;

      for (const item of items) {
        const product = products.find(
          (p) =>
            p.name.toLowerCase() === item.nombre.toLowerCase()
        );

        if (!product) {
          return res.status(400).json({
            error: `Producto no encontrado: ${item.nombre}`,
          });
        }

        const quantity = Number(item.cantidad);

        orderItems.push({
          id: crypto.randomUUID(),
          productId: product.id,
          productName: product.name,
          unitPrice: Number(product.price),
          quantity,
        });

        total += Number(product.price) * quantity;
      }

      const orderDTO = {
        userId: customer_phone,
        userName: customer_name,
        status: "pending",
        items: orderItems,
        totalAmount: total,
        deliveryType: "delivery",
        deliveryAddress: delivery_address,
      };

      const order = await this.orderService.createOrder(
        orderDTO
      );

      return res.status(201).json({
        success: true,
        order,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: error.message,
      });
    }
  };
}