import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Playlist } from "../types";
import { PlaylistMinimumResponse } from "../api/spotifyTypes";
import {
  useGetPlaylistEssentialsQuery,
  useGetPlaylistMinimumQuery,
} from "../store/api/playlistsApiSlice";

interface Props {
  uris: string[];
  className?: string;
  spotifyApi: SpotifyWebApi;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | undefined>>;
}

export default function PlaylistsContainer({
  uris,
  className,
  spotifyApi,
  setPlaylist,
}: Props) {
  const [playlists_, setPlaylists] = useState<Playlist[]>([]);
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
                setPlaylist(playlists_[index]);
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

  return (
    <>
      <div className={className}>
        {playlists_.map((playlist, i) => (
          <div
            key={`${i}-${playlist.title}`}
            className={`flex flex-col flex-wrap gap-4 justify-evenly items-center cursor-pointer ${
              i === selectedIndex && "border-2 border-lilac"
            }`}
            onClick={() => {
              setSelectedIndex(i);
              setPlaylist(playlists_[i]);
            }}
          >
            {playlist.cover && (
              <img src={playlist.cover} height={150} width={150} />
            )}
            <p className=" text-offwhite">{playlist.title}</p>
          </div>
        ))}
      </div>
    </>
  );
}
