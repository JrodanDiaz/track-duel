import { useContext } from "react";
import { WebsocketContext } from "./Duel";

interface Props {
    className?: string;
}
export default function Scoreboard({ className = "" }: Props) {
    const socket = useContext(WebsocketContext);

    return (
        <div className={`${className}`}>
            <p className="text-4xl tracking-wide text-offwhite font-semibold font-bebas border-b-2 border-b-offwhite border-spacing-1">
                SCOREBOARD
            </p>
            <div className=" w-full">
                {Object.entries(socket.lobby).map(([player, data], i) => (
                    <p
                        className={`font-kanit text-2xl px-3 py-2 ${
                            i % 2 === 0 ? "text-offwhite" : "text-black bg-offwhite"
                        }`}
                        key={player}
                    >
                        {player}: {data.score}
                    </p>
                ))}
            </div>
        </div>
    );
}
