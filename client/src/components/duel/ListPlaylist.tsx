import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPlaylistMinimumQuery } from "../../store/api/playlistsApiSlice";

interface Props {
    uri: string;
    index?: number;
    selectedIndex?: number | null;
    setSelectedIndex?: React.Dispatch<React.SetStateAction<number | null>>;
    classname?: string;
    imageSize?: number;
    selectedPlaylistUri?: string;
    fetchPlaylistSuccess?: boolean;
    handleLockIn?: () => void;
}

export default function ListPlaylist({
    uri,
    index = 0,
    selectedIndex = -1,
    setSelectedIndex,
    classname = "",
    imageSize = 125,
    selectedPlaylistUri,
    fetchPlaylistSuccess,
    handleLockIn,
}: Props) {
    const { data, isLoading, error } = useGetPlaylistMinimumQuery(uri ?? skipToken);

    if (isLoading) return <div className=" text-lilac">Loading playlist...</div>;

    if (error || data === undefined)
        return <div className=" text-red-500">Error fetching playlist</div>;

    return (
        <div
            className={`flex items-center justify-between pr-8 cursor-pointer border-[1px] border-y-offwhite/50 bg-transparent ${
                selectedIndex === index && "!bg-main-green"
            } ${classname}`}
            onClick={() => {
                if (setSelectedIndex && index !== undefined) {
                    setSelectedIndex(index === selectedIndex ? null : index);
                }
            }}
        >
            <div className="flex gap-4 items-center">
                {data.images[0].url && (
                    <img src={data.images[0].url} height={imageSize} width={imageSize} />
                )}
                <p
                    className={`${
                        selectedIndex === index ? "text-black" : "text-offwhite"
                    } text-2xl font-kanit`}
                >
                    {data.name}
                </p>
            </div>
            {selectedPlaylistUri === uri && !fetchPlaylistSuccess && handleLockIn && (
                <>
                    <button
                        onClick={() => handleLockIn()}
                        className=" px-3 py-5 border-2 border-black  text-black font-bold transition-colors hover:text-main-black hover:bg-offwhite"
                    >
                        {isLoading ? "Loading" : "Lock In Playlist"}
                    </button>
                </>
            )}
        </div>
    );
}
