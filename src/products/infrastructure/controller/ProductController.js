
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
      if (!products.length) return res.status(404).json({ message: "No se encontraron productos" });
      return res.status(200).json(products);
    } catch (error) {
      console.error("❌ Error en getAll:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }

  static async getById(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const product = await productService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      return res.status(200).json(product);
    } catch (error) {
      console.error("❌ Error en getById:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }

  static async create(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const result = validateProduct(req.body);
      if (!result.success) return res.status(400).json({ message: "Error al crear el producto", errors: result.error.errors });
      const newProduct = await productService.createProduct(result.data);
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error("❌ Error en create:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }

  static async update(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const result = validateProductUpdate(req.body);
      if (!result.success) return res.status(400).json({ message: "Objeto no válido", errors: result.error.errors });
      const updatedProduct = await productService.updateProduct(req.params.id, result.data);
      if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
      return res.status(200).json({ message: "Producto actualizado correctamente", product: updatedProduct });
    } catch (error) {
      console.error("❌ Error en update:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }

  static async delete(req, res) {
    try {
      if (!AccessControl.handleRequest(req, res)) return;
      const deleted = await productService.deleteProduct(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });
      return res.status(204).send();
    } catch (error) {
      console.error("❌ Error en delete:", error);
      return res.status(500).json({ message: "Error interno del servidor", details: error.message });
    }
  }
}
