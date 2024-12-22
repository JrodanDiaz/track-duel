import { Request, Response } from "express";
import { getUserIdFromCookie, respondWithError } from "../auth/utils";
import { createPlaylistSchema } from "../schemas";
import { getPlaylists, getSavedPlaylists, savePlaylist } from "../data/queries";

const parsePlaylistUrl = (url: string): [success: boolean, uri: string] => {
    const match = url.match(/^https:\/\/open\.spotify\.com\/playlist\/(.+)$/);

    if (match) {
        const playlistUri = match[1];
        return [true, playlistUri];
    }
    return [false, ""];
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
        return;
    }

    const [authenticateSuccess, userId] = getUserIdFromCookie(req, res);
    if (!authenticateSuccess || userId === null) {
        return;
    }

    const success = await savePlaylist(userId, uri);
    if (!success) {
        respondWithError(res, 500, "Error while saving playlist");
        return;
    }
    console.log(`User ID ${userId} - Saved Playlist with URI ${uri}`);

    res.status(200).json({ success: true });
};

export const getSavedPlaylistsHandler = async (req: Request, res: Response) => {
    const [authSuccess, userId] = getUserIdFromCookie(req, res);
    const offset = req.query.offset;

    if (offset === undefined) {
        respondWithError(res, 400, "Invalid Request (No Offset Specified)");
        return;
    }

    if (!authSuccess || userId === null) {
        return;
    }

    const [userHasNoSavedPlaylists, savedPlaylists ] = await getSavedPlaylists(userId, parseInt(offset as string));
    if(userHasNoSavedPlaylists) {
        respondWithError(res, 404, "User Has No Saved Playlists")
        return
    }
    if (savedPlaylists === undefined) {
        respondWithError(res, 500, "Internal Server Error");
        return;
    }
    if (savedPlaylists.length === 0) {
        respondWithError(res, 400, "User Has No More Saved Playlists");
        return;
    }
    const playlistResponse = savedPlaylists.map((playlist) => playlist.playlist_url);
    res.status(200).json(playlistResponse);
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
