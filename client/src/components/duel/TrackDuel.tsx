import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { getSpotifyToken } from "../../api/spotify";
import usePlaylist from "../../hooks/usePlaylist";
import useTrackSelection from "../../hooks/useTrackSelection";
import BlackBackground from "../common/BlackBackground";
import { WebsocketContext } from "./Duel";
import Player from "../common/Player";
import Navbar from "../common/Navbar";
import Button from "../common/Button";
import useUser from "../../hooks/useUser";
import Marquee from "../common/Marquee";

export default function TrackDuel() {
    const userStore = useUser();
    const randomTracks = useTrackSelection();
    const playlist = usePlaylist();
    const navigate = useNavigate();
    const [play, setPlay] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
    const [songBreak, setSongBreak] = useState(false);
    const [answer, setAnswer] = useState("");
    const [correct, setCorrect] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
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

    useEffect(() => {
        if (socket.continueSignal === 0) return;
        setSongBreak(true);
        setPlay(false);

        setTimeout(() => {
            setSongBreak(false);
            // setCurrentTrackIndex((prev) => prev + 1);
            selectNextSong();
        }, 5000);
    }, [socket.continueSignal]);

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAnswer("");
        if (isCorrectAnswer(answer)) {
            socket.broadcastCorrectAnswer();
            setCorrect(true);
            setPlay(false);
            const elapsedTimeSeconds = Math.round((Date.now() - startTime) / 1000);
            if (elapsedTimeSeconds < 100) {
                setScore((prev) => prev + (100 - elapsedTimeSeconds));
            }
        } else {
            socket.sendAnswer(answer);
        }
    };

    const selectNextSong = () => {
        if (currentTrackIndex >= randomTracks.length - 1) return;
        setAnswer("");
        // socket.resetAnswers();
        setCurrentTrackIndex((prev) => prev + 1);
        setCorrect(false);
        setPlay(true);
        setStartTime(Date.now());
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
            {/* <div className="flex flex-col items-center h-screen"> */}
            <div className="flex justify-center gap-8 h-screen mt-24">
                {socket.loading && (
                    <p className="text-offwhite">Establishing connection...</p>
                )}
                <div className="w-1/5 h-[64%] p-3 flex flex-col items-center overflow-x-hidden border-[1px] border-gray-500">
                    <img src={playlist.images[0].url} height={150} width={150} />
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Marquee
                            content={playlist.name}
                            className={`text-2xl tracking-wider ${
                                i % 2 === 0 ? "text-offwhite " : " !bg-white !text-black"
                            }`}
                            reverse={i % 2 !== 0}
                        />
                    ))}
                    <div className=" flex flex-col gap-3 py-2">
                        <Button
                            onClick={() => selectNextSong()}
                            className="text-md text-offwhite border-offwhite"
                            content="Select Next Song"
                        />

                        <Player
                            accessToken={getSpotifyToken()}
                            trackUri={randomTracks?.[currentTrackIndex].uri}
                            play={play}
                            setPlay={setPlay}
                        />
                    </div>
                </div>

                <div className="w-2/5 h-4/5">
                    <div
                        className="border-2 border-gray-500 p-5 w-full h-4/5 overflow-y-auto"
                        ref={chatContainerRef}
                    >
                        {socket.answers.length === 0 && (
                            <p className="text-xl text-surface75 text-center">
                                Dead chat... Someone say something
                            </p>
                        )}
                        {socket.answers.map((answer, i) => {
                            const answerStyle =
                                "border-b-[1px] border-b-offwhite border-spacing-1 text-xl font-lato my-2";
                            if (answer.isCorrect) {
                                return (
                                    <p className={`text-main-green  ${answerStyle}`}>
                                        {answer.from} guessed the song correctly!
                                    </p>
                                );
                            } else
                                return (
                                    <p
                                        className={`${answerStyle} ${
                                            i % 2 === 0
                                                ? "text-offwhite "
                                                : " text-surface75"
                                        }`}
                                    >
                                        <strong>{answer.from}:</strong> {answer.answer}
                                    </p>
                                );
                        })}
                    </div>
                    <form onSubmit={handleSubmit} className="w-full">
                        <input
                            type="text"
                            className="px-5 py-3 focus:outline-none border-2 border-main-green bg-transparent text-offwhite w-4/5 text-xl font-kanit disabled:border-gray-600 disabled:text-offwhite"
                            placeholder="Enter answer here"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={correct}
                        />
                        <Button
                            content="Submit"
                            submit={true}
                            className="w-1/5 text-xl font-kanit h-full !py-3 !bg-main-green !text-black disabled:border-gray-600 disabled:!text-offwhite disabled:!bg-gray-600"
                            disabled={correct}
                        />
                    </form>
                </div>
                <div className=" border-[1px] border-gray-500 w-1/5 h-[64%]">
                    <p className="text-2xl text-offwhite">SCOREBOARD</p>
                    <p className="text-xl text-red-700">
                        {userStore.username}: {score}
                    </p>
                    {songBreak && (
                        <p className="text-2xl text-blue-500">IN SONG BREAK STATE</p>
                    )}
                </div>
            </div>
        </BlackBackground>
    );
}
