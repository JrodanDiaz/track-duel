import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../api/auth";
import { savePlaylist, getSavedPlaylists } from "../api/playlist";
import { getSpotifyToken } from "../api/spotify";
import useAppDispatch from "../hooks/useAppDispatch";
import useUser from "../hooks/useUser";
import { test_uris } from "../playlists";
import { useGetPlaylistEssentialsQuery } from "../store/api/playlistsApiSlice";
import { updatePlaylist } from "../store/state/playlistState";
import { updateTracks } from "../store/state/trackSelectionState";
import { Track } from "../types";
import { getRandomSongSelection } from "../utils";
import Player from "./common/Player";
import TrackSearchResult from "./common/TrackSearchResult";
import PlaylistContainer from "./common/PlaylistContainer";

/*
 on mount, get first x playlists from this user id.
 if press load more, use a state variable and add it to the offset
 */

const NO_MORE_PLAYLISTS_ERRMSG = "User Has No More Saved Playlists";

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
    const [savePlaylistSuccess, setSavePlaylistSuccess] = useState<boolean | undefined>(
        undefined
    );
    const [getSavedPlaylistsError, setSavedPlaylistsError] = useState("");
    const [savedPlaylists, setSavedPlaylists] = useState<string[]>([]);
    const [offset, setOffset] = useState(savedPlaylists.length);
    const [reloadPlaylistsSignal, updateReloadPlaylistsSignal] = useState(1);

    const {
        data: playlistData,
        isLoading,
        isSuccess,
    } = useGetPlaylistEssentialsQuery(confirmedPlaylistUri ?? skipToken);

    useEffect(() => {
        if (!isLoggedIn(user)) {
            navigate("/");
        }
    }, [user]);

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
            if (success) {
                setSavedPlaylistsError("");
                setSavePlaylistSuccess(undefined);
                setOffset(savedPlaylists.length);
                updateReloadPlaylistsSignal((signal) => signal + 1);
            }
            setPlaylistUrl("");
        });
    };

    const incrementOffset = () => {
        setOffset(savedPlaylists.length);
    };

    const spotifyApi = new SpotifyWebApi({
        clientId: import.meta.env.SPOTIFY_CLIENT_ID,
    });
    spotifyApi.setAccessToken(getSpotifyToken());

    function chooseTrack(track: Track) {
        setPlayingTrack(track);
        setSearch("");
    }

    useEffect(() => {
        getSavedPlaylists({ offset: offset }).then(
            ([noSavedPlaylists, playlists, errorMessage]) => {
                if (noSavedPlaylists) {
                    return;
                } else if (errorMessage) {
                    setSavedPlaylistsError(errorMessage);
                } else if (playlists === undefined) {
                    setSavedPlaylistsError("Internal Server Error");
                } else {
                    //this dumb hack ensures that the array has no duplicate elements thanks to React Strict Mode
                    const updatedPlaylists =
                        savedPlaylists.length === 0
                            ? playlists
                            : [...new Set([...savedPlaylists, ...playlists])];
                    setSavedPlaylists(updatedPlaylists);
                }
            }
        );
    }, [offset, reloadPlaylistsSignal]);

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

    let content: React.ReactNode;

    content = (
        <div className=" w-full flex flex-col gap-10 justify-center items-center">
            <h1 className=" text-6xl text-offwhite text-pretty text-center">
                Choose your Track, {user.username}
            </h1>
            <h1 className="text-3xl text-offwhite font-protest"></h1>
            <PlaylistContainer
                className="flex flex-wrap p-2"
                uris={test_uris}
                setPlaylistUri={setSelectedPlaylistUri}
            />
            {getSavedPlaylistsError && (
                <p className="text-xl text-red-700">{getSavedPlaylistsError}</p>
            )}
            <Link to="/testing" className="text-xl text-blue-500">
                To /testing
            </Link>
            {savedPlaylists.length > 0 && (
                <>
                    <PlaylistContainer
                        className="flex flex-wrap p-2"
                        uris={savedPlaylists}
                        setPlaylistUri={setSelectedPlaylistUri}
                    />
                    <button
                        onClick={incrementOffset}
                        className={`border-2 border-lilac text-lilac bg-transparent rounded-lg px-5 py-2 disabled:border-gray-500 disabled:text-gray-500`}
                        disabled={getSavedPlaylistsError === NO_MORE_PLAYLISTS_ERRMSG}
                    >
                        Load More Playlists
                    </button>
                </>
            )}
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
            {savePlaylistSuccess === false && (
                <p className="text-xl text-red-700">Error While Saving Playlist</p>
            )}
            <form onSubmit={handlePlaylistSubmit} className="p-5">
                <input
                    type="text"
                    placeholder="Enter Playlist URL"
                    className=" focus:outline-none px-5 py-3 bg-transparent border-2 border-lilac text-offwhite"
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
