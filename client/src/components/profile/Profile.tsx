import { useState } from "react";
import { logout } from "../../api/auth";
import useUser from "../../hooks/useUser";
import BlackBackground from "../common/BlackBackground";
import Button from "../common/Button";
import Navbar from "../common/Navbar";

export default function Profile() {
    const user = useUser();
    const [logoutError, setLogoutError] = useState("");

    const handleSignOut = () => {
        logout().then((success) => {
            if (!success) setLogoutError("Error: Failed to log out (wtf)");
            else window.location.href = "/";
        });
    };
    return (
        <BlackBackground>
            <Navbar />
            <div className="flex flex-col justify-center items-center w-full p-4">
                {logoutError && <p className="text-xl text-red-700">{logoutError}</p>}
                <h1 className="text-3xl text-offwhite">Welcome {user.username}</h1>
                <Button content="Log out" onClick={handleSignOut} />
            </div>
        </BlackBackground>
    );
}
