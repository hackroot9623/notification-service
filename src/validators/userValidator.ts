import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email(),
  pass: z.string(),
});
