import { useContext } from "react";
import BlackBackground from "../common/BlackBackground";
import { WebsocketContext } from "./Duel";
import ActiveLobby from "./ActiveLobby";
import InactiveLobby from "./InactiveLobby";

export default function Lobby() {
    const socket = useContext(WebsocketContext);

    return (
        <BlackBackground>
            {socket.roomCode ? <ActiveLobby /> : <InactiveLobby />}
        </BlackBackground>
    );
}
