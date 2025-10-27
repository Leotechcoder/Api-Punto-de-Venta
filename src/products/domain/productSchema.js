// src/modules/products/domain/productSchema.js
import z from "zod";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  price: z.number().nonnegative("El precio no puede ser negativo"),
  category: z.string().min(1, "La categoría es obligatoria"),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  imageUrl: z.string().url("Debe ser una URL válida").optional(),
  available: z.boolean().default(true),
  description: z.string().optional(),
});

const productSchemaUpdate = productSchema.partial();

export const validateProduct = (product) => productSchema.safeParse(product);
export const validateProductUpdate = (product) => productSchemaUpdate.safeParse(product);
