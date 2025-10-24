// src/modules/orders/domain/OrderSchema.js
import z from "zod";

// ✅ Subschema para items dentro de una orden
const itemSchema = z.object({
  id: z.string().optional(), // ya que el frontend lo envía (It-2410202-425)
  productId: z.string().min(3, "El ID del producto es obligatorio"),
  productName: z.string().min(2, "El nombre del producto es obligatorio"),
  description: z.string().optional(),
  unitPrice: z.union([
    z.string().refine(val => !isNaN(parseFloat(val)), "Debe ser un número válido"),
    z.number().nonnegative("El precio unitario no puede ser negativo")
  ]),
  quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
});

// ✅ Subschema para los montos de cada método
const paymentAmountsSchema = z.object({
  efectivo: z.string().optional(),
  credito: z.string().optional(),
  debito: z.string().optional(),
}).refine(
  (p) => p.efectivo || p.credito || p.debito,
  "Debe especificarse al menos un monto para un método de pago"
);

// ✅ Subschema principal de paymentInfo
const paymentInfoSchema = z.object({
  methods: z.array(z.enum(["efectivo", "credito", "debito"])).nonempty("Debe incluir al menos un método de pago"),
  amounts: paymentAmountsSchema
});

// ✅ Schema principal de creación de orden
export const orderSchema = z.object({
  userId: z.string().min(3, "El ID del usuario es obligatorio"),
  userName: z.string().min(2, "El nombre del usuario es obligatorio"),
  status: z.string().min(2, "El estado de la orden es obligatorio"),
  totalAmount: z.union([
    z.string().refine(val => !isNaN(parseFloat(val)), "Debe ser un número válido"),
    z.number().nonnegative("El monto total no puede ser negativo")
  ]),
  paymentInfo: paymentInfoSchema,
  deliveryType: z.string().min(3, "El tipo de entrega es obligatorio"),
  items: z.array(itemSchema).min(1, "Debe haber al menos un ítem en la orden"),
});

// ✅ Schema parcial para updates
export const orderSchemaUpdate = orderSchema.partial();

// ✅ Funciones de validación seguras
export const validateOrder = (order) => orderSchema.safeParse(order);
export const validateOrderUpdate = (order) => orderSchemaUpdate.safeParse(order);
