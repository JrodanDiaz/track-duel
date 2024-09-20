import SpotifyWebApi from "spotify-web-api-node";
import { Track } from "../types";
import { useEffect, useState } from "react";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";

export default function Play() {
    const spotifyToken = localStorage.getItem("spotify-token")
    if(!spotifyToken) {
        console.log("spotifyToken not set");
        window.location.href = "/"
        return
    }

    const [search, setSearch] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [playingTrack, setPlayingTrack] = useState<Track>();

    const spotifyApi = new SpotifyWebApi({
        clientId: import.meta.env.SPOTIFY_CLIENT_ID,
    });
    spotifyApi.setAccessToken(spotifyToken)

    function chooseTrack(track: Track) {
        setPlayingTrack(track);
        setSearch("");
    }

    useEffect(() => {
        if (!search) return setSearchResults([])
        spotifyApi.searchTracks(search, {limit: 5})
            .then((res => {
                if(!res?.body?.tracks) return;
                setSearchResults(
                    res.body.tracks.items.map((track) => {
                        return {
                            artist: track.artists[0].name,
                            title: track.name,
                            uri: track.uri
                        }
                    })
                )
            }))
    }, [search])

    return (
        <>
        <div className=" border-black border-2 p-4">
            <h1>Lets play some music I think</h1>
            <p>Token: {spotifyToken}</p>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div>
                {playingTrack && (
                <Player accessToken={spotifyToken} trackUri={playingTrack?.uri} />
                )}
            </div>
            {searchResults.map((track) => (
                <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
                />
            ))}

        </div>
        </>
    )
}