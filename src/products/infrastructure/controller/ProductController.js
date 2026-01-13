import cloudinary from "../../../shared/config/cloudinary.js";
import { uploadToCloudinary } from "../../../shared/middleware/uploadImage.js";
import {
  validateProduct,
  validateProductUpdate,
} from "../../domain/productSchema.js";

import { getIO } from "../../../config/socket.js";

export class ProductController {
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

  create = async (req, res) => {
    try {
      const body = req.body;
      const files = req.files || [];

      const productData = {
        name: body.name,
        price: Number(body.price),
        category: body.category,
        stock: Number(body.stock),
        description: body.description,
        available: body.available === "true",
      };

      const validation = validateProduct(productData);
      if (!validation.success) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      let uploadedImages = [];

      for (const file of files) {
        const result = await uploadToCloudinary({ file, name: body.name });
        uploadedImages.push({
          url: result.url,
          cloudinaryId: result.id,
        });
      }

      const newProduct = await this.productService.createProduct(
        validation.data,
        uploadedImages
      );
      
      res.status(201).json({
        product: newProduct,
        message: "Producto creado exitosamente!",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  update = async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
      console.log('body:', body);

      if (typeof body.available === "string") {
        body.available = body.available === "true";
      }

      const updatedData = {
        name_: body.name,
        price: Number(body.price),
        category: body.category,
        stock: Number(body.stock),
        description: body.description,
        available: body.available,
      };
      
      const validation = validateProductUpdate(updatedData);
      console.log('validation:', validation);
      if (!validation.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: validation.error,
        });
      }

      const files = req.files || [];
      const newImages = [];

      for (const file of files) {
        const result = await uploadToCloudinary({
          file,
          name: body.name,
        });
        newImages.push({
          url: result.url,
          cloudinaryId: result.id,
        });
      }

      const imagesToDelete = JSON.parse(body.imagesToDelete || "[]");
      const newOrder = JSON.parse(body.newOrder || "[]");

      const updated = await this.productService.updateProduct(
        id,
        validation.data,
        newImages,
        imagesToDelete,
        newOrder
      );

      getIO().emit("product:updated", updated);

      

      res.status(200).json({
        product: updated,
        message: "Producto actualizado correctamente",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params.id;

      const deleted = await this.productService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      res.status(200).json({
        message: "Producto eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
