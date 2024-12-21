import { useState } from "react";
import useWebsocketSetup from "../hooks/useWebsocketSetup";
import BlackBackground from "./common/BlackBackground";

export default function WebsocketTesting() {
    const { sendAnswer, loading, answers } = useWebsocketSetup();
    const [answer, setAnswer] = useState("");
    return (
        <BlackBackground>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bebas text-offwhite">Websocket Testing</h1>
                {loading && <p className="text-offwhite">Loading...</p>}
                <input
                    className="px-5 py-2 bg-transparent focus:outline-none border-2 border-lilac text-lilac"
                    placeholder="Enter Answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                ></input>
                <button
                    onClick={() => sendAnswer(answer)}
                    className=" text-lilac border-2 border-lilac px-5 py-2 bg-transparent"
                >
                    Send Message
                </button>
                {answers.length > 0 &&
                    answers.map((ans) => (
                        <p className="text-offwhite">
                            {ans.from}: {ans.answer}
                        </p>
                    ))}
            </div>
        </BlackBackground>
    );
}
