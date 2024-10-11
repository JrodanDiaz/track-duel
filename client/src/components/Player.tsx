import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

interface PlayerProps {
  accessToken: string;
  trackUri: string | undefined;
}

export default function Player({ accessToken, trackUri }: PlayerProps) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(false), [trackUri]);

  if (!accessToken) return null;
  return (
    <>
      <button
        className=" text-main-green px-6 py-3 border-2 border-main-green rounded-full"
        onClick={() => setPlay(!play)}
      >
        <div className="flex items-center justify-center gap-2">
          <img src="/play.svg" />
          <p>{play ? "Pause" : "Start"} Track</p>
        </div>
      </button>
      <div className=" hidden">
        <SpotifyPlayer
          token={accessToken}
          // showSaveIcon
          callback={(state) => {
            if (!state.isPlaying) setPlay(false);
          }}
          play={play}
          uris={trackUri ? [trackUri] : []}
        />
      </div>
    </>
  );
}
