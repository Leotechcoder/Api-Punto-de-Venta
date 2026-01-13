// src/modules/products/domain/productSchema.js
import z from "zod";

const imageSchema = z.object({
  id: z.number().optional(),
  url: z.string().url(),
  cloudinaryId: z.string(),
  position: z.number(),
});

const productSchema = z.object({
  name_: z.string().min(1, "El nombre es obligatorio"),
  price: z.number().nonnegative("El precio no puede ser negativo"),
  category: z.string().min(1, "La categoría es obligatoria"),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  description: z.string().optional(),
  available: z.boolean().default(true),
  images: z.array(imageSchema).optional(), // ← nuevo
});

const productSchemaUpdate = productSchema.partial();

export const validateProduct = (product) => productSchema.safeParse(product);
export const validateProductUpdate = (product) =>
  productSchemaUpdate.safeParse(product);
