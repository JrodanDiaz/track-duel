import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPlaylistMinimumQuery } from "../../store/api/playlistsApiSlice";
import ErrorMessage from "../common/ErrorMessage";

interface Props {
    uri: string;
    classname?: string;
    imageSize?: number;
}

export default function LockedPlaylist({ uri, classname = "", imageSize = 150 }: Props) {
    const { data, isLoading, error } = useGetPlaylistMinimumQuery(uri ?? skipToken);

    if (isLoading) return <div className=" text-lilac">Loading playlist...</div>;

    if (error || data === undefined)
        return <ErrorMessage message="Error Fetching Playlist..." />;

    return (
        <div
            className={`flex flex-col flex-wrap gap-4 justify-evenly items-center underline underline-offset-2  ${classname}`}
        >
            <p className=" text-offwhite text-5xl font-kanit text-center">{data.name}</p>
            {data.images[0].url && (
                <img src={data.images[0].url} height={imageSize} width={imageSize} />
            )}
        </div>
    );
}
