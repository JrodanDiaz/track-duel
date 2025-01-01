import Marquee from "../common/Marquee";
import usePlaylist from "../../hooks/usePlaylist";
import useTrackSelection from "../../hooks/useTrackSelection";
import { useEffect, useState } from "react";

interface Props {
    className?: string;
    trackIndex?: number;
    displayPreviousTrack?: boolean;
}

export default function GamePlaylist({
    className = "",
    trackIndex,
    displayPreviousTrack = false,
}: Props) {
    const playlist = usePlaylist();
    const trackSelection = useTrackSelection();
    const [currentTrackData, setTrackData] = useState<string[]>([]);

    useEffect(() => {
        if (trackIndex === undefined) return;
        const currentTrack = trackSelection[trackIndex];
        setTrackData([
            `Song: ${currentTrack.name}`,
            `Artist: ${currentTrack.artists[0].name}`,
            `Album: ${currentTrack.album.name}`,
        ]);
    }, [trackIndex]);

    return (
        <div className={` ${className} `}>
            <img
                src={
                    displayPreviousTrack && trackIndex !== undefined
                        ? trackSelection[trackIndex].album.images[0].url
                        : playlist.images[0].url
                }
                height={150}
                width={150}
            />

            {Array.from({ length: 10 }).map((_, i) => {
                const dataIndex = i % 3;
                const isEven = i % 2 === 0;
                if (displayPreviousTrack && trackIndex !== undefined) {
                    return (
                        <Marquee
                            content={currentTrackData[dataIndex]}
                            className={`text-2xl tracking-wider ${
                                isEven ? "text-offwhite " : " !bg-white !text-black"
                            }`}
                            reverse={isEven}
                        />
                    );
                }
                return (
                    <Marquee
                        content={playlist.name}
                        className={`text-2xl tracking-wider ${
                            isEven ? "text-offwhite " : " !bg-white !text-black"
                        }`}
                        reverse={isEven}
                    />
                );
            })}
        </div>
    );
}
