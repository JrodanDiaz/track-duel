import { Request, Response } from "express";
import { getToken, respondWithError } from "../auth/utils";
import jwt from "jsonwebtoken";
import { createPlaylistSchema, jwtPayload } from "../schemas";
import { getPlaylists, savePlaylist } from "../data/queries";

const parsePlaylistUrl = (url: string): [success: boolean, uri: string] => {
  const match = url.match(/^https:\/\/open\.spotify\.com\/playlist\/(.+)$/);

  if (match) {
    const playlistUri = match[1];
    return [true, playlistUri]
  } 
  return [false, ""]
};

export const createPlaylistHandler = async (req: Request, res: Response) => {
  const { body } = req;
  const parsedBody = createPlaylistSchema.safeParse(body);
  if (!parsedBody.success) {
    respondWithError(res, 400, "Internal Server Error (parsing request)");
    return;
  }

  const [parseSuccess, uri] = parsePlaylistUrl(parsedBody.data.playlistUrl);
  if (!parseSuccess || !uri) {
    respondWithError(res, 400, "Invalid Url");
    return
  }

  const token = getToken(req);
  if (!token) {
    respondWithError(res, 401, "Auth Token not set.");
    return;
  }

  const jwtKey = process.env.JWT_SECRET;
  if (!jwtKey) {
    respondWithError(res, 500, "Internal Server Error (env)");
    return;
  }

  let userId: number | undefined;

  //copied straight from implicit login handler
  jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      respondWithError(res, 500, err.message);
      return;
    }
    if (!decoded) {
      respondWithError(res, 500, "Interal Server Error (no decoded JWT");
      return;
    }

    const decodedJwt = jwtPayload.safeParse(decoded);
    if (!decodedJwt.success) {
      console.log(`Error zod parsing jwt decoded: ${decodedJwt.error}`);
      respondWithError(res, 500, "Internal Server Error (decoding JWT)");
      return;
    }
    userId = decodedJwt.data.id;
  });

  if (userId === undefined) {
    respondWithError(res, 401, "User ID undefined");
    return;
  }

  const success = await savePlaylist(userId, uri);
  if (!success) {
    respondWithError(res, 500, "Error while saving playlist");
    return;
  }
  console.log(`Successfully saved playlist for user ${userId}`);

  res.status(200).json({ success: true });
};

export const revealPlaylistsHandler = async (req: Request, res: Response) => {
  const playlists = await getPlaylists();
  if (!playlists) {
    res.status(404).send("No playlists or error getting playlists");
    return;
  }
  for (const playlist of playlists) {
    console.log(JSON.stringify(playlist));
  }
  res.status(200).send("Enjoy vro");
};
