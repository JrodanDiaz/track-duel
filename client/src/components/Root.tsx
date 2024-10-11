import { Link, useSearchParams } from "react-router-dom";
import { useUserContext, useUserDispatchContext } from "./UserContext";
import { useEffect } from "react";
import { isLoggedIn } from "../api/auth";
import BlackBackground from "./BlackBackground";
import SexyButton from "./SexyButton";

export default function Root() {
  const user = useUserContext();
  const updateUser = useUserDispatchContext();

  if (isLoggedIn(user)) {
    window.location.href = "/play";
  }

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const spotifyToken = searchParams.get("token") || null;
    if (spotifyToken) {
      localStorage.setItem("spotify-token", spotifyToken);
      updateUser({ ...user, spotify_token: spotifyToken });
      window.location.href = "/play";
      // searchParams.delete("token")
      // setSearchParams(searchParams)
    }
  }, []);

  return (
    <>
      <BlackBackground>
        <div className=" w-full flex flex-col justify-center items-center mt-8">
          <div className=" w-10/12 flex flex-col justify-center items-center text-center">
            <h1 className=" text-offwhite text-9xl font-protest">Track Duel</h1>
            <p className=" text-surface75 text-2xl">
              Choose a Playlist, Album, or Artist, and be the first to guess the
              song
            </p>
          </div>
          <div className=" w-full flex justify-center items-center mt-10">
            <SexyButton
              bg="bg-orangey"
              text="text-orangey text-xl"
              border="border-orangey"
              content="Register"
              px="px-12"
              onClick={() => {
                window.location.href = "/register";
              }}
            />
            <SexyButton
              bg="bg-main-green"
              text="text-main-green text-xl"
              border="border-main-green"
              content="Sign In"
              px="px-12"
              onClick={() => {
                window.location.href = "/login";
              }}
            />
          </div>
        </div>
        <div className="w-full h-full"></div>
      </BlackBackground>
    </>
  );

  return (
    <>
      <div className="flex gap-4">
        <h1>Hello glorious daddy {user.username}</h1>
        <div className="border-black border-[1px] rounded-sm p-3">
          <h1>wsg gang</h1>
        </div>
        <div className="border-black border-[1px] rounded-sm p-3">
          <h1>wsg gang</h1>
        </div>
        <div className="border-black border-[1px] rounded-sm p-3">
          <Link to="/register">Register</Link>
        </div>
        <div className="border-black border-[1px] rounded-sm p-3">
          <Link to="/login">login</Link>
        </div>
        <div className="border-green-500 border-[1px] rounded-sm p-3">
          <Link to="/play">Play music</Link>
        </div>
      </div>
    </>
  );
}
