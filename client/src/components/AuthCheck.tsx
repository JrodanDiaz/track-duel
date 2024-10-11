import { useDispatch, useSelector, UseSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { getUserFromToken } from "../api/auth";
import { updateUser } from "../store/state/userState";
import { getSpotifyToken } from "../api/spotify";

export default function useAuthCheck() {
  const userStore = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userStore.username === "") {
      getUserFromToken()
        .then((user) => {
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
