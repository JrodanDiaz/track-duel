import { Track } from "../types";

interface TrackSearchResultProps {
  track: Track;
  chooseTrack: (track: Track) => void;
}

export default function TrackSearchResult({
  track,
  chooseTrack,
}: TrackSearchResultProps) {
  function handlePlay() {
    chooseTrack(track);
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <div className="ml-3 mb-3 bg-green-600 text-black px-4 py-2 rounded-md">
        <div>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  );
}
