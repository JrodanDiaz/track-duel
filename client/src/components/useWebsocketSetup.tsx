import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import useAppDispatch from "../hooks/useAppDispatch";
import { socketResponseSchema } from "../schemas";
import { SocketResponse } from "../api/WebsocketData";
import { Answer } from "../types";

export default function useWebsocketSetup() {
    const socketRef = useRef<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const dispatch = useAppDispatch();
    const user = useUser();

    const handleMessage = (message: MessageEvent) => {
        console.log(`Received message: ${message}`);

        const parsedMessage = socketResponseSchema.safeParse(JSON.parse(message.data));
        if (!parsedMessage.success) {
            console.log(`Error parsing socket response: ${parsedMessage.error}`);
            return;
        }
        switch (parsedMessage.data.type) {
            case SocketResponse.Ping:
                console.log(`Pong...`);
                break;
            // I dont like the string type casting here, but also would it really make sense to do another zod validation?
            case SocketResponse.Answer:
                console.log(
                    `Received Answer from ${parsedMessage.data.from}: ${parsedMessage.data.answer}`
                );
                setAnswers((prev) => [
                    ...prev,
                    {
                        from: parsedMessage.data.from as string,
                        answer: parsedMessage.data.answer as string,
                    },
                ]);
                break;
            default:
                console.log("Default in SocketResponse Switch. How did we get here...");
        }
    };

    useEffect(() => {
        console.log("Running Websocket Setup..");
        const url = "ws://localhost:3000";
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            setLoading(false);
            console.log("Websocket connection established?");
        };

        socketRef.current.addEventListener("message", handleMessage);

        return () => {
            console.log("Cleaning up Websocket connection..");
            socketRef.current?.close();
        };
    }, []);

    return {
        sendAnswer: (answer: string) => {
            socketRef.current?.send(
                JSON.stringify({ type: "Answer", from: user.username, answer: answer })
            );
        },
        loading,
        answers,
    };
}
