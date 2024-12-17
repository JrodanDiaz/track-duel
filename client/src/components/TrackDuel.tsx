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
  const [play, setPlay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [answer, setAnswer] = useState("");
  const [previousAnswers, setPreviousAnswers] = useState<string[]>([]);
  const [correct, setCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  if (!randomTracks) {
    console.error("Playlist is undefined");
  }

  useEffect(() => {
    if (!randomTracks[0].name || !playlist) {
      navigate("/");
    }
  }, [randomTracks, playlist]);

  useEffect(() => {
    if (play) {
      setStartTime(Date.now());
    }
  }, [play]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      answer.trim().toLowerCase() ===
      randomTracks[currentTrackIndex].name.toLowerCase().split("-")[0].trim()
    ) {
      setCorrect(true);
      setAnswer("");
      setPlay(false);
      const elapsedTime = Date.now() - startTime;
      setElapsedTime(elapsedTime);
      setScore((prevScore) => prevScore + 100 - Math.round(elapsedTime / 1000));
    } else {
      setPreviousAnswers((prev) => [...prev, answer]);
      setAnswer("");
    }
  };

  const selectNextSong = () => {
    setAnswer("");
    setCurrentTrackIndex((prev) => prev + 1);
    setCorrect(false);
    setPlay(true);
    setStartTime(0);
  };

  return (
    <BlackBackground>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-offwhite">TRACK DUEL</h1>
        <img src={playlist.images[0].url} height={150} width={150} />
        <button onClick={() => selectNextSong()} className="text-xl text-offwhite">
          Select Next Song
        </button>
        <p className="text-red-600 text-xl">Play State: {play ? "True" : "False"}</p>
        <p className="text-xl text-red-700">Score: {score}</p>
        <p className="text-xl text-main-pink">Start Time: {startTime}</p>
        <p className="text-xl text-main-pink">
          Elapsed Time Seconds: {elapsedTime / 1000}
        </p>
        <Player
          accessToken={getSpotifyToken()}
          trackUri={randomTracks?.[currentTrackIndex].uri}
          play={play}
          setPlay={setPlay}
        />

        <div className="border-2 border-gray-500 rounded-lg p-5 w-2/5">
          {previousAnswers.map((answer) => (
            <p className="text-offwhite">{answer}</p>
          ))}
        </div>
        {correct ? (
          <p className="text-3xl text-main-green">CORRECT ANSWER</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-1/3">
            <input
              type="text"
              className="px-5 py-3 focus:outline-none border-2 border-main-green rounded-full bg-transparent w-4/5  text-offwhite w-1/3"
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
      </div>
    </BlackBackground>
  );
}
