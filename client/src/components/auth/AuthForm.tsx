import { useState } from "react";
import { handleSpotifyRedirect } from "../../api/spotify";
import useAppDispatch from "../../hooks/useAppDispatch";
import useUser from "../../hooks/useUser";
import { authenticateUser } from "../../store/state/userState";
import { UserCredentials } from "../../types";
import BlackBackground from "../common/BlackBackground";

interface Props {
    authAction: (user: UserCredentials) => Promise<string>;
    title: string;
}
export default function AuthForm({ authAction, title }: Props) {
    const userStore = useUser();
    const dispatch = useAppDispatch();
    const [authorized, setAuthorized] = useState(false);
    const [user, setUser] = useState<UserCredentials>({
        username: "",
        password: "",
    });

    const handleChange =
        (name: keyof UserCredentials) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setUser({ ...user, [name]: e.target.value });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(user);

        authAction(user)
            .then((token) => {
                dispatch(
                    authenticateUser({
                        username: user.username,
                        authToken: token,
                    })
                );
                setAuthorized(true);
            })
            .catch((err) => {
                console.log(`error in registerUser: ${err}`);
            });
    };

    return (
        <>
            <BlackBackground>
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className=" border-2 border-offwhite px-4 py-4 flex flex-col items-center justify-evenly gap-4 w-3/12 h-3/5 rounded:sm">
                        <p className={` text-offwhite text-6xl font-bebas`}>
                            {authorized ? "Integrate Spotify" : title}
                        </p>
                        <p className="text-offwhite text-3xl">
                            User: {userStore.username}
                        </p>
                        <form
                            className="flex flex-col justify-center items-center gap-9 w-5/6"
                            onSubmit={handleSubmit}
                        >
                            {!authorized && (
                                <div>
                                    <input
                                        className="w-full pr-4 py-2 border-b-[1px] placeholder:text-surface75 focus:outline-none transition-colors duration-200 border-b-offwhite focus:border-b-orangey bg-main-black text-offwhite"
                                        type="text"
                                        placeholder="Enter Username"
                                        onChange={handleChange("username")}
                                        autoComplete="off"
                                    />
                                    <input
                                        className="w-full mt-8 pr-4 py-2 border-b-[1px] placeholder:text-surface75 focus:outline-none transition-colors duration-200 border-b-offwhite focus:border-b-orangey bg-main-black text-offwhite"
                                        type="password"
                                        placeholder="Enter Password"
                                        onChange={handleChange("password")}
                                        autoComplete="off"
                                    />
                                </div>
                            )}
                            <button
                                type={`${authorized ? "button" : "submit"}`}
                                className={`px-5 py-3 border-2 rounded-full font-bold w-full transition-colors ${
                                    authorized
                                        ? "border-main-green text-main-green hover:bg-main-green"
                                        : "border-orangey text-orangey hover:bg-orangey"
                                } hover:text-main-black`}
                                onClick={
                                    authorized
                                        ? handleSpotifyRedirect
                                        : () => {
                                              console.log("I love The Strokes");
                                          }
                                }
                            >
                                {authorized ? "Spotify Redirect" : "Continue"}
                            </button>
                        </form>
                    </div>
                </div>
            </BlackBackground>
        </>
    );
}