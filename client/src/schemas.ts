import z from "zod";

export const userCredentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const serverErrorSchema = z.object({
  errorMessage: z.string()
})

export const tokenResponseSchema = z.object({
  authToken: z.string()
}).or(serverErrorSchema)

export const implicitLoginSchema = z.object({
  authToken: z.string(),
  username: z.string(),
}).or(serverErrorSchema)

export const getSavedPlaylistsSchema = z.array(z.string()).or(serverErrorSchema)

export const socketResponseSchema = z.object({
  type: z.string()
}).passthrough()

export const generateRoomCodeSchema = z.object({
  roomCode: z.string()
})


