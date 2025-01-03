import { useEffect, useState } from "react";
import Playlist from "./Playlist";

interface Props {
    uris: string[];
    className?: string;
    setPlaylistUri?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function PlaylistContainer({ uris, className, setPlaylistUri }: Props) {
    const [selectedIndex, setSelectedIndex] = useState<null | number>(null);

    useEffect(() => {
        if (setPlaylistUri) {
            setPlaylistUri(selectedIndex === null ? undefined : uris[selectedIndex]);
        }
    }, [selectedIndex]);

    return (
        <>
            <div className={className}>
                {uris.map((uri, index) => (
                    <Playlist
                        uri={uri}
                        index={index}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        key={index}
                    />
                ))}
            </div>
        </>
    );
}
