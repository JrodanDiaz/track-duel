import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { isLoggedIn } from "../../api/auth";
import { setSpotifyToken, handleSpotifyRedirect } from "../../api/spotify";
import useAppDispatch from "../../hooks/useAppDispatch";
import useUser from "../../hooks/useUser";
import { authenticateSpotify } from "../../store/state/userState";
import { User } from "../../types";
import useAuthCheck from "../auth/AuthCheck";
import BlackBackground from "../common/BlackBackground";
import SexyButton from "../common/SexyButton";
import Duel from "../duel/Duel";
import Navbar from "../common/Navbar";
import AlbumScroll from "./AlbumScroll";

export default function Root() {
    useAuthCheck();
    const user = useUser();
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const spotifyToken = searchParams.get("token");
        if (spotifyToken) {
            setSpotifyToken(spotifyToken);
            dispatch(authenticateSpotify(spotifyToken));
            setSearchParams("");
        }
    }, []);

    if (isLoggedIn(user)) {
        return <Duel />;
    }

    const loggedInNoSpotify = (user: User) => {
        return user.username && user.authToken && !user.spotifyToken;
    };

    return (
        <>
            <BlackBackground>
                <Navbar />
                <div className=" w-full flex flex-col justify-center items-center mt-24">
                    <div className=" w-10/12 flex flex-col justify-center items-center text-center">
                        <h1 className=" text-offwhite text-7xl font-lato">
                            This website is illegal
                        </h1>
                        <p className=" text-surface75 text-2xl mt-4">
                            Choose a Playlist, Album, or Artist, and be the first to guess
                            the song
                        </p>
                        {user.username && (
                            <p className="text-lg text-surface75 underline">
                                Welcome back, {user.username}
                            </p>
                        )}
                    </div>
                    <div className=" w-full flex justify-center items-center gap-8 mt-10">
                        {loggedInNoSpotify(user) ? (
                            <SexyButton
                                bg="bg-main-green"
                                text="text-main-green text-xl"
                                border="border-main-green"
                                content="Re-authenticate Spotify"
                                px="px-12"
                                onClick={handleSpotifyRedirect}
                            />
                        ) : (
                            <>
                                <Link to="/login">
                                    <SexyButton
                                        bg="bg-main-green"
                                        text="text-main-green text-xl"
                                        border="border-main-green"
                                        content="Sign In"
                                        px="px-12"
                                    />
                                </Link>
                            </>
                        )}
                    </div>
                    <AlbumScroll />
                </div>
                <div className="w-full h-full"></div>
            </BlackBackground>
        </>
    );
}