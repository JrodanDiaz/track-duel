import { z } from "zod";

export const userCredentialsSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });

export const authCookiesSchema = z.object({
  auth_token: z.string().min(1),
})

export const spotifyTokenSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string(),
  expires_in: z.string().or(z.number()),
  refresh_token: z.string(),
  scope: z.string(),
});

export type SpotifyAuthRes = z.infer<typeof spotifyTokenSchema>
  