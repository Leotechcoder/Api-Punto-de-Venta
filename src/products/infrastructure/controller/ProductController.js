import { ProductService } from "../../application/ProductService.js";
import { DatabaseProductRepository } from "../adapters/DatabaseProductRepository.js";
import { validateProduct, validateProductUpdate } from "../../domain/productSchema.js";
import { AccessControl } from "../../../shared/AccessControl.js";

const productRepository = new DatabaseProductRepository();
const productService = new ProductService(productRepository);

export class ProductController {
  static async getAll(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const products = await productService.getAllProducts();
      if (products.length < 0) {
        return res.status(404).json({ message: "No se encontraron productos" });
      }
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async getById(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const productId = req.params.id;
      const product = await productService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async create(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const result = validateProduct(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Error al crear el producto", errors: result.error.errors });
      }

      const newProduct = await productService.createProduct(result.data);
      if (!newProduct) {
        return res.status(500).json({ message: "Error al crear el producto" });
      }
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async update(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const result = validateProductUpdate(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Objeto no válido", errors: result.error.errors });
      }

      const productId = req.params.id;
      const updatedProduct = await productService.updateProduct(productId, result.data);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.status(200).json({ message: "Producto actualizado correctamente", product: updatedProduct });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async delete(req, res) {
    AccessControl.handleRequest(req, res);
    try {
      const productId = req.params.id;
      const deleted = await productService.deleteProduct(productId);
      if (!deleted) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
