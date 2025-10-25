import z from "zod";

// =========================
// 📦 Subschema: Items
// =========================
const itemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(3, "El ID del producto es obligatorio"),
  productName: z.string().min(2, "El nombre del producto es obligatorio"),
  description: z.string().optional(),
  unitPrice: z.union([
    z.string().refine(val => !isNaN(parseFloat(val)), "Debe ser un número válido"),
    z.number().nonnegative("El precio unitario no puede ser negativo")
  ]),
  quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
});

// =========================
// 💰 Subschema: Montos de pago
// =========================
const paymentAmountsSchema = z.object({
  efectivo: z.string().optional(),
  credito: z.string().optional(),
  debito: z.string().optional(),
});

// =========================
// 💳 Subschema: Payment Info (opcional)
// =========================
const paymentInfoSchema = z.object({
  methods: z.array(z.enum(["efectivo", "credito", "debito"])).optional(),
  amounts: paymentAmountsSchema.optional(),
})
  // ⚡ Valida solo si el objeto fue enviado
  .refine(
    (p) => {
      // Si no hay nada, no se valida
      if (!p || (!p.methods && !p.amounts)) return true;

      const hasMethods = Array.isArray(p.methods) && p.methods.length > 0;
      const hasAmounts =
        p.amounts &&
        Object.values(p.amounts).some(v => v !== undefined && v !== "");

      // Si se envía el objeto, debe tener al menos un método o un monto
      return hasMethods || hasAmounts;
    },
    { message: "Debe especificarse al menos un método o monto si se envía paymentInfo" }
  )
  .optional(); // 🔥 Esto permite que directamente no se envíe

// =========================
// 🧾 Schema principal de la orden
// =========================
export const orderSchema = z.object({
  userId: z.string().min(3, "El ID del usuario es obligatorio"),
  userName: z.string().min(2, "El nombre del usuario es obligatorio"),
  status: z.string().min(2, "El estado de la orden es obligatorio"),
  totalAmount: z.union([
    z.string().refine(val => !isNaN(parseFloat(val)), "Debe ser un número válido"),
    z.number().nonnegative("El monto total no puede ser negativo")
  ]),
  paymentInfo: paymentInfoSchema, // ✅ ahora opcional pero validado si se manda
  deliveryType: z.string().min(3, "El tipo de entrega es obligatorio"),
  items: z.array(itemSchema).min(1, "Debe haber al menos un ítem en la orden"),
});

// =========================
// ✏️ Schema parcial para updates
// =========================
export const orderSchemaUpdate = orderSchema.partial();

// =========================
// 🧩 Funciones de validación seguras
// =========================
export const validateOrder = (order) => orderSchema.safeParse(order);
export const validateOrderUpdate = (order) => orderSchemaUpdate.safeParse(order);
