import { useState } from "react";
import Lobby from "./Lobby";
import TrackDuel from "./TrackDuel";
import useWebsocketSetup from "../../hooks/useWebsocketSetup";

export default function Duel() {
    const ws = useWebsocketSetup();

    const [start, setStart] = useState(false);
    const startGame = () => {
        setStart(true);
    };

    if (start) return <TrackDuel socket={ws} />;
    else return <Lobby startGame={startGame} socket={ws} />;
}
