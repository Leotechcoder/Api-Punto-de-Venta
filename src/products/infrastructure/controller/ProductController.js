// src/modules/products/controller/ProductController.js
import { validateProduct, validateProductUpdate } from "../../domain/productSchema.js";

export class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getAll = async (req, res) => {
    try {
      const products = await this.productService.getAllProducts();
      if (!products.length)
        return res.status(404).json({ message: "No se encontraron productos" });

      res.status(200).json({ products, message: "Operación completada ✅" });
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).json({ product, message: "Producto encontrado correctamente 👌" });
    } catch (error) {
      console.error("❌ Error en getById:", error);
      res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const validation = validateProduct(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Error al crear el producto",
          errors: validation.error.errors,
        });
      }

      const newProduct = await this.productService.createProduct(validation.data);
      res.status(201).json({ product: newProduct, message: "Producto creado correctamente 🎉" });
    } catch (error) {
      console.error("❌ Error en create:", error);
      res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  };

  update = async (req, res) => {
    try {
      if (typeof req.body.available === "string") {
        req.body.available = req.body.available === "true";
      }

      const validation = validateProductUpdate(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Objeto no válido",
          errors: validation.error.errors,
        });
      }

      const updatedProduct = await this.productService.updateProduct(req.params.id, validation.data);
      if (!updatedProduct)
        return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).json({
        product: updatedProduct,
        message: "Producto actualizado correctamente 🤙",
      });
    } catch (error) {
      console.error("❌ Error en update:", error);
      res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const deleted = await this.productService.deleteProduct(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).json({ message: "Producto eliminado correctamente 🧹" });
    } catch (error) {
      console.error("❌ Error en delete:", error);
      res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  };
}
