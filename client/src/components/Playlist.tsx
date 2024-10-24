import usePlaylist from "../hooks/usePlaylist";
import BlackBackground from "./BlackBackground";

export default function Playlist() {
  const playlist = usePlaylist();
  return (
    <>
      <BlackBackground>
        <div className="w-full flex flex-col justify-center items-center">
          <img
            src={playlist.images[0].url}
            alt="Playlist Cover"
            height={150}
            width={150}
          />
          <h1 className=" text-offwhite text-3xl">{playlist.name}</h1>
          {playlist.tracks.items.map((item) => (
            <p className=" text-offwhite text-xl">
              {item.track.name} on {item.track.album.name}
            </p>
          ))}
        </div>
      </BlackBackground>
    </>
  );
}
