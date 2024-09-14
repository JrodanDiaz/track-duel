import z from "zod";

export const userCredentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const serverErrorSchema = z.object({
  errorMessage: z.string()
})

export const tokenResponseSchema = z.object({
  auth_token: z.string()
}).or(serverErrorSchema)

export const implicitLoginSchema = z.object({
  auth_token: z.string(),
  username: z.string(),
}).or(serverErrorSchema)

