interface Props {
    players: string[];
    className?: string;
}

const heisters = [
    "/heisters/dallas.png",
    "/heisters/chains.png",
    "/heisters/wolf.png",
    "/heisters/houston.png",
    "/heisters/sokol.png",
    "/heisters/hoxton.png",
];
export default function PlayersContainer({ players = heisters, className = "" }: Props) {
    return (
        <>
            <ul>
                {players.map((player, i) => (
                    <>
                        <div
                            className={`w-full flex items-center gap-4 ${
                                i % 2 === 0 ? " bg-zinc-800" : "bg-slate-700"
                            } ${className}`}
                        >
                            <img
                                src={heisters[i % heisters.length]}
                                height={50}
                                width={50}
                            />
                            <li className=" list-none text-xl text-offwhite">{player}</li>
                        </div>
                    </>
                ))}
            </ul>
        </>
    );
}
