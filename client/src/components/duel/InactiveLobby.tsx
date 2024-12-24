import { useContext, useState } from "react";
import { WebsocketContext } from "./Duel";
import { generateRoomCode } from "../../api/roomCode";
import useUser from "../../hooks/useUser";
import Button from "../common/Button";
import Input from "../common/Input";

enum LobbyChoice {
    None = "None",
    Join = "Join",
    Create = "Create",
}
export default function InactiveLobby() {
    const socket = useContext(WebsocketContext);
    const user = useUser();
    const [codeError, setCodeError] = useState(false);
    const [code, setCode] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [lobbyChoice, setLobbyChoice] = useState<LobbyChoice>(LobbyChoice.None);

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

    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-6xl text-offwhite font-bebas font-kanit my-6">
                Welcome, {user.username}
            </h1>
            <img src="/matrix.png" width={300} height={300} />
            <div
                className={`flex w-1/4 ${
                    socket.lobby.length > 0 ? "justify-center" : "justify-between"
                }`}
            >
                {socket.lobby.length === 0 && (
                    <>
                        <Button
                            content="Create Room"
                            className="border-red-600 text-red-600 transition-all duration-200 hover:text-black hover:bg-red-600 text-2xl rounded-sm font-kanit"
                            onClick={() => {
                                setLobbyChoice(LobbyChoice.Create);
                                handleCreateRoomClick();
                            }}
                        />
                        <Button
                            content="Join Room"
                            className=" !border-blue-600 !text-blue-600 transition-all duration-200 hover:!text-black hover:bg-blue-600 text-2xl rounded-sm font-kanit"
                            onClick={() => setLobbyChoice(LobbyChoice.Join)}
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
                <form
                    onSubmit={handleJoinRoomSubmit}
                    className="w-1/2 flex flex-col justify-center items-center"
                >
                    <div>
                        <Input
                            placeholder="Enter Room Code"
                            value={joinCode}
                            onChange={setJoinCode}
                            className="border-blue-600 border-r-transparent font-kanit"
                        />
                        <Button
                            content="JOIN"
                            submit={true}
                            className="rounded-sm border-transparent bg-blue-600 text-offwhite px-8 font-kanit"
                        />
                    </div>
                </form>
            )}
        </div>
    );
}
