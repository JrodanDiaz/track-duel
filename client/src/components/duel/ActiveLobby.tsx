import { useContext } from "react";
import { WebsocketContext } from "./Duel";
import Button from "../common/Button";

export default function ActiveLobby() {
    const socket = useContext(WebsocketContext);

    const handleLeaveRoom = () => {
        socket.leaveRoom();
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bebas text-offwhite my-4">Lobby</h1>
                <h1 className="text-3xl text-offwhite">
                    Room Code:{" "}
                    <span className="text-main-green text-3xl">{socket.roomCode}</span>
                </h1>
                {socket.isHost && (
                    <p className="text-3xl text-red-600">YOU'RE THE HOST</p>
                )}
                <div className="flex flex-col gap-2 p-4 border-2 border-gray-500 rounded-sm w-1/4">
                    {socket.lobby.map((player, i) => (
                        <li
                            className={`${
                                i % 2 === 0 ? "text-surface75" : "text-offwhite"
                            } text-xl list-none`}
                            key={`${player}-${i}`}
                        >
                            {player}
                        </li>
                    ))}
                </div>
                <Button
                    content="Leave Room"
                    className="text-2xl"
                    onClick={handleLeaveRoom}
                />
            </div>
        </>
    );
}
