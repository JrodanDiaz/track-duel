import { useContext, useEffect, useState } from "react";
import { useWebsocketReturnType } from "../../hooks/useWebsocketSetup";
import BlackBackground from "../common/BlackBackground";
import { generateRoomCode } from "../../api/roomCode";
import useUser from "../../hooks/useUser";
import { WebsocketContext } from "./Duel";

export default function Lobby() {
    const user = useUser();
    const [regenerateSignal, sendRegenerateSignal] = useState(0);
    const [codeError, setCodeError] = useState(false);
    const [code, setCode] = useState("");
    const socket = useContext(WebsocketContext);

    useEffect(() => {
        generateRoomCode(user.username).then((result) => {
            if (result === undefined) {
                setCodeError(true);
            } else {
                setCode(result);
                setCodeError(false);
                socket.joinRoom(result);
            }
        });
    }, [regenerateSignal]);

    return (
        <BlackBackground>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl text-offwhite font-bebas my-6">Lobby</h1>
                {codeError && (
                    <p className="text-xl text-red-700">Error generating room code</p>
                )}
                {code.length > 0 && (
                    <p className="text-2xl text-lime-500">Room Code: {code}</p>
                )}
                <button
                    onClick={() => sendRegenerateSignal((prev) => prev + 1)}
                    className="bg-transparent border-2 border-red-700 text-red-700 px-5 py-2 my-4"
                >
                    Generate New Code
                </button>
                {socket.lobby.length > 0 &&
                    socket.lobby.map((user) => (
                        <p className="text-xl text-offwhite">{user}</p>
                    ))}
                <button
                    onClick={() => socket.startDuel(code)}
                    className="bg-transparent border-2 border-red-700 text-red-700 px-5 py-2"
                >
                    Start Duel
                </button>
            </div>
        </BlackBackground>
    );
}
