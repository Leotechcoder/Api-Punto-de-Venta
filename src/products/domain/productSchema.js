import z from "zod"

const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  category: z.string(),
  stock: z.number(),
  image_url: z.string().optional(),
  available: z.boolean(),
  description: z.string().optional(),
})

const productSchemaUpdate = productSchema.partial()

export const validateProduct = (product) => {
  return productSchema.safeParse(product)
}

export const validateProductUpdate = (product) => {
  return productSchemaUpdate.safeParse(product)
}

