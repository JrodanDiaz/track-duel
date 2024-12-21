import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPlaylistMinimumQuery } from "../../store/api/playlistsApiSlice";

interface Props {
    uri: string;
    index: number;
    selectedIndex: number | null;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    classname?: string;
}

export default function Playlist({
    uri,
    index,
    selectedIndex,
    setSelectedIndex,
    classname = "",
}: Props) {
    const { data, isLoading, error } = useGetPlaylistMinimumQuery(uri ?? skipToken);

    if (isLoading) return <div className=" text-lilac">Loading playlist...</div>;

    if (error || data === undefined)
        return <div className=" text-red-500">Error fetching playlist</div>;

    return (
        <div
            className={`flex flex-col flex-wrap gap-4 justify-evenly items-center cursor-pointer ${
                selectedIndex === index && "border-2 border-lilac"
            } ${classname}`}
            onClick={() => {
                setSelectedIndex(index);
            }}
        >
            {data.images[0].url && (
                <img src={data.images[0].url} height={150} width={150} />
            )}
            <p className=" text-offwhite">{data.name}</p>
        </div>
    );
}
