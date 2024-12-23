import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import useAppDispatch from "../hooks/useAppDispatch";
import { socketResponseSchema } from "../schemas";
import { Answer } from "../types";

enum SocketResponse {
    Ping = "Ping",
    Answer = "Answer",
    Error = "error",
    RoomJoined = "room-joined",
    UserJoined = "user-joined",
    StartDuel = "start-duel",
    RoomUpdate = "room-update",
    LeftRoom = "left-room",
}

export default function useWebsocketSetup() {
    const socketRef = useRef<WebSocket | null>(null);
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [lobby, setLobby] = useState<string[]>([]);
    const [roomCode, setRoomCode] = useState("");
    const [startSignal, setStartSignal] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const dispatch = useAppDispatch();

    const handleMessage = (message: MessageEvent) => {
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
            case SocketResponse.RoomJoined:
                console.log(`Successfully connected to room`);
                console.log(`Lobby: ${parsedMessage.data.users}`);
                setLobby(parsedMessage.data.users as string[]);
                setRoomCode(parsedMessage.data.roomCode as string);
                console.log(`isHost: ${parsedMessage.data.host}`);

                setIsHost(parsedMessage.data.host as boolean);
                break;
            case SocketResponse.UserJoined:
                console.log(`${parsedMessage.data.user} joined the room!`);
                setLobby((prev) => [
                    ...new Set([...prev, parsedMessage.data.user as string]),
                ]);
                break;
            case SocketResponse.StartDuel:
                console.log(`Start Duel: ${parsedMessage.data.type}`);
                setStartSignal(true);
                break;
            case SocketResponse.RoomUpdate:
                console.log(`Room Update`);
                //more evil type casting
                setLobby(parsedMessage.data.room as string[]);
                break;
            case SocketResponse.LeftRoom:
                console.log("Successfully left room");
                setRoomCode("");
                setLobby([]);
                setStartSignal(false);
                setAnswers([]);

                break;
            case SocketResponse.Error:
                console.log(`Error Socket Response: ${parsedMessage.data.message}`);
                break;
            default:
                console.log("Default in SocketResponse Switch. How did we get here...");
                console.log(`${JSON.stringify(parsedMessage.data)}`);
        }
    };

    useEffect(() => {
        console.log("Running Websocket Setup..");
        if (!user.username) {
            throw new Error("Username undefined while establishing connection...");
        }

        const url = `ws://localhost:3000?user=${user.username}`;
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            setLoading(false);
            console.log("Websocket connection established?");
        };

        socketRef.current.addEventListener("message", handleMessage);

        socketRef.current.onclose = () => {
            console.log("Websocket connection closed..");
        };

        return () => {
            console.log("Cleaning up Websocket connection..");
            socketRef.current?.close();
        };
    }, []);

    return {
        loading,
        sendAnswer: (answer: string) => {
            socketRef.current?.send(
                JSON.stringify({ type: "Answer", from: user.username, answer: answer })
            );
        },
        answers,
        resetAnswers: () => {
            setAnswers([]);
        },
        joinRoom: (roomCode: string) => {
            setLobby([]);
            socketRef.current?.send(
                JSON.stringify({
                    type: "join-room",
                    roomCode: roomCode,
                })
            );
        },
        startDuel: (roomCode: string) => {
            if (!roomCode) {
                throw new Error("Error: attempted to start duel with no room code");
            }
            socketRef.current?.send(
                JSON.stringify({
                    type: "start-duel",
                    roomCode: roomCode,
                })
            );
        },
        leaveRoom: () => {
            socketRef.current?.send(
                JSON.stringify({ type: "leave-room", roomCode: roomCode })
            );
        },
        lobby,
        startSignal,
        roomCode,
        isHost,
    };
}

export type useWebsocketReturnType = ReturnType<typeof useWebsocketSetup>;
