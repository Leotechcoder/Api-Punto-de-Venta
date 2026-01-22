import z from "zod";

// =========================
// 📦 Schema para items de la orden
// =========================
const itemSchema = z.object({
  id: z.string().min(1, "El ID del item es obligatorio"),
  productId: z.string().min(1, "El ID del producto es obligatorio"),
  productName: z.string().min(1, "El nombre del producto es obligatorio"),
  description: z.string().optional(),
  unitPrice: z.union([
    z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "El precio unitario debe ser un número válido y no negativo"),
    z.number().nonnegative("El precio unitario no puede ser negativo")
  ]),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1")
});

// =========================
// 💰 Subschema: Montos de pago
// =========================
const paymentAmountsSchema = z.object({
  efectivo: z.string().optional(),
  credito: z.string().optional(),
  debito: z.string().optional(),
});

// ✅ Subschema principal de paymentInfo (acepta vacío)
const paymentInfoSchema = z.object({
  methods: z.array(z.enum(["efectivo", "credito", "debito"])).optional(),
  amounts: paymentAmountsSchema.optional(),
})
.refine(
  (p) => {
    // Si no existe o está completamente vacío → OK
    if (
      !p ||
      (!p.methods && !p.amounts) ||
      (Array.isArray(p.methods) && p.methods.length === 0 &&
       p.amounts && Object.values(p.amounts).every(v => v === "" || v === undefined))
    ) {
      return true;
    }

    // Si tiene algo, debe tener al menos un método o monto válido
    const hasMethods = Array.isArray(p.methods) && p.methods.length > 0;
    const hasAmounts =
      p.amounts &&
      Object.values(p.amounts).some(v => v !== undefined && v !== "");

    return hasMethods || hasAmounts;
  },
  { message: "Debe especificarse al menos un método o monto si se envía paymentInfo" }
)
.optional();

// =========================
// 🧾 Schema principal de la orden
// =========================
export const orderSchema = z.object({
  userId: z.string().min(3, "El ID del usuario es obligatorio"),
  userName: z.string().min(2, "El nombre del usuario es obligatorio"),
  status: z.string().min(2, "El estado de la orden es obligatorio"),
  items: z.array(itemSchema).min(1, "La orden debe tener al menos un item"),
  totalAmount: z.union([
    z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Debe ser un número válido y no negativo"),
    z.number().nonnegative("El monto total no puede ser negativo")
  ]),
  paymentInfo: paymentInfoSchema,
  deliveryType: z.string().min(3, "El tipo de entrega es obligatorio"),
  deliveryAddress: z.string(),
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