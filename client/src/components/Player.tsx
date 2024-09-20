import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

interface PlayerProps {
  accessToken: string;
  trackUri: string | undefined;
}

export default function Player({ accessToken, trackUri }: PlayerProps) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;
  return (
    <>
      <button
        className="b bg-orange-500 text-white px-2 py-4 rounded-xl"
        onClick={() => setPlay(!play)}
      >
        Press me to play hopefully
      </button>
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={(state) => {
          if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
      />
    </>
  );
}
