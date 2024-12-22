import Lobby from "./Lobby";
import TrackDuel from "./TrackDuel";
import useWebsocketSetup, { useWebsocketReturnType } from "../../hooks/useWebsocketSetup";
import BlackBackground from "../common/BlackBackground";
import { createContext } from "react";

export const WebsocketContext = createContext<useWebsocketReturnType>(
    {} as useWebsocketReturnType
);

export default function Duel() {
    const ws = useWebsocketSetup();

    if (ws.loading)
        return (
            <BlackBackground>
                <h1 className="text-lilac text-6xl text-center">Loading...</h1>
            </BlackBackground>
        );

    return (
        <WebsocketContext.Provider value={ws}>
            {ws.startSignal ? <TrackDuel /> : <Lobby />}
        </WebsocketContext.Provider>
    );
    // else if (ws.startSignal) return <TrackDuel socket={ws} />;
    // else return <Lobby socket={ws} />;
}
