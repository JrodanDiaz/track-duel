import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getSpotifyToken } from "../../api/spotify";
import usePlaylist from "../../hooks/usePlaylist";
import useTrackSelection from "../../hooks/useTrackSelection";
import BlackBackground from "../common/BlackBackground";
import SexyButton from "../common/SexyButton";
import Input from "../common/Input";
import Player from "../common/Player";

export default function TrackDuel() {
    const [play, setPlay] = useState<boolean>(false);
    const [answer, setAnswer] = useState("");
    const [correct, setCorrect] = useState<boolean>(false);

    return (
        <BlackBackground>
            <div className="flex flex-col items-center">
                <h1 className="text-5xl font-bebas text-offwhite my-6">TRACK DUEL</h1>
                <img src="/fleshwater.jpg" height={150} width={150} />
                <button className="text-xl text-offwhite">Select Next Song</button>
                <p className="text-xl text-red-700">Score: 99</p>
                <Player
                    accessToken={getSpotifyToken()}
                    trackUri={""}
                    play={play}
                    setPlay={setPlay}
                />

                <div className="border-2 border-gray-500 rounded-lg p-5 w-2/5"></div>
                {correct ? (
                    <p className="text-3xl text-main-green">CORRECT ANSWER</p>
                ) : (
                    <form className="w-1/3">
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
