import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import useUser from "../hooks/useUser";
import useAppDispatch from "../hooks/useAppDispatch";
import Player from "./Player";
import PlaylistsContainer from "./PlaylistsContainer";
import TrackSearchResult from "./TrackSearchResult";
import { Track } from "../types";
import { test_uris } from "../playlists";
import { isLoggedIn } from "../api/auth";
import { getSpotifyToken } from "../api/spotify";
import { useGetPlaylistEssentialsQuery } from "../store/api/playlistsApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { updatePlaylist } from "../store/state/playlistState";
import { useNavigate } from "react-router-dom";
import { getRandomSongSelection } from "../utils";
import { updateTracks } from "../store/state/trackSelectionState";
import { getSavedPlaylists, savePlaylist } from "../api/playlist";

/*
 on mount, get first x playlists from this user id.
 if press load more, use a state variable and add it to the offset
 */

export default function Play() {
    const user = useUser();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [search, setSearch] = useState<string>("");
    const [play, setPlay] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [playingTrack, setPlayingTrack] = useState<Track>();
    const [selectedPlaylistUri, setSelectedPlaylistUri] = useState<string | undefined>();
    const [confirmedPlaylistUri, setConfirmedPlaylistUri] = useState<
        string | undefined
    >();
    const [playlistUrl, setPlaylistUrl] = useState("");
    const [savePlaylistSuccess, setSavePlaylistSuccess] = useState(false);
    const [getSavedPlaylistsError, setSavedPlaylistsError] = useState("");
    const [savedPlaylists, setSavedPlaylists] = useState<string[]>([]);
    const [offset, setOffset] = useState(0);

    console.log(`savedPlaylists = ${savedPlaylists}, offset = ${offset}`);

    const {
        data: playlistData,
        isLoading,
        isSuccess,
    } = useGetPlaylistEssentialsQuery(confirmedPlaylistUri ?? skipToken);

    // if (!isLoggedIn(user)) {
    //     window.location.href = "/";
    //     return;
    // }

    useEffect(() => {
        if (!isLoggedIn(user)) {
            navigate("/");
        }
    }, [user]);

    // if (isSuccess) {
    //     dispatch(updatePlaylist(playlistData));
    //     const randomSelection = getRandomSongSelection(playlistData);
    //     dispatch(updateTracks(randomSelection));
    //     navigate("/duel");
    // }

    //MR. GPT
    useEffect(() => {
        if (isSuccess) {
            dispatch(updatePlaylist(playlistData));
            const randomSelection = getRandomSongSelection(playlistData);
            dispatch(updateTracks(randomSelection));
            navigate("/duel");
        }
    }, [isSuccess, playlistData, dispatch, navigate]);

    const handlePlaylistSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        savePlaylist(playlistUrl).then((success) => {
            setSavePlaylistSuccess(success);
        });
    };

    const incrementOffset = () => {
        setOffset((prev) => prev + 3);
    };

    const spotifyApi = new SpotifyWebApi({
        clientId: import.meta.env.SPOTIFY_CLIENT_ID,
    });
    spotifyApi.setAccessToken(getSpotifyToken());

    function chooseTrack(track: Track) {
        setPlayingTrack(track);
        setSearch("");
    }

    // might want to introduce a signal that prevents further http requests if user has no more saved playlists
    useEffect(() => {
        getSavedPlaylists(offset).then(([playlists, errorMessage]) => {
            if (errorMessage) {
                setSavedPlaylistsError(errorMessage);
            } else if (playlists === undefined) {
                setSavedPlaylistsError("Internal Server Error");
            } else {
                setSavedPlaylists(playlists);
                // setSavedPlaylists((prev) =>
                //     prev.length === 0 ? playlists : [...prev, ...playlists]
                // );
            }
        });
    }, [offset]);

    useEffect(() => {
        if (!search) return setSearchResults([]);
        const timerId = setTimeout(() => {
            spotifyApi.searchTracks(search, { limit: 5 }).then((res) => {
                if (!res?.body?.tracks) return;
                setSearchResults(
                    res.body.tracks.items.map((track) => {
                        return {
                            cover: track.album.images[0].url,
                            artist: track.artists[0].name,
                            title: track.name,
                            uri: track.uri,
                        };
                    })
                );
            });
        }, 500);
        return () => clearTimeout(timerId);
    }, [search]);

    // if (!isLoggedIn(user)) {
    //     window.location.href = "/";
    //     return null;
    // }

    // if (isSuccess) {
    //     dispatch(updatePlaylist(playlistData));
    //     const randomSelection = getRandomSongSelection(playlistData);
    //     dispatch(updateTracks(randomSelection));
    //     navigate("/duel");
    // }

    let content: React.ReactNode;

    content = (
        <div className=" w-full flex flex-col gap-10 justify-center items-center">
            <h1 className=" text-6xl text-offwhite text-pretty text-center">
                Choose your Track, {user.username}
            </h1>
            <h1 className="text-3xl text-offwhite font-protest"></h1>
            <PlaylistsContainer
                className="flex flex-wrap p-2"
                uris={test_uris}
                setPlaylistUri={setSelectedPlaylistUri}
            />
            {getSavedPlaylistsError && (
                <p className="text-xl text-red-700">{getSavedPlaylistsError}</p>
            )}
            {savedPlaylists.length > 0 && (
                <PlaylistsContainer
                    className="flex flex-wrap p-2"
                    uris={savedPlaylists}
                    setPlaylistUri={setSelectedPlaylistUri}
                />
            )}
            <button
                onClick={incrementOffset}
                className="border-2 border-lilac text-lilac bg-transparent rounded-lg px-5 py-2"
            >
                Increase Offset: {offset}
            </button>
            {selectedPlaylistUri && (
                <>
                    <button
                        onClick={() => setConfirmedPlaylistUri(selectedPlaylistUri)}
                        className=" px-3 py-5 border-2 border-main-green text-main-green font-bold hover:text-main-black hover:bg-main-green"
                    >
                        {isLoading ? "Loading" : "Lock In Playlist"}
                    </button>
                </>
            )}
            {playlistData && (
                <h1 className="text-xl text-lilac">
                    Locked in playlist: {playlistData.name}
                </h1>
            )}
            {savePlaylistSuccess ? (
                <p className="text-xl text-green-600">SUCCESS</p>
            ) : (
                <p className="text-xl text-red-600">FAILURE</p>
            )}
            <form
                onSubmit={handlePlaylistSubmit}
                className="border-2 border-gray-600 rounded-lg p-5"
            >
                <input
                    type="text"
                    placeholder="Enter Playlist URL"
                    className=" focus:outline-none px-5 py-3"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                />
                <button
                    className="border-2 border-lilac rounded-xl px-5 py-3 bg-transparent text-lilac"
                    type="submit"
                >
                    Save Playlist
                </button>
            </form>
            <input
                type="text"
                placeholder="Enter track..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className=" bg-main-black border-[1px] text-offwhite text-xl border-offwhite px-3 py-2 rounded-sm focus:outline-none"
            />

            {playingTrack && !search && (
                <>
                    <h1 className=" text-3xl text-orangey text-pretty">
                        Current Track: {playingTrack.title} by {playingTrack.artist}
                    </h1>
                    {playingTrack.cover && (
                        <img src={playingTrack.cover} height={200} width={200} />
                    )}
                </>
            )}
            <div className={`${!playingTrack || search ? "hidden" : ""}`}>
                <Player
                    accessToken={getSpotifyToken()}
                    trackUri={playingTrack?.uri}
                    play={play}
                    setPlay={setPlay}
                />
            </div>
            <div className="flex flex-wrap justify-evenly w-3/5">
                {searchResults.map((track, i) => (
                    <TrackSearchResult
                        track={track}
                        key={`${i}-${track.title}`}
                        chooseTrack={chooseTrack}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className=" w-screen h-screen bg-main-black py-4 md:py-12 overflow-y-auto">
            {content}
        </div>
    );
}
