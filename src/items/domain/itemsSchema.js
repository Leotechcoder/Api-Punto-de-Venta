import z from "zod";

/**
 * 🧱 Esquema base para un ítem (desde el FRONTEND, en camelCase)
 */
export const schemaItem = z.object({
  orderId: z.string().optional(), // lo maneja el backend normalmente
  productId: z.string().optional(),
  productName: z.string().optional(),
  description: z.string().optional(),
  unitPrice: z.number().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional(),
});

/**
 * 🧩 Validación de ítem completo (por ejemplo, al crear una orden)
 */
export const validateItem = (item) => {
  return schemaItem.refine(
    (data) => data.productId && data.unitPrice && data.quantity,
    { message: "Faltan campos obligatorios: productId, unitPrice y quantity" }
  ).safeParse(item);
};

/**
 * 🔧 Validación de ítem parcial (PATCH o actualizaciones)
 */
export const validatePartialItem = (item) => {
  return schemaItem.partial().safeParse(item);
};

/**
 * 📦 Validación de un array de ítems
 */
export const validateItemArray = (items) => {
  if (!Array.isArray(items)) {
    return { success: false, error: [{ message: "Debe ser un array" }] };
  }

  for (let i = 0; i < items.length; i++) {
    const validation = schemaItem.safeParse(items[i]);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
          index: i,
        })),
      };
    }
  }

  return { success: true, data: items };
};
