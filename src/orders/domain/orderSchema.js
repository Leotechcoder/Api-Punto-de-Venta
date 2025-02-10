import z from "zod"

const orderSchema = z.object({
  user_id: z.string(),
  user_name: z.string(),
  total_amount: z.number(),
  status: z.string(),
  items_id: z.string(),
})

const orderSchemaUpdate = orderSchema.partial()

export const validateOrder = (order) => {
  return orderSchema.safeParse(order)
}

export const validatePartialOrder = validateOrder

export const validateOrderUpdate = (order) => {
  return orderSchemaUpdate.safeParse(order)
}

