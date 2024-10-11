import { useState } from "react";
import { Track } from "../types";

interface TrackSearchResultProps {
  track: Track;
  chooseTrack: (track: Track) => void;
}

export default function TrackSearchResult({
  track,
  chooseTrack,
}: TrackSearchResultProps) {
  const [hovered, setHovered] = useState(false);

  function handlePlay() {
    chooseTrack(track);
  }

  return (
    <div
      className="m-2 cursor-pointer"
      onClick={handlePlay}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div
        className={`flex gap-2 ml-3 mb-3 border-2  transition-colors duration-100 ease-in ${
          hovered ? "border-main-green" : "border-offwhite"
        } text-black px-4 py-4 rounded-md`}
      >
        {track.cover && (
          <img src={track.cover} alt="Album Cover" height={100} width={100} />
        )}
        <div>
          <h1
            className={` transition-colors duration-100  ${
              hovered ? "text-main-green" : "text-offwhite"
            } text-2xl underline`}
          >
            {track.title}
          </h1>
          <h1
            className={`transition-colors duration-100 ease-in ${
              hovered ? "text-lt-green" : "text-surface75"
            }`}
          >
            {track.artist}
          </h1>
        </div>
      </div>
    </div>
  );
}
