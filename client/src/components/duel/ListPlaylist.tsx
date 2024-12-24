import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPlaylistMinimumQuery } from "../../store/api/playlistsApiSlice";
import ErrorMessage from "../common/ErrorMessage";

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
    imageSize = 110,
    selectedPlaylistUri,
    fetchPlaylistSuccess,
    handleLockIn,
}: Props) {
    const { data, isLoading, error } = useGetPlaylistMinimumQuery(uri ?? skipToken);

    if (isLoading) return <SkeletonListPlaylist />;

    if (error || data === undefined)
        return <ErrorMessage message="Error fetching playlist" />;

    const selectedTextStyle = () => {
        return selectedIndex === index ? "text-black" : "text-offwhite";
    };

    const hoverTextStyle = () => {
        return selectedPlaylistUri !== uri ? "group-hover:text-main-green" : "";
    };

    const handleClick = () => {
        if (setSelectedIndex && index !== undefined) {
            setSelectedIndex(index === selectedIndex ? null : index);
        }
    };

    return (
        <div
            className={`flex items-center justify-between pr-8 cursor-pointer border-[1px] border-y-offwhite/50 bg-transparent group ${
                selectedIndex === index && "!bg-main-green"
            } ${classname}`}
            onClick={handleClick}
        >
            <div className="flex gap-4 items-center">
                {data.images[0].url && (
                    <img src={data.images[0].url} height={imageSize} width={imageSize} />
                )}
                <p
                    className={`${selectedTextStyle()} ${hoverTextStyle()} text-2xl font-kanit `}
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

const SkeletonListPlaylist = () => {
    return (
        <div className=" flex items-center gap-4">
            <div className=" bg-gray-300 animate-pulse duration-500 h-[110px] w-[110px] border-y-offwhite/50"></div>
            <p className="text-offwhite text-2xl font-kanit">Loading...</p>
        </div>
    );
};
