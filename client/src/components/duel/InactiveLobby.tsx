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
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-6xl text-offwhite font-bebas my-6">
                Lobby {socket.roomCode && socket.roomCode}
            </h1>
            <div
                className={`flex w-1/4 ${
                    socket.lobby.length > 0 ? "justify-center" : "justify-between"
                }`}
            >
                {socket.lobby.length === 0 && (
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
        </div>
    );
}
