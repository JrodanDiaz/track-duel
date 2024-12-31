import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import { socketResponseSchema } from "../schemas";
import { Answer } from "../types";

enum SocketResponse {
    Ping = "ping",
    Answer = "answer",
    Error = "error",
    RoomJoined = "room-joined",
    UserJoined = "user-joined",
    StartDuel = "start-duel",
    RoomUpdate = "room-update",
    LeftRoom = "left-room",
    Playlist = "playlist",
    Correct = "correct",
    Continue = "continue",
    UserDisconnected = "user-disconnected",
}

enum SocketRequest {
    JoinRoom = "join-room",
    LeaveRoom = "leave-room",
    StartDuel = "start-duel",
    SendPlaylist = "send-playlist",
    Answer = "answer",
    Correct = "correct",
}

type Lobby = {
    [username: string]: { score: number };
};

export default function useWebsocketSetup() {
    const socketRef = useRef<WebSocket | null>(null);
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [lobby, setLobby] = useState<Lobby>({});
    const [roomCode, setRoomCode] = useState("");
    const [startSignal, setStartSignal] = useState(false);
    const [continueSignal, setContinueSignal] = useState<number>(0);
    const [isHost, setIsHost] = useState(false);
    const [playlistUri, setPlaylistUri] = useState("");
    const [playlistIndexes, setPlaylistIndexes] = useState<number[]>([]);

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
                const players = parsedMessage.data.users as string[];
                const newPlayers: Lobby = {};
                players.forEach((player) => (newPlayers[player] = { score: 0 }));
                setLobby(newPlayers);
                setRoomCode(parsedMessage.data.roomCode as string);
                setIsHost(parsedMessage.data.host as boolean);
                break;
            case SocketResponse.UserJoined:
                console.log(`${parsedMessage.data.user} joined the room!`);

                const player = parsedMessage.data.user as string;
                if (player in lobby) return;
                setLobby((prev) => ({ ...prev, [player]: { score: 0 } }));
                break;
            case SocketResponse.StartDuel:
                console.log(`Start Duel: ${parsedMessage.data.type}`);
                setStartSignal(true);
                break;
            case SocketResponse.UserDisconnected:
                console.log(`${parsedMessage.data.user as string} Disconnected...`);
                setLobby((prev) => {
                    const newLobby = { ...prev };
                    delete newLobby[parsedMessage.data.user as string];
                    return newLobby;
                });
                break;
            case SocketResponse.LeftRoom:
                console.log("Successfully left room");
                setRoomCode("");
                setLobby({});
                setStartSignal(false);
                setAnswers([]);
                break;
            case SocketResponse.Playlist:
                setPlaylistUri(parsedMessage.data.playlist_uri as string);
                setPlaylistIndexes(parsedMessage.data.playlist_indexes as number[]);
                break;
            case SocketResponse.Error:
                console.log(`Error Socket Response: ${parsedMessage.data.message}`);
                break;
            case SocketResponse.Correct:
                const correctUsername = parsedMessage.data.username as string;

                setLobby((lobby) => {
                    const updatedLobby = { ...lobby };
                    if (updatedLobby[correctUsername] === undefined) {
                        console.error("Correct Response Received From Disconnected User..");
                        return lobby;
                    }
                    updatedLobby[correctUsername].score += parsedMessage.data.score as number;
                    return updatedLobby;
                });
                setAnswers((prev) => [
                    ...prev,
                    {
                        from: parsedMessage.data.username as string,
                        answer: "",
                        isCorrect: true,
                    },
                ]);

                break;
            case SocketResponse.Continue:
                console.log("Received SocketResponse: Continue");
                setContinueSignal((prev) => prev + 1);
                break;
            default:
                console.log("Default in SocketResponse Switch. How did we get here...");
                console.log(`${JSON.stringify(parsedMessage.data)}`);
                setRoomCode("");
                setStartSignal(false);
        }
    };

    useEffect(() => {
        console.log("Running Websocket Setup..");
        const timeout = setTimeout(() => {
            window.location.href = "/";
        }, 3000);

        if (!user.username) {
            console.log(`Aborted Websocket Connection, Username is undefined...`);
            window.location.href = "/";
            return;
        }

        const url = `ws://localhost:3000?user=${user.username}`;
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            setLoading(false);
            clearTimeout(timeout);
            console.log("Websocket connection established?");
        };

        socketRef.current.addEventListener("message", handleMessage);

        socketRef.current.onclose = () => {
            console.log("Websocket connection closed..");
            setLobby({});
            setRoomCode("");
            setStartSignal(false);
        };

        return () => {
            clearTimeout(timeout);
            console.log("Cleaning up Websocket connection..");
            socketRef.current?.close();
        };
    }, [user]);

    return {
        loading,
        sendAnswer: (answer: string) => {
            socketRef.current?.send(
                JSON.stringify({
                    type: SocketRequest.Answer,
                    from: user.username,
                    answer: answer,
                })
            );
        },
        answers,
        resetAnswers: () => {
            setAnswers([]);
        },
        joinRoom: (roomCode: string) => {
            setLobby({});
            socketRef.current?.send(
                JSON.stringify({
                    type: SocketRequest.JoinRoom,
                    roomCode: roomCode,
                })
            );
        },
        startDuel: () => {
            if (!roomCode) {
                throw new Error("Error: attempted to start duel with no room code");
            }
            socketRef.current?.send(
                JSON.stringify({
                    type: SocketRequest.StartDuel,
                    roomCode: roomCode,
                })
            );
        },
        leaveRoom: () => {
            setPlaylistIndexes([]);
            setPlaylistUri("");
            setLobby({});
            socketRef.current?.send(
                JSON.stringify({ type: SocketRequest.LeaveRoom, roomCode: roomCode })
            );
        },
        broadcastPlaylistUri: (uri: string, playlistIndexes: number[]) => {
            socketRef.current?.send(
                JSON.stringify({
                    type: SocketRequest.SendPlaylist,
                    playlist_uri: uri,
                    playlist_indexes: playlistIndexes,
                })
            );
        },
        broadcastCorrectAnswer: (score: number) => {
            socketRef.current?.send(
                JSON.stringify({
                    type: SocketRequest.Correct,
                    username: user.username,
                    score: score,
                })
            );
        },
        lobby,
        startSignal,
        continueSignal,
        roomCode,
        isHost,
        playlistUri,
        playlistIndexes,
    };
}

export type useWebsocketReturnType = ReturnType<typeof useWebsocketSetup>;
