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
import Playlist from "../common/Playlist";
import PlaylistsContainer from "../common/PlaylistsContainer";
import PlayersContainer from "./PlayersContainer";

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
            // const randomSelection = getRandomSongSelection(playlistData);
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
                <header className="text-6xl text-offwhite my-4">
                    Room Code:{" "}
                    <span className="text-main-green text-6xl">{socket.roomCode}</span>
                </header>
                <Button
                    content="Leave Room"
                    className="text-2xl rounded-sm text-red-600 border-red-600 transition-colors hover:bg-red-600 hover:text-black"
                    onClick={handleLeaveRoom}
                />
                <div className="w-full h-screen overflow-hidden p-4 border-[1px] border-gray-600 flex justify-between">
                    <div className="border-[1px] w-3/5 border-blue-600 text-offwhite">
                        {socket.isHost && (
                            <>
                                {getSavedPlaylistsError && (
                                    <p className="text-red-700">
                                        {getSavedPlaylistsError}
                                    </p>
                                )}
                                <PlaylistsContainer
                                    className="flex flex-col overflow-scroll"
                                    // className="flex flex-wrap p-2"
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
                                    content="Load More Playlists"
                                    onClick={() => incrementOffset()}
                                    disabled={getSavedPlaylistsError.length > 0}
                                />
                            </>
                        )}
                        {!socket.isHost && confirmedPlaylistUri && (
                            <>
                                <p className="text-6xl text-offwhite font-bebas">
                                    Playlist Locked In
                                </p>
                                <Playlist uri={confirmedPlaylistUri} imageSize={225} />
                            </>
                        )}
                        {socket.playlistIndexes.length > 0 && (
                            <p className="text-2xl text-orangey">
                                {JSON.stringify(socket.playlistIndexes)}
                            </p>
                        )}
                        {isSuccess && socket.isHost && (
                            <Button
                                content="Start Duel"
                                className="text-2xl text-red-700 border-red-700"
                                onClick={() => socket.startDuel()}
                            />
                        )}
                    </div>
                    <div className="border-[1px] w-1/5 border-red-700 text-offwhite">
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
