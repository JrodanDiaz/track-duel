import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "./Duel";
import Button from "../common/Button";
import { getSavedPlaylists } from "../../api/playlist";
import PlaylistsContainer from "../home/PlaylistsContainer";
import { test_uris } from "../../playlists";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPlaylistEssentialsQuery } from "../../store/api/playlistsApiSlice";
import useAppDispatch from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { updatePlaylist } from "../../store/state/playlistState";
import { getRandomSongSelection } from "../../utils";
import { updateTracks } from "../../store/state/trackSelectionState";

export default function ActiveLobby() {
    const socket = useContext(WebsocketContext);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
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

    useEffect(() => {
        if (!socket.isHost) return;
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
    }, [offset, socket.isHost]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(updatePlaylist(playlistData));
            const randomSelection = getRandomSongSelection(playlistData);
            dispatch(updateTracks(randomSelection));
            // navigate("/duel");
        }
    }, [isSuccess, playlistData, dispatch, navigate]);

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bebas text-offwhite my-4">Lobby</h1>
                <h1 className="text-3xl text-offwhite">
                    Room Code:{" "}
                    <span className="text-main-green text-3xl">{socket.roomCode}</span>
                </h1>
                <div className="flex flex-col gap-2 p-4 border-2 border-gray-500 rounded-sm w-1/4">
                    {socket.lobby.map((player, i) => (
                        <li
                            className={`${
                                i % 2 === 0 ? "text-surface75" : "text-offwhite"
                            } text-xl list-none`}
                            key={`${player}-${i}`}
                        >
                            {player}
                        </li>
                    ))}
                </div>
                <Button
                    content="Leave Room"
                    className="text-2xl"
                    onClick={handleLeaveRoom}
                />
                {socket.isHost && (
                    <>
                        {getSavedPlaylistsError && (
                            <p className="text-red-700">{getSavedPlaylistsError}</p>
                        )}
                        <PlaylistsContainer
                            className="flex flex-wrap p-2"
                            uris={
                                savedPlaylists.length > 0
                                    ? [...test_uris, ...savedPlaylists]
                                    : test_uris
                            }
                            setPlaylistUri={setSelectedPlaylistUri}
                        />
                        <Button
                            content="Load More Playlists"
                            onClick={() => incrementOffset()}
                            disabled={getSavedPlaylistsError.length > 0}
                        />
                    </>
                )}
                {selectedPlaylistUri && !isSuccess && (
                    <>
                        <button
                            onClick={() => setConfirmedPlaylistUri(selectedPlaylistUri)}
                            className=" px-3 py-5 border-2 border-main-green text-main-green font-bold hover:text-main-black hover:bg-main-green"
                        >
                            {isLoading ? "Loading" : "Lock In Playlist"}
                        </button>
                    </>
                )}
                {isSuccess && (
                    <Button
                        content="Start Duel"
                        className="text-2xl text-red-700 border-red-700"
                        onClick={() => socket.startDuel()}
                    />
                )}
            </div>
        </>
    );
}
