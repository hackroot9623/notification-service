import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" })
    .optional(),
  email: z.string().email({ message: "El correo electrónico debe ser válido" }),
  pass: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(20, { message: "La contraseña no puede exceder los 20 caracteres" }),
});
