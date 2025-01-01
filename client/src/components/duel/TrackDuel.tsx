import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getSpotifyToken } from "../../api/spotify";
import usePlaylist from "../../hooks/usePlaylist";
import useTrackSelection from "../../hooks/useTrackSelection";
import BlackBackground from "../common/BlackBackground";
import { WebsocketContext } from "./Duel";
import Player from "../common/Player";
import Navbar from "../common/Navbar";
import Button from "../common/Button";
import Marquee from "../common/Marquee";
import Scoreboard from "./Scoreboard";
import DuelChat from "./DuelChat";
import GamePlaylist from "./GamePlaylist";

export default function TrackDuel() {
    const randomTracks = useTrackSelection();
    const playlist = usePlaylist();
    const navigate = useNavigate();
    const [play, setPlay] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
    const [songBreak, setSongBreak] = useState(false);
    const [answer, setAnswer] = useState("");
    const [correct, setCorrect] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const socket = useContext(WebsocketContext);

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
        if (socket.continueSignal <= 0) return;
        setSongBreak(true);
        setPlay(false);
        if (socket.continueSignal >= randomTracks.length + 1) {
            setGameOver(true);
            return;
        }

        setTimeout(() => {
            setSongBreak(false);
            selectNextSong();
        }, 4000);
    }, [socket.continueSignal]);

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isCorrectAnswer(answer)) {
            setCorrect(true);
            setPlay(false);
            const elapsedTimeSeconds = Math.round((Date.now() - startTime) / 1000);
            if (elapsedTimeSeconds >= 100) return;
            const pointsScored = 100 - elapsedTimeSeconds;
            socket.broadcastCorrectAnswer(pointsScored);
        } else {
            socket.sendAnswer(answer);
        }
        setAnswer("");
    };

    const selectNextSong = () => {
        if (currentTrackIndex >= randomTracks.length - 1) return;
        setAnswer("");
        setCorrect(false);
        if (socket.continueSignal > 1) {
            setCurrentTrackIndex((prev) => prev + 1);
        }
        setPlay(true);
        setStartTime(Date.now());
    };

    const handleLeaveRoom = () => {
        socket.leaveRoom();
    };

    const inbetweenSongs = songBreak && socket.continueSignal >= 2 && !gameOver;

    return (
        <BlackBackground>
            <Navbar enableRoomcode={false} className=" mb-12" />
            {inbetweenSongs && (
                <div className="flex justify-center items-center text-center text-3xl text-offwhite font-semibold font-lato">
                    Song: {randomTracks[socket.continueSignal - 2].name}
                </div>
            )}
            {gameOver && (
                <div className="flex justify-center items-center">
                    <Button
                        content="Back to Lobby"
                        className="text-2xl rounded-sm text-red-600 border-red-600 transition-colors hover:bg-red-600 hover:text-black"
                        onClick={handleLeaveRoom}
                    />
                </div>
            )}
            <div className={`flex justify-center gap-8 h-screen`}>
                {socket.loading && <p className="text-offwhite">Establishing connection...</p>}
                <GamePlaylist className="w-1/5 h-[64%] p-3 flex flex-col items-center overflow-x-hidden border-[1px] border-gray-500" />
                <DuelChat className="w-2/5 h-4/5">
                    <form onSubmit={handleSubmit} className="w-full">
                        <input
                            type="text"
                            className="px-5 py-3 focus:outline-none border-2 border-main-green bg-transparent text-offwhite w-4/5 text-xl font-kanit disabled:border-gray-600 disabled:text-offwhite"
                            placeholder="Enter answer here"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={correct && !gameOver}
                        />
                        <Button
                            content="Submit"
                            submit={true}
                            className="w-1/5 text-xl font-kanit h-full !py-3 !bg-main-green !text-black disabled:border-gray-600 disabled:!text-offwhite disabled:!bg-gray-600"
                            disabled={correct && !gameOver}
                        />
                    </form>
                </DuelChat>
                <Scoreboard className="flex flex-col items-center border-[1px] border-gray-500 w-1/5 h-[64%] p-4" />
            </div>
            <div className="hidden">
                <Player
                    accessToken={getSpotifyToken()}
                    trackUri={
                        currentTrackIndex < randomTracks.length
                            ? randomTracks[currentTrackIndex].uri
                            : undefined
                    }
                    play={play}
                    setPlay={setPlay}
                />
            </div>
        </BlackBackground>
    );
}
