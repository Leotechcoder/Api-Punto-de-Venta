import { ProductService } from "../../application/ProductService.js";
import { DatabaseProductRepository } from "../adapters/DatabaseProductRepository.js";
import { validateProduct, validateProductUpdate } from "../../domain/productSchema.js";
import { AccessControl } from "../../../shared/AccessControl.js";

const productRepository = new DatabaseProductRepository();
const productService = new ProductService(productRepository);

export class ProductController {
  static async getAll(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;

      const products = await productService.getAllProducts();
      if (!products.length) {
        return res.status(404).json({ message: "No se encontraron productos" });
      }

      return res.status(200).json({
        products: products,
        message: "Operación completada",
      });
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }

  static async getById(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;

      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      return res.status(200).json({
        data: product,
        message: "Operación completada",
      });
    } catch (error) {
      console.error("❌ Error en getById:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }

  static async create(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;

      const validation = validateProduct(req.body);
      console.log(validation.error);
      if (!validation.success) {
        return res.status(400).json({
          message: "Error al crear el producto",
          errors: validation.error.errors,
        });
      }
      
      const newProduct = await productService.createProduct(validation.data);

      return res.status(201).json({
        data: newProduct,
        message: "Producto creado correctamente",
      });
    } catch (error) {
      console.error("❌ Error en create:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }

  static async update(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;

      // Convertimos `available` a boolean si viene como string
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

      const updatedProduct = await productService.updateProduct(req.params.id, validation.data);

      if (!updatedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.status(200).json({
        data: updatedProduct,
        message: "Producto actualizado correctamente 🤙",
      });
    } catch (error) {
      console.error("❌ Error en update:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }

  static async delete(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;

      const deleted = await productService.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error("❌ Error en delete:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }
}
