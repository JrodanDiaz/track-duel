import { Request, Response } from "express";
import { getToken, respondWithError } from "../auth/utils";
import jwt from "jsonwebtoken"
import { createPlaylistSchema, jwtPayload } from "../schemas";
import { getPlaylists, savePlaylist } from "../data/queries";

export const createPlaylistHandler = async (req: Request, res: Response) => {
    const {body} = req
    const parsedBody = createPlaylistSchema.safeParse(body)
    if(!parsedBody.success) {
        respondWithError(res, 400, "Internal Server Error (parsing request)")
        return
    }

 const token = getToken(req)
    if(!token) {
        respondWithError(res, 400, "Auth Token not set.")
        return
    }

    const jwtKey = process.env.JWT_SECRET
    if(!jwtKey) {
        respondWithError(res, 400, "Internal Server Error (env)")
        return
    }
    
    let userId: number | undefined;

    //copied straight from implicit login handler
    jwt.verify(token, jwtKey, (err, decoded) => {
        if(err) {
            respondWithError(res, 400, err.message)
            return
        }
        if(!decoded) {
           respondWithError(res, 400, "Interal Server Error (no decoded JWT")
           return
        }

        const decodedJwt = jwtPayload.safeParse(decoded)
        if(!decodedJwt.success) {
            console.log(`Error zod parsing jwt decoded: ${decodedJwt.error}`);
            respondWithError(res, 400, "Internal Server Error (decoding JWT)")
            return
        }
        userId = decodedJwt.data.id
    })
    
    if(userId === undefined) {
        respondWithError(res, 400, "User ID undefined")
        return
    }

    const success = await savePlaylist(userId, parsedBody.data.playlistUrl)
    if(!success) {
        respondWithError(res, 400, "Error while saving playlist")
        return
    }
    console.log(`Successfully saved playlist for user ${userId}`);
    
    res.status(200).json({success: true})
}

export const revealPlaylistsHandler = async (req: Request, res: Response) => {
    const playlists = await getPlaylists()
    if(!playlists) {
        res.status(404).send("No playlists or error getting playlists")
        return
    }
    for(const playlist of playlists) {
        console.log(JSON.stringify(playlist))
    }
    res.status(200).send("Enjoy vro")
    
}