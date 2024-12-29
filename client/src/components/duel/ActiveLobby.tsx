import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "./Duel";
import Button from "../common/Button";
import { getSavedPlaylists } from "../../api/playlist";
import { test_uris } from "../../playlists";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPlaylistEssentialsQuery } from "../../store/api/playlistsApiSlice";
import useAppDispatch from "../../hooks/useAppDispatch";
import { updatePlaylist } from "../../store/state/playlistState";
import { getRandomPlaylistIndexes, getSongsFromIndexes } from "../../utils";
import { updateTracks } from "../../store/state/trackSelectionState";
import PlaylistSelection from "../common/PlaylistsSelection";
import PlayersContainer from "./PlayersContainer";
import LockedPlaylist from "./LockedPlaylist";

export default function ActiveLobby() {
    const socket = useContext(WebsocketContext);
    const dispatch = useAppDispatch();
    const [getSavedPlaylistsError, setSavedPlaylistsError] = useState("");
    const [savedPlaylists, setSavedPlaylists] = useState<string[]>([]);
    const [offset, setOffset] = useState(savedPlaylists.length);
    const [selectedPlaylistUri, setSelectedPlaylistUri] = useState<string | undefined>();
    const [confirmedPlaylistUri, setConfirmedPlaylistUri] = useState<
        string | undefined
    >();

    const {
        data: playlistData,
        isLoading,
        isSuccess,
    } = useGetPlaylistEssentialsQuery(confirmedPlaylistUri ?? skipToken);

    const handleLeaveRoom = () => {
        socket.leaveRoom();
    };

    const incrementOffset = () => {
        setOffset(savedPlaylists.length);
    };

    const handleLockInPlaylist = () => {
        if (!selectedPlaylistUri)
            throw new Error("Cannot Lock In On Undefined Playlist!");
        setConfirmedPlaylistUri(selectedPlaylistUri);
    };

    useEffect(() => {
        if (!socket.isHost) return;
        console.log(`Attempting to get playlists`);

        getSavedPlaylists({ offset: offset }).then(
            ([noSavedPlaylists, playlists, errorMessage]) => {
                if (noSavedPlaylists) {
                    return;
                } else if (errorMessage) {
                    setSavedPlaylistsError(errorMessage);
                } else if (playlists === undefined) {
                    setSavedPlaylistsError("Internal Server Error");
                } else {
                    //ensure array has no duplicate elements thanks to React Strict Mode
                    const updatedPlaylists =
                        savedPlaylists.length === 0
                            ? playlists
                            : [...new Set([...savedPlaylists, ...playlists])];
                    setSavedPlaylists(updatedPlaylists);
                }
            }
        );
    }, [offset, socket.isHost]);

    useEffect(() => {
        if (isSuccess && socket.isHost) {
            if (!confirmedPlaylistUri) {
                console.error("Error: Attempting to broadcast undefined playlist uri");
                return;
            }
            dispatch(updatePlaylist(playlistData));
            const playlistIndexes = getRandomPlaylistIndexes(
                playlistData.tracks.items.length
            );

            dispatch(updateTracks(getSongsFromIndexes(playlistIndexes, playlistData)));
            socket.broadcastPlaylistUri(confirmedPlaylistUri, playlistIndexes);
        }
    }, [isSuccess, playlistData]);

    useEffect(() => {
        if (!socket.isHost && isSuccess && socket.playlistIndexes) {
            dispatch(updatePlaylist(playlistData));
            dispatch(
                updateTracks(getSongsFromIndexes(socket.playlistIndexes, playlistData))
            );
        }
    }, [socket.isHost, isSuccess, socket.playlistIndexes]);

    //instead of this, we could just have socket.playlistUri be the working state variable.
    //Will probably be less responsive for the host though
    useEffect(() => {
        setConfirmedPlaylistUri(socket.playlistUri);
    }, [socket.playlistUri]);
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <Button
                    content="Leave Room"
                    className="text-2xl rounded-sm text-red-600 border-red-600 transition-colors hover:bg-red-600 hover:text-black"
                    onClick={handleLeaveRoom}
                />
                <div className="w-full h-screen overflow-hidden p-4 flex justify-between">
                    <div className="w-3/5 text-offwhite overflow-scroll">
                        {socket.isHost && (
                            <>
                                <PlaylistSelection
                                    className="flex flex-col overflow-scroll"
                                    uris={
                                        savedPlaylists.length > 0
                                            ? [...test_uris, ...savedPlaylists]
                                            : test_uris
                                    }
                                    setPlaylistUri={setSelectedPlaylistUri}
                                    selectedPlaylistUri={selectedPlaylistUri}
                                    fetchPlaylistSuccess={isSuccess}
                                    handleLockIn={handleLockInPlaylist}
                                />
                                <Button
                                    content={
                                        getSavedPlaylistsError
                                            ? getSavedPlaylistsError
                                            : "+  +  +  Load More Playlists  +  +  +"
                                    }
                                    className="h-[110px] w-full text-2xl font-kanit tracking-wide"
                                    onClick={() => incrementOffset()}
                                    disabled={getSavedPlaylistsError.length > 0}
                                />
                            </>
                        )}
                        {!socket.isHost && (
                            <>
                                <div className="flex flex-col gap-12 border-[1px] border-offwhite/60 min-h-screen overflow-y-hidden items-center">
                                    <div>
                                        <h1 className="text-5xl text-offwhite font-kanit">
                                            {confirmedPlaylistUri
                                                ? "Playlist Locked In"
                                                : "Waiting for Host to Lock In Playlist..."}
                                        </h1>
                                        {confirmedPlaylistUri && (
                                            <p className=" text-surface75 text-xl text-center">
                                                Waiting for host...
                                            </p>
                                        )}
                                    </div>
                                    {confirmedPlaylistUri ? (
                                        <LockedPlaylist
                                            uri={confirmedPlaylistUri}
                                            imageSize={300}
                                        />
                                    ) : (
                                        <img src="/payday-gang.gif" />
                                    )}
                                </div>
                            </>
                        )}
                        {isSuccess && socket.isHost && (
                            <Button
                                content="Start Duel"
                                className="text-2xl text-red-700 border-red-700"
                                onClick={() => socket.startDuel()}
                            />
                        )}
                    </div>
                    <div className="border-[1px] w-1/5 w-2/5 border-offwhite/60 text-offwhite">
                        <header className="text-2xl text-offwhite font-semibold font-kanit text-center">
                            Connected Gooners
                        </header>
                        <PlayersContainer players={socket.lobby} />
                    </div>
                </div>
            </div>
        </>
    );
}
