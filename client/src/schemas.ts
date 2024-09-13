import z from "zod";

export const userCredentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const tokenResponseSchema = z.object({
  auth_token: z.string()
})
