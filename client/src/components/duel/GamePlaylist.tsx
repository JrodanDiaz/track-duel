import Marquee from "../common/Marquee";
import usePlaylist from "../../hooks/usePlaylist";

interface Props {
    className?: string;
}

export default function GamePlaylist({ className = "" }: Props) {
    const playlist = usePlaylist();

    return (
        <div className={` ${className} `}>
            <img src={playlist.images[0].url} height={150} width={150} />
            {Array.from({ length: 10 }).map((_, i) => (
                <Marquee
                    content={playlist.name}
                    className={`text-2xl tracking-wider ${
                        i % 2 === 0 ? "text-offwhite " : " !bg-white !text-black"
                    }`}
                    reverse={i % 2 !== 0}
                />
            ))}
        </div>
    );
}
