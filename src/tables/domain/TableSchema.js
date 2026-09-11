import { z } from "zod";

export const tableSchema = z.object({

  number: z
    .number()
    .int("El número de mesa debe ser entero")
    .positive("El número de mesa debe ser mayor a cero"),

  shape: z.enum(
    ["round", "square"],
    {
      errorMap: () => ({
        message: "La forma debe ser round o square"
      })
    }
  ),

  capacity: z
    .number()
    .int("La capacidad debe ser un número entero")
    .positive("La capacidad debe ser mayor a cero")

});


export const tableSchemaUpdate =
  tableSchema.partial();


export const validateTable =
  (table) => tableSchema.safeParse(table);


export const validateTableUpdate =
  (table) => tableSchemaUpdate.safeParse(table);