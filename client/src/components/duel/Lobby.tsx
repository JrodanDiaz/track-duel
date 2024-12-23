import React, { useContext, useEffect, useState } from "react";
import BlackBackground from "../common/BlackBackground";
import { generateRoomCode } from "../../api/roomCode";
import useUser from "../../hooks/useUser";
import { WebsocketContext } from "./Duel";
import Button from "../common/Button";
import Input from "../common/Input";

enum LobbyChoice {
    None = "None",
    Join = "Join",
    Create = "Create",
}

export default function Lobby() {
    const user = useUser();
    // const [regenerateSignal, sendRegenerateSignal] = useState(0);
    const [codeError, setCodeError] = useState(false);
    const [code, setCode] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [lobbyChoice, setLobbyChoice] = useState<LobbyChoice>(LobbyChoice.None);
    const socket = useContext(WebsocketContext);

    // useEffect(() => {
    //     generateRoomCode(user.username).then((result) => {
    //         if (result === undefined) {
    //             setCodeError(true);
    //         } else {
    //             setCode(result);
    //             setCodeError(false);
    //             socket.joinRoom(result);
    //         }
    //     });
    // }, [regenerateSignal]);

    const handleJoinRoomSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.joinRoom(joinCode);
    };

    const handleCreateRoomClick = () => {
        generateRoomCode(user.username).then((result) => {
            if (result === undefined) {
                setCodeError(true);
            } else {
                setCode(result);
                setCodeError(false);
                socket.joinRoom(result);
            }
        });
    };

    const handleLeaveRoom = () => {
        setJoinCode("");
        setCode("");
        socket.leaveRoom();
    };

    return (
        <BlackBackground>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl text-offwhite font-bebas my-6">
                    Lobby {socket.roomCode && socket.roomCode}
                </h1>
                <div
                    className={`flex w-1/4 ${
                        socket.lobby.length > 0 ? "justify-center" : "justify-between"
                    }`}
                >
                    {socket.lobby.length > 0 ? (
                        <Button
                            content="Leave Room"
                            className="text-2xl"
                            onClick={handleLeaveRoom}
                        />
                    ) : (
                        <>
                            <Button
                                content="Join Room"
                                className=" transition-all duration-200 hover:text-black hover:bg-main-green text-2xl"
                                onClick={() => setLobbyChoice(LobbyChoice.Join)}
                            />
                            <Button
                                content="Create Room"
                                className=" transition-all duration-200 hover:text-black hover:bg-main-green text-2xl"
                                onClick={() => {
                                    setLobbyChoice(LobbyChoice.Create);
                                    handleCreateRoomClick();
                                }}
                            />
                        </>
                    )}
                </div>
                {codeError && (
                    <p className="text-red-700">
                        Error Occurred While Generating New Room...
                    </p>
                )}
                {code.length > 0 && (
                    <p className="text-2xl text-offwhite">
                        Room Code: <span className="text-main-green">{code}</span>
                    </p>
                )}
                {lobbyChoice === LobbyChoice.Join && (
                    <form onSubmit={handleJoinRoomSubmit}>
                        <Input
                            placeholder="Enter Room Code"
                            value={joinCode}
                            onChange={setJoinCode}
                        />
                        <Button content="Join" submit={true} />
                    </form>
                )}
                {socket.lobby.length > 0 && (
                    <div className="p-6 border-2 border-gray-600 flex flex-col items-center justify-center gap-4 my-5">
                        <p className="text-2xl text-offwhite font-bold">Lobby</p>
                        {socket.lobby.map((user, i) => (
                            <p className="text-xl text-surface75" key={`${user}-${i}`}>
                                {user}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </BlackBackground>
    );

    // return (
    //     <BlackBackground>
    //         <div className="flex flex-col items-center justify-center">
    //             <h1 className="text-6xl text-offwhite font-bebas my-6">Lobby</h1>
    //             {codeError && (
    //                 <p className="text-xl text-red-700">Error generating room code</p>
    //             )}
    //             {code.length > 0 && (
    //                 <p className="text-2xl text-lime-500">Room Code: {code}</p>
    //             )}
    //             <button
    //                 onClick={() => sendRegenerateSignal((prev) => prev + 1)}
    //                 className="bg-transparent border-2 border-red-700 text-red-700 px-5 py-2 my-4"
    //             >
    //                 Generate New Code
    //             </button>
    //             {socket.lobby.length > 0 &&
    //                 socket.lobby.map((user) => (
    //                     <p className="text-xl text-offwhite">{user}</p>
    //                 ))}
    //             <button
    //                 onClick={() => socket.startDuel(code)}
    //                 className="bg-transparent border-2 border-red-700 text-red-700 px-5 py-2"
    //             >
    //                 Start Duel
    //             </button>
    //         </div>
    //     </BlackBackground>
    // );
}
