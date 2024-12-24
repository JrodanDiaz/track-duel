import { useState } from "react";
import { handleSpotifyRedirect } from "../../api/spotify";
import useAppDispatch from "../../hooks/useAppDispatch";
import { authenticateUser } from "../../store/state/userState";
import { UserCredentials } from "../../types";
import BlackBackground from "../common/BlackBackground";
import { Link } from "react-router-dom";

export enum AuthTitles {
    SignIn = "Sign In",
    Register = "Register",
}

const greenButtonStyle = "text-main-green border-main-green hover:bg-main-green";
const orangeButtonStyle = "text-orangey border-orangey hover:bg-orangey";

interface Props {
    authAction: (user: UserCredentials) => Promise<string>;
    title: AuthTitles;
}
export default function AuthForm({ authAction, title }: Props) {
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
                        <form
                            className="flex flex-col justify-center items-center gap-9 w-5/6"
                            onSubmit={handleSubmit}
                        >
                            {!authorized && (
                                <div>
                                    <input
                                        className={`w-full pr-4 py-2 border-b-[1px] placeholder:text-surface75 focus:outline-none transition-colors duration-200 border-b-offwhite ${
                                            title === AuthTitles.Register
                                                ? "focus:border-b-orangey"
                                                : "focus:border-b-main-green"
                                        } bg-main-black text-offwhite`}
                                        type="text"
                                        placeholder="Enter Username"
                                        onChange={handleChange("username")}
                                        autoComplete="off"
                                    />
                                    <input
                                        className={`w-full pr-4 py-2 mt-8 border-b-[1px] placeholder:text-surface75 focus:outline-none transition-colors duration-200 border-b-offwhite ${
                                            title === AuthTitles.Register
                                                ? "focus:border-b-orangey"
                                                : "focus:border-b-main-green"
                                        } bg-main-black text-offwhite`}
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
                                    title === AuthTitles.SignIn
                                        ? greenButtonStyle
                                        : orangeButtonStyle
                                } ${
                                    authorized && greenButtonStyle
                                }  hover:text-main-black`}
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
                        {title === AuthTitles.SignIn && !authorized && (
                            <Link
                                to="/register"
                                className="text-md text-offwhite  underline underline-offset-4"
                            >
                                Don't have an account? Register here
                            </Link>
                        )}
                    </div>
                </div>
            </BlackBackground>
        </>
    );
}
