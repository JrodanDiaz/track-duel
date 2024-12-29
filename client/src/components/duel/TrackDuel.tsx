import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { getSpotifyToken } from "../../api/spotify";
import usePlaylist from "../../hooks/usePlaylist";
import useTrackSelection from "../../hooks/useTrackSelection";
import BlackBackground from "../common/BlackBackground";
import SexyButton from "../common/SexyButton";
import Input from "../common/Input";
import { WebsocketContext } from "./Duel";
import Player from "../common/Player";
import Navbar from "../common/Navbar";
import Button from "../common/Button";

export default function TrackDuel() {
    const randomTracks = useTrackSelection();
    const playlist = usePlaylist();
    const navigate = useNavigate();
    const [play, setPlay] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
    const [answer, setAnswer] = useState("");
    const [correct, setCorrect] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [roomCode, setRoomCode] = useState("");
    const socket = useContext(WebsocketContext);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    if (!randomTracks) {
        console.error("Playlist is undefined");
    }

    const isCorrectAnswer = (answer: string) =>
        answer.trim().toLowerCase() ===
        randomTracks[currentTrackIndex].name.toLowerCase().split("-")[0].trim();

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
        setAnswer("");
        if (isCorrectAnswer(answer)) {
            setCorrect(true);
            setPlay(false);
            const elapsedTime = Date.now() - startTime;
            setElapsedTime(elapsedTime);
            setScore((prevScore) => prevScore + 100 - Math.round(elapsedTime / 1000));
        } else {
            socket.sendAnswer(answer);
        }
    };

    const selectNextSong = () => {
        if (currentTrackIndex >= randomTracks.length - 1) return;
        setAnswer("");
        socket.resetAnswers();
        setCurrentTrackIndex((prev) => prev + 1);
        setCorrect(false);
        setPlay(true);
        setStartTime(0);
    };

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    // useEffect hook to scroll to the bottom when new messages are added
    useEffect(() => {
        scrollToBottom();
    }, [socket.answers]); // This runs whenever the messages state changes

    return (
        <BlackBackground>
            <Navbar enableRoomcode={false} />
            <div className="flex flex-col items-center h-screen">
                {socket.loading && (
                    <p className="text-offwhite">Establishing connection...</p>
                )}
                <img src={playlist.images[0].url} height={150} width={150} />
                <button
                    onClick={() => selectNextSong()}
                    className="text-xl text-offwhite"
                >
                    Select Next Song
                </button>
                <p className="text-xl text-red-700">Score: {score}</p>
                <Player
                    accessToken={getSpotifyToken()}
                    trackUri={randomTracks?.[currentTrackIndex].uri}
                    play={play}
                    setPlay={setPlay}
                />

                <div className="w-2/5 h-3/5">
                    <div
                        className="border-2 border-gray-500 p-5 w-full h-3/5 overflow-y-auto"
                        ref={chatContainerRef}
                    >
                        {socket.answers.length === 0 && (
                            <p className="text-xl text-surface75 text-center">
                                Dead chat... Someone say something
                            </p>
                        )}
                        {socket.answers.map((answer, i) => (
                            <p
                                className={`${
                                    i % 2 === 0 ? "text-offwhite " : "text-main-green"
                                } border-b-[1px] border-b-offwhite border-spacing-1 text-xl font-lato my-2`}
                            >
                                <strong>{answer.from}:</strong> {answer.answer}
                            </p>
                        ))}
                    </div>
                    {correct ? (
                        <p className="text-3xl text-main-green">CORRECT ANSWER</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full">
                            <input
                                type="text"
                                className="px-5 py-3 focus:outline-none border-2 border-main-green bg-transparent text-offwhite w-4/5 text-xl font-kanit"
                                placeholder="Enter answer here"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                            <Button
                                content="Submit"
                                submit={true}
                                className="w-1/5 text-xl font-kanit h-full !py-3 !bg-main-green !text-black"
                            />
                        </form>
                    )}
                </div>
            </div>
        </BlackBackground>
    );
}
