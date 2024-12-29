import { useContext } from "react";
import BlackBackground from "../common/BlackBackground";
import { WebsocketContext } from "./Duel";
import ActiveLobby from "./ActiveLobby";
import InactiveLobby from "./InactiveLobby";
import Navbar from "../common/Navbar";

export default function Lobby() {
    const socket = useContext(WebsocketContext);

    return (
        <BlackBackground>
            <Navbar enableRoomcode={true} />
            {socket.roomCode ? <ActiveLobby /> : <InactiveLobby />}
        </BlackBackground>
    );
}
