
import z from "zod";

// Esquema de validación para un ítem
export const schemaItems = z.object({
  id: z.string().uuid(), // Asumiendo que el ID es un UUID
  order_id: z.string().uuid(), // Asumiendo que el order_id es un UUID
  product_id: z.string().uuid(), // Asumiendo que el product_id es un UUID
  product_name: z.string().min(1, "El nombre del producto es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  quantity: z.number().positive("La cantidad debe ser un número positivo"),
  unit_price: z.number().positive("El precio unitario debe ser un número positivo"),
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