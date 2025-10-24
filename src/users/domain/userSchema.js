import z from "zod";

// ✅ Esquema principal de creación de usuario
export const userSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password_: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  email: z
    .string()
    .email("Debe ingresar un correo electrónico válido"),
  phone: z
    .string()
    .min(6, "El número de teléfono es obligatorio"),
  address: z
    .string()
    .min(5, "La dirección es obligatoria"),
  avatar: z
    .string()
    .url("El avatar debe ser una URL válida")
    .optional(),
});

// ✅ Esquema parcial para actualizaciones
export const userSchemaUpdate = userSchema.partial();

// ✅ Funciones de validación seguras
export const validateUser = (user) => userSchema.safeParse(user);
export const validateUserUpdate = (user) => userSchemaUpdate.safeParse(user);
