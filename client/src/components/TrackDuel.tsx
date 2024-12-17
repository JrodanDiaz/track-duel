import { useNavigate } from "react-router-dom";
import { getSpotifyToken } from "../api/spotify";
import usePlaylist from "../hooks/usePlaylist";
import BlackBackground from "./BlackBackground";
import Player from "./Player";
import { useEffect, useState } from "react";
import useTrackSelection from "../hooks/useTrackSelection";
import SexyButton from "./SexyButton";

export default function TrackDuel() {
  const randomTracks = useTrackSelection();
  const playlist = usePlaylist();
  const navigate = useNavigate();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [answer, setAnswer] = useState("");
  const [previousAnswers, setPreviousAnswers] = useState<string[]>([]);
  const [correct, setCorrect] = useState<boolean>(false);
  if (!randomTracks) {
    console.error("Playlist is undefined");
  }

  useEffect(() => {
    if (!randomTracks[0].name || !playlist) {
      navigate("/");
    }
  }, [randomTracks, playlist]);

  useEffect(() => {
    console.log(`currentTrackIndex useEffect: ${currentTrackIndex}`);
  }, [currentTrackIndex]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer === randomTracks[currentTrackIndex].name) {
      setCorrect(true);
    } else {
      setPreviousAnswers((prev) => [...prev, answer]);
      setAnswer("");
    }
  };

  const selectNextSong = () => {
    setAnswer("");
    setCurrentTrackIndex((prev) => prev + 1);
    setCorrect(false);
  };

  return (
    <BlackBackground>
      <h1 className="text-3xl text-offwhite">TRACK DUEL</h1>
      <img src={playlist.images[0].url} height={150} width={150} />
      <button onClick={() => selectNextSong()} className="text-xl text-offwhite">
        Select Next Song
      </button>
      <p className="text-offwhite">{JSON.stringify(previousAnswers)}</p>
      <Player
        accessToken={getSpotifyToken()}
        trackUri={randomTracks?.[currentTrackIndex].uri}
      />
      {correct ? (
        <p className="text-3xl text-main-green">CORRECT ANSWER</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="px-5 py-3 focus:outline-none border-2 border-main-green rounded-full bg-transparent  text-offwhite w-1/3"
            placeholder="Enter answer here"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <SexyButton
            content="Submit"
            bg="bg-main-green"
            text="text-main-green"
            border="border-main-green"
            submit={true}
          />
        </form>
      )}
    </BlackBackground>
  );
}
