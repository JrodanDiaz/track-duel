"use client";
import { getUserFromToken } from "../api/auth";
import {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";

const UserContext = createContext<User | undefined>(undefined);
const UserDispatchContext = createContext<
  React.Dispatch<SetStateAction<User>> | undefined
>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const useUserDispatchContext = () => {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useUserDispatchContext must be used within a UserProvider"
    );
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({
    auth_token: "",
    spotify_token: "",
    username: "",
  });

  useEffect(() => {
    if (user.username === "") {
      getUserFromToken()
        .then((user_) => {
          const spotifyToken = localStorage.getItem("spotify-token");
          setUser({
            spotify_token: !!spotifyToken ? spotifyToken : "",
            auth_token: user_.auth_token,
            username: user_.username,
          });
        })
        .catch((err) => {
          console.log(`Implicit Login Error: ${err}`);
        });
    }
  }, [user]);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};
