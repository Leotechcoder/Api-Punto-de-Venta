// src/modules/orders/domain/OrderSchema.js
import z from "zod";

// ✅ Subschema para items dentro de una orden
const itemSchema = z.object({
  product_id: z.string().min(3, "El ID del producto es obligatorio"),
  product_name: z.string().min(2, "El nombre del producto es obligatorio"),
  description: z.string().optional(),
  unit_price: z.number().nonnegative("El precio unitario no puede ser negativo"),
  quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
});

// ✅ Subschema para el método de pago
const paymentSchema = z.object({
  efectivo: z.string().optional(),
  credito: z.string().optional(),
  debito: z.string().optional(),
}).refine(
  (p) => p.efectivo || p.credito || p.debito,
  "Debe especificarse al menos un método de pago"
);

// ✅ Schema principal de creación de orden
export const orderSchema = z.object({
  userId: z.string().min(3, "El ID del usuario es obligatorio"),
  userName: z.string().min(2, "El nombre del usuario es obligatorio"),
  totalAmount: z.number().nonnegative("El monto total no puede ser negativo"),
  status: z.enum(["pending", "paid", "cancelled", "completed"]).default("pending"),
  paymentInfo: paymentSchema,
  deliveryType: z.string().min(3, "El tipo de entrega es obligatorio"),
  items: z.array(itemSchema).min(1, "Debe haber al menos un ítem en la orden"),
});

// ✅ Schema parcial para updates
export const orderSchemaUpdate = orderSchema.partial();

// ✅ Funciones de validación seguras
export const validateOrder = (order) => orderSchema.safeParse(order);
export const validateOrderUpdate = (order) => orderSchemaUpdate.safeParse(order);
