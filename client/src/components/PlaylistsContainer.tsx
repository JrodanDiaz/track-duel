import { useState } from "react";
import { useGetPlaylistMinimumQuery } from "../store/api/playlistsApiSlice";

interface Props {
  uris: string[];
  className?: string;
  setPlaylistUri: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function PlaylistsContainer({
  uris,
  className,
  setPlaylistUri,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);

  const playlistQueries = uris.map((uri) => useGetPlaylistMinimumQuery(uri));

  return (
    <>
      <div className={className}>
        {playlistQueries.map((query, index) => {
          const { data: playlist, isLoading, error } = query;

          if (isLoading)
            return (
              <div key={index} className=" text-lilac">
                Loading playlist {index + 1}...
              </div>
            );

          if (error || playlist === undefined)
            return (
              <div key={index} className=" text-red-500">
                Error fetching playlist {index + 1}
              </div>
            );

          return (
            <div
              key={`${index}-${playlist.name}`}
              className={`flex flex-col flex-wrap gap-4 justify-evenly items-center cursor-pointer ${
                index === selectedIndex && "border-2 border-lilac"
              }`}
              onClick={() => {
                setSelectedIndex(index);
                setPlaylistUri(uris[index]);
              }}
            >
              {playlist.images[0].url && (
                <img src={playlist.images[0].url} height={150} width={150} />
              )}
              <p className=" text-offwhite">{playlist.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
