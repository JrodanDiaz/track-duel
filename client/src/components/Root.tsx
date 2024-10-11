import { Link, useSearchParams } from "react-router-dom";
import { useUserContext } from "./UserContext";
import { useEffect } from "react";

export default function Root() {
  const user = useUserContext()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const spotifyToken = searchParams.get("token") || null
    if(spotifyToken) {
      localStorage.setItem("spotify-token", spotifyToken)
      searchParams.delete("token")
      setSearchParams(searchParams)
    }
  }, [])

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
