import { useEffect } from "react";
import { getUserFromToken } from "../api/auth";
import { updateUser } from "../store/state/userState";
import { getSpotifyToken } from "../api/spotify";
import useAppDispatch from "../hooks/useAppDispatch";
import useUser from "../hooks/useUser";

export default function useAuthCheck() {
  const userStore = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userStore.username === "") {
      getUserFromToken()
        .then((user) => {
          console.log(
            `Implicit Login Success: User = ${user.username} Token = ${user.authToken}`
          );

          dispatch(
            updateUser({
              username: user.username,
              authToken: user.authToken,
              spotifyToken: getSpotifyToken(),
            })
          );
        })
        .catch((err) => {
          console.log(`Implicit Login Error: ${err}`);
        });
    }
  }, [userStore]);
}
