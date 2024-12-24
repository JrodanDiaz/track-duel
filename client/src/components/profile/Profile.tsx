import { useEffect, useState } from "react";
import { logout } from "../../api/auth";
import useUser from "../../hooks/useUser";
import BlackBackground from "../common/BlackBackground";
import Button from "../common/Button";
import Navbar from "../common/Navbar";
import { getSavedPlaylists, savePlaylist } from "../../api/playlist";
import Input from "../common/Input";
import PlaylistContainer from "../common/PlaylistContainer";
import { test_uris } from "../../playlists";

export default function Profile() {
    const user = useUser();
    const [logoutError, setLogoutError] = useState("");
    const [savePlaylistSuccess, setSavePlaylistSuccess] = useState<boolean | undefined>(
        undefined
    );
    const [savePlaylistError, setSavePlaylistError] = useState("");
    const [savedPlaylists, setSavedPlaylists] = useState<string[]>([]);
    const [offset, setOffset] = useState(savedPlaylists.length);
    const [playlistUrl, setPlaylistUrl] = useState("");

    const handleSignOut = () => {
        logout().then((success) => {
            if (!success) setLogoutError("Error: Failed to log out (wtf)");
            else window.location.href = "/";
        });
    };

    const handlePlaylistSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        savePlaylist(playlistUrl).then((success) => {
            setSavePlaylistSuccess(success);
            if (success) {
                setSavePlaylistError("");
                setSavePlaylistSuccess(undefined);
                setOffset(savedPlaylists.length);
                // updateReloadPlaylistsSignal((signal) => signal + 1);
            }
            setPlaylistUrl("");
        });
    };

    useEffect(() => {
        getSavedPlaylists({ offset: offset }).then(
            ([noSavedPlaylists, playlists, errorMessage]) => {
                if (noSavedPlaylists) {
                    return;
                } else if (errorMessage) {
                    setSavePlaylistError(errorMessage);
                } else if (playlists === undefined) {
                    setSavePlaylistError("Internal Server Error");
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
    }, [offset]);

    return (
        <BlackBackground>
            <Navbar />
            <div className="flex flex-col gap-6 justify-center items-center w-full p-4">
                {logoutError && <p className="text-xl text-red-700">{logoutError}</p>}
                <h1 className="text-6xl font-semibold font-kanit tracking-wide text-offwhite">
                    Welcome {user.username}
                </h1>
                <Button
                    content="Log out"
                    onClick={handleSignOut}
                    className="text-2xl rounded-sm text-red-600 border-red-600"
                />
                <h1 className="text-3xl text-offwhite font-kanit">
                    Add playlist to your collection
                </h1>
                {savePlaylistError && (
                    <p className="text-xl text-red-600">{savePlaylistError}</p>
                )}
                <PlaylistContainer
                    className=" flex flex-wrap gap-4 border-[1px] border-surface75 w-3/5"
                    uris={
                        savedPlaylists.length === 0
                            ? test_uris
                            : [...savedPlaylists, ...test_uris]
                    }
                />
                <form onSubmit={handlePlaylistSubmit}>
                    <Input
                        placeholder="Enter Playlist URL"
                        value={playlistUrl}
                        onChange={setPlaylistUrl}
                        className=" border-main-green text-xl"
                    />
                    <Button
                        className=" !bg-main-green !text-black"
                        content="Submit"
                        submit={true}
                    />
                </form>
            </div>
        </BlackBackground>
    );
}
