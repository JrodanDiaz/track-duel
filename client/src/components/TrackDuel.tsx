import { useNavigate } from "react-router-dom";
import { getSpotifyToken } from "../api/spotify";
import usePlaylist from "../hooks/usePlaylist";
import BlackBackground from "./BlackBackground";
import Player from "./Player";
import { useEffect, useState } from "react";
import useTrackSelection from "../hooks/useTrackSelection";

/*
On mount, randomly select X songs
Use state variable to track which index we are on
Once time is over or user guesses correctly, increment index
*/

export default function TrackDuel() {
  const randomTracks = useTrackSelection();
  const playlist = usePlaylist();
  const navigate = useNavigate();
  const [continueSignal, setContinueSignal] = useState<number>(0);
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
    console.log(`ContinueSignal useEffect: ${continueSignal}`);
  }, [continueSignal]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer === randomTracks[continueSignal].name) {
      setCorrect(true);
    } else {
      setPreviousAnswers((prev) => [...prev, answer]);
      setAnswer("");
    }
  };

  return (
    <BlackBackground>
      <h1 className="text-3xl text-offwhite">TRACK DUEL</h1>
      <img src={playlist.images[0].url} height={150} width={150} />
      <p
        onClick={() => setContinueSignal((prev) => prev + 1)}
        className="text-3xl text-main-pink"
      >
        Continue Signal: {continueSignal}
      </p>
      <p className="text-offwhite">{JSON.stringify(previousAnswers)}</p>
      <Player
        accessToken={getSpotifyToken()}
        trackUri={randomTracks?.[continueSignal].uri}
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
          <button type="submit">Submit</button>
        </form>
      )}
    </BlackBackground>
  );
}
