import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Playlist } from "../types";
interface Props {
  uris: string[];
  className?: string;
  spotifyApi: SpotifyWebApi;
}
export default function PlaylistsContainer({
  uris,
  className,
  spotifyApi,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [playlists_, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      setError(false);
      try {
        const responses = await Promise.all(
          uris.map((uri) => spotifyApi.getPlaylist(uri))
        );

        const playlistData: Playlist[] = await Promise.all(
          responses.map((response) => {
            if (response.statusCode != 200) {
              throw new Error("Bad Request From Spotify Get Playlists");
            }
            console.log(
              `Successful playlist GET Request: ${response.body.name}`
            );

            return {
              cover: response.body.images[0].url,
              title: response.body.name,
              uri: response.body.uri,
            };
          })
        );
        setPlaylists(playlistData);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [uris]);

  if (loading) return <div className=" text-offwhite">Loading...</div>;
  if (error) return <div className=" text-red-600">ERROR OCCURRED</div>;

  return (
    <>
      <div className={className}>
        {playlists_.map((playlist, i) => (
          <div
            key={`${i}-${playlist.title}`}
            className=" flex flex-col flex-wrap gap-4 justify-evenly items-center"
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
