import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(1, "Login kiriting"),
  password: z.string().min(1, "Parol kiriting"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
