import z from "zod"

const productSchema = z.object({
  name_: z.string(),
  description: z.string(),
  price: z.number(),
  image_url: z.string(),
  category: z.string(),
  stock: z.number(),
  available: z.boolean(),
  state: z.string(),
})

const productSchemaUpdate = productSchema.partial()

export const validateProduct = (product) => {
  return productSchema.safeParse(product)
}

export const validateProductUpdate = (product) => {
  return productSchemaUpdate.safeParse(product)
}

