// src/modules/products/controller/ProductController.js
import cloudinary from "../../../shared/config/cloudinary.js";
import { uploadToCloudinary } from "../../../shared/middleware/uploadImage.js";
import {
  validateProduct,
  validateProductUpdate,
} from "../../domain/productSchema.js";

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
      res.status(500).json({
        message: "Error interno del servidor",
        details: error.message,
      });
    }
  };

  getById = async (req, res) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });

      res
        .status(200)
        .json({ product, message: "Producto encontrado correctamente 👌" });
    } catch (error) {
      console.error("❌ Error en getById:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        details: error.message,
      });
    }
  };

  create = async (req, res) => {
    try {
      const body = req.body;
      const file = req.file;
      const name = body.name;

      const { url, id } = await uploadToCloudinary({ file, name });
      const imageUrl = url;
      const cloudinaryId = id;
      console.log(cloudinaryId);
      const newBody = {
        name: body.name,
        price: Number(body.price),
        category: body.category,
        stock: Number(body.stock),
        imageUrl: imageUrl,
        description: body.description,
        available: body.available === "true" ? true : false,
        cloudinaryId,
      };

      const validatedProduct = validateProduct(newBody);

      if (validatedProduct.success) {
        const newProduct = await this.productService.createProduct(
          validatedProduct.data
        );
        return res.status(201).json({
          product: newProduct,
          message: "Producto Creado Exitosamente!",
        });
      } else {
        console.log(validatedProduct);
        return res.status(404).send("Datos invalidos!");
      }
    } catch (err) {
      console.error("Error al crear producto:", err);
      return res.status(500).json({ error: "Error al crear producto" });
    }
  };

  update = async (req, res) => {
    try {
      if (typeof req.body.available === "string") {
        req.body.available = req.body.available === "true";
      }

      const product = await this.productService.getProductById(req.params.id);
      let newProduct;
      const body = req.body;

      if (product) {
        if (req.file) {
          if (product.cloudinaryId) {
            await cloudinary.uploader.destroy(product.cloudinaryId);
          }
          const { url, id } = await uploadToCloudinary({
            file: req.file,
            name: product.name,
          });
          newProduct = {
            name: body.name,
            price: Number(body.price),
            category: body.category,
            stock: Number(body.stock),
            imageUrl: url,
            description: body.description,
            available: body.available === "true" ? true : false,
            cloudinaryId: id,
          };
        } else {
          newProduct = {
            name: body.name,
            price: Number(body.price),
            category: body.category,
            stock: Number(body.stock),
            description: body.description,
            available: body.available === "true" ? true : false,
          };
        }
        console.log(newProduct);

        const validation = validateProductUpdate(newProduct);
        console.log(validation);
        if (!validation.success) {
          return res.status(400).json({
            message: "Objeto no válido",
            errors: validation.error.errors,
          });
        }

        const updatedProduct = await this.productService.updateProduct(
          req.params.id,
          validation.data
        );
        if (!updatedProduct) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
          product: updatedProduct,
          message: "Producto actualizado correctamente 🤙",
        });
      } else {
        res.status(404).send("Producto No Encontrado!");
      }
    } catch (error) {
      console.error("❌ Error en update:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        details: error.message,
      });
    }
  };

  delete = async (req, res) => {
    try {
      const product = await this.productService.getProductById(req.params.id);

      if (product) {
        if (product.cloudinaryId) {
          await cloudinary.uploader.destroy(product.cloudinaryId);
        }

        const deleted = await this.productService.deleteProduct(req.params.id);

        if (!deleted) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }

        res
          .status(200)
          .json({ message: "Producto Eliminado Correctamente 🧹" });
      } else {
        res.status(404).send("Producto No Encontrado!");
      }
    } catch (error) {
      console.error("❌ Error en delete:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        details: error.message,
      });
    }
  };
}
