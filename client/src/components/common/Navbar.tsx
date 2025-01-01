import { Link } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../duel/Duel";

export const NavbarLink = ({
    to,
    content,
    className = "",
}: {
    to: string;
    content: string;
    className?: string;
}) => {
    return (
        <Link
            to={to}
            className={`text-offwhite text-xl font-lato tracking-wide relative group ${className}`}
        >
            {content}
            <div className="absolute top-10 w-full h-0.5 h-1 bg-white/80 scale-x-0 group-hover:scale-x-100 transition-all duration-200  group-hover:bg-main-green/80"></div>
        </Link>
    );
};

interface Props {
    enableRoomcode?: boolean;
    className?: string;
}

export default function Navbar({ enableRoomcode = false, className = "" }: Props) {
    const user = useUser();
    const socket = useContext(WebsocketContext);
    const [clipboardSuccess, setClipboardSuccess] = useState<boolean | undefined>(undefined);
    const handleClipboard = async () => {
        try {
            await navigator.clipboard.writeText(socket.roomCode);
            setClipboardSuccess(true);
        } catch (err) {
            setClipboardSuccess(false);
            console.error(err);
        }
    };

    useEffect(() => {
        setClipboardSuccess(undefined);
    }, [socket.roomCode]);

    return (
        <nav
            className={`border-[1px] border-transparent w-full flex justify-between items-center p-2 transition-colors duration-500 hover:border-b-offwhite/30 ${className}`}
        >
            <div className="text-6xl text-main-green font-bebas w-3/5 pl-16 flex justify-between">
                TRACK DUEL
                {socket.roomCode && enableRoomcode && (
                    <header className="text-5xl text-offwhite my-4 flex gap-3">
                        <p>
                            Room Code:{" "}
                            <span className="text-main-green text-5xl">{socket.roomCode}</span>
                        </p>
                        <button onClick={handleClipboard} className="text-xl text-offwhite">
                            <img
                                src={clipboardSuccess ? "/check-square.svg" : "/clipboard.svg"}
                                height={35}
                                width={35}
                            />
                        </button>
                    </header>
                )}
            </div>
            <NavbarLink to="/" content="Home" />
            <NavbarLink to="/about" content="About" />
            <NavbarLink to="/leaderboard" content="Leaderboard" />
            {user.username && user.spotifyToken ? (
                <NavbarLink to="/profile" content="Profile" />
            ) : (
                <NavbarLink to="/login" content="Login" className="  text-lilac" />
            )}
            <div></div>
        </nav>
    );
}
