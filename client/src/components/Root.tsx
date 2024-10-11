import { Link, useSearchParams } from "react-router-dom";
import { useUserContext, useUserDispatchContext } from "./UserContext";
import { useEffect } from "react";
import { isLoggedIn } from "../api/auth";
import BlackBackground from "./BlackBackground";
import SexyButton from "./SexyButton";
import { User } from "../types";
import { handleSpotifyRedirect } from "../api/spotify";
import Play from "./Play";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { authenticateSpotify } from "../store/state/userState";

export default function Root() {
  const user = useUserContext();
  const updateUser = useUserDispatchContext();
  const dispatch = useDispatch<AppDispatch>();

  if (isLoggedIn(user)) {
    return <Play />;
    // window.location.href = "/play";
  }

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const spotifyToken = searchParams.get("token") || null;
    if (spotifyToken) {
      localStorage.setItem("spotify-token", spotifyToken);
      updateUser({ ...user, spotifyToken: spotifyToken });
      dispatch(authenticateSpotify(spotifyToken));
      // window.location.href = "/play";
      // searchParams.delete("token")
      // setSearchParams(searchParams)
    }
  }, []);

  const loggedInNoSpotify = (user: User) => {
    return user.username && user.authToken && !user.spotifyToken;
  };

  return (
    <>
      <BlackBackground>
        <div className=" w-full flex flex-col justify-center items-center mt-8">
          <div className=" w-10/12 flex flex-col justify-center items-center text-center">
            <h1 className=" text-offwhite text-9xl font-protest">Track Duel</h1>
            <p className=" text-surface75 text-2xl mt-4">
              Choose a Playlist, Album, or Artist, and be the first to guess the
              song
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
                <Link to="/register">
                  <SexyButton
                    bg="bg-orangey"
                    text="text-orangey text-xl"
                    border="border-orangey"
                    content="Register"
                    px="px-12"
                  />
                </Link>
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
        </div>
        <div className="w-full h-full"></div>
      </BlackBackground>
    </>
  );
}
