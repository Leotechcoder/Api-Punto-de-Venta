
import z from "zod";

// Esquema de validación para un ítem
export const schemaItems = z.object({
  user_id: z.string(),
  user_name: z.string(),
  items: z.array(z.object({
    product_id: z.string(),
    product_name: z.string(),
    description: z.string(),
    unit_price: z.string(),
    quantity: z.string()
  })),
  total_amount: z.number(),
  paymentInfo: z.object({
    methods: z.array(z.string()),
    amounts: z.object({
      efectivo: z.string(),
      credito: z.string(),
      debito: z.string()
    }),
  }),
  deliveryType: z.string()
});

// Validación de un ítem completo
export const validateItems = (items) => {
  return schemaItems.safeParse(items);
};

// Validación de un ítem parcial (para actualizaciones)
export const validatePartialItems = (items) => {
  return schemaItems.partial().safeParse(items);
};

// Validación de un array de ítems
export const validateArray = (items) => {
  for (let i = 0; i < items.length; i++) {
    const validation = schemaItems.safeParse(items[i]);

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

  return {
    success: true,
    data: items,
  };
};