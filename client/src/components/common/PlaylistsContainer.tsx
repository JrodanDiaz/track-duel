import { useEffect, useState } from "react";
import ListPlaylist from "../duel/ListPlaylist";

interface Props {
    uris: string[];
    className?: string;
    setPlaylistUri: React.Dispatch<React.SetStateAction<string | undefined>>;
    selectedPlaylistUri?: string;
    fetchPlaylistSuccess?: boolean;
    handleLockIn?: () => void;
}

export default function PlaylistsContainer({
    uris,
    className,
    setPlaylistUri,
    selectedPlaylistUri,
    fetchPlaylistSuccess,
    handleLockIn,
}: Props) {
    const [selectedIndex, setSelectedIndex] = useState<null | number>(null);

    useEffect(() => {
        setPlaylistUri(selectedIndex === null ? undefined : uris[selectedIndex]);
    }, [selectedIndex]);

    return (
        <>
            <div className={className}>
                {uris.map((uri, index) => (
                    <ListPlaylist
                        uri={uri}
                        index={index}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        key={index}
                        selectedPlaylistUri={selectedPlaylistUri}
                        fetchPlaylistSuccess={fetchPlaylistSuccess}
                        handleLockIn={handleLockIn}
                    />
                    // <Playlist
                    //     uri={uri}
                    //     index={index}
                    //     selectedIndex={selectedIndex}
                    //     setSelectedIndex={setSelectedIndex}
                    //     key={index}
                    // />
                ))}
            </div>
        </>
    );
}
