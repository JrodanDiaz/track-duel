import { useState } from "react";
import { UserCredentials } from "../types";
import { LoginUser } from "../api/auth";
import { useUserContext, useUserDispatchContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const userContext = useUserContext()
  const updateUserContext = useUserDispatchContext()

  const [user, setUser] = useState<UserCredentials>({username: "", password: ""});

  const handleChange =
    (name: keyof UserCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setUser({ ...user, [name]: e.target.value });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
    LoginUser(user)
      .then((userData) => {
        updateUserContext({...userData, spotify_token: userContext.spotify_token})
      })
      .catch((err) => {
        console.log(`error in loginUser: ${err}`);
    })
  };

  const handleSpotifyClick = async () => {
    const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
    if (!spotifyClientId) throw new Error("Spotify Client Id is undefined")
      
    const redirect_url = "http://localhost:3000/auth/callback"
    const scope = "streaming user-read-email user-read-private user-read-playback-state";

    const auth_query_params = new URLSearchParams({
        response_type: "code",
        client_id: spotifyClientId,
        scope: scope,
        redirect_uri: redirect_url,
    });

  console.log(`spotifyLoginHandler: Redirecting to callback`);
  console.log(`auth query params: ${auth_query_params}`);
  
    
  window.location.href = "https://accounts.spotify.com/authorize/?" + auth_query_params.toString()
  // navigate("https://accounts.spotify.com/authorize/?" + auth_query_params.toString())
  }

  return (
    <>
      <div className="border-black border-[1px] rounded-sm m-4 p-4 w-full justify-center items-center">
      {!userContext.username ? <form
          action=""
          className="flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            className="border-black border-[1px] px-3 py-1"
            type="text"
            name="username"
            id="username"
            placeholder="Enter Username"
            onChange={handleChange("username")}
          />
          <input
            className="border-black border-[1px] px-3 py-1"
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
            onChange={handleChange("password")}
          />
          <button
            type="submit"
            className="border-black border-[1px] px-4 py-2 bg-slate-400"
          >
            Submit
          </button>
        </form> : <><button onClick={handleSpotifyClick} className="p border-black border-[1px] bg-green-600 text-black px-3 py-1">Authorize Spotify</button></>} 
      </div>
    </>
  );
}