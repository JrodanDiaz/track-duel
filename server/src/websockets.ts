import { IncomingMessage, Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { rooms, userMap } from "./handlers/roomHandler";

enum SocketRequest {
    JoinRoom = "join-room",
    LeaveRoom = "leave-room",
    StartDuel = "start-duel",
    SendPlaylist = "send-playlist",
    Answer = "answer",
    Correct = "correct",
}

enum SocketResponse {
    UserJoined = "user-joined",
    RoomJoined = "room-joined",
    Error = "error",
    StartDuel = "start-duel",
    LeftRoom = "left-room",
    Playlist = "playlist",
    Correct = "correct",
    Continue = "continue",
    UserDisconnected = "user-disconnected"
}

const userSocketMap = new Map<WebSocket, string>();

const sendMessage = (ws: WebSocket, message: Object) => {
    ws.send(JSON.stringify(message));
};

const getUserFromRequest = (req: IncomingMessage) => {
    const path = "http://localhost:3000";
    const url = new URL(path + req.url);
    return url.searchParams.get("user");
};

export const deleteRoom = (roomCode: string) => {
    clearRoomInterval(roomCode)
    delete rooms[roomCode]
}

const sendMessageToRoom = (roomCode: string, message: Object) => {
    if (!rooms[roomCode]) {
        console.error("Error: Attempted to send message to nonexistant room");
        return;
    }
    rooms[roomCode].users.forEach((socket) => {
        socket.send(JSON.stringify(message));
    });
};

const getUsersFromRoom = (roomCode: string) => {
    return Array.from(rooms[roomCode].users).map((socket) => userSocketMap.get(socket));
};

const removeUserFromRoom = (roomCode: string, socket: WebSocket) => {
    const user = userSocketMap.get(socket);
    if (!user)
        throw new Error("Error: Cannot remove user that is absent from UserSocketMap");
    if (rooms[roomCode]) {
        rooms[roomCode].users.delete(socket);
        console.log(`Removed ${user} from room ${roomCode}`);

        if (rooms[roomCode].users.size === 0) {
            deleteRoom(roomCode)
            console.log(`Deleted empty room ${roomCode}`);
        } else {
            sendMessageToRoom(roomCode, { type: SocketResponse.UserDisconnected, user: user });
        }
    }
    if (userMap[user]) {
        delete userMap[user];
        console.log(`Deleted user's UserRoomMap: ${JSON.stringify(userMap)}`);
    }
};

const resetLobbyCorrectAnswerFlags = (roomCode: string) => {
        const users = rooms[roomCode].users
        users.forEach(socket => {
            const username = userSocketMap.get(socket)
            if(username && userMap[username]?.answered_correctly === true) {
                userMap[username].answered_correctly = false
            }
        })
}

const entireLobbyAnsweredCorrectly = (roomCode: string) => {
    for(const socket of rooms[roomCode].users) {
        const username = userSocketMap.get(socket)
        if(username && !userMap[username]?.answered_correctly) return false
    }
    return true
}

const setContinueInterval = (roomCode: string, timeSeconds: number) => {
    const interval_id = setInterval(() => {
        resetLobbyCorrectAnswerFlags(roomCode)
        sendMessageToRoom(roomCode, { type: SocketResponse.Continue });
    }, timeSeconds * 1000)
    rooms[roomCode].interval_id = interval_id
}

export const clearRoomInterval = (roomCode: string) => {
    const interval_id = rooms[roomCode].interval_id
    if(interval_id) clearInterval(interval_id)
}

export const configureWebsocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });

    const onSocketPostError = () => {
        console.log(`Error during Websocket Connection`);
    };

    wss.on("connection", (ws, req) => {
        console.log(`Websocket Connection established...`);
        let roomCode: string | null = null;
        const user = getUserFromRequest(req);
        if (!user) {
            ws.close();
            console.log(`User Undefined. Closing connection`);
            return;
        }
        userSocketMap.set(ws, user);
        if(!userMap[user]) {
            userMap[user] = {roomCode: "", answered_correctly: false}
        }

        ws.on("error", onSocketPostError);

        ws.on("message", (msg, isBinary) => {
            console.log(`Received Websocket Message: ${msg.toString()}`);
            const parsedMessage = JSON.parse(msg.toString());

            if (parsedMessage.type === SocketRequest.JoinRoom && parsedMessage.roomCode) {
                //disgusting type cast to stop TS from crying. Is Zod validation really necessary
                roomCode = parsedMessage.roomCode as string;
                if (!rooms[roomCode]) {
                    sendMessage(ws, {type: SocketResponse.Error, message: "Room not found"});
                    return;
                }
                rooms[roomCode].users.add(ws);
                console.log(`User ${user} joined room ${roomCode}`);

                const lobby = getUsersFromRoom(roomCode);

                console.log(`${roomCode} Lobby: ${lobby}`);

                const isHost = rooms[roomCode].users.size === 1;
                sendMessage(ws, {
                    type: SocketResponse.RoomJoined,
                    roomCode: roomCode,
                    users: lobby,
                    host: isHost,
                });

                sendMessageToRoom(roomCode, {type: SocketResponse.UserJoined, user: user });
            } 
            else if (parsedMessage.type === SocketRequest.StartDuel && parsedMessage.roomCode) {
                sendMessageToRoom(parsedMessage.roomCode, {type: SocketResponse.StartDuel});
                setContinueInterval(parsedMessage.roomCode, 30)
            } 
            else if (parsedMessage.type === SocketRequest.LeaveRoom && roomCode) {
                removeUserFromRoom(roomCode, ws);
                sendMessage(ws, { type: SocketResponse.LeftRoom });
            } 
            else if (parsedMessage.type === SocketRequest.SendPlaylist) {
                if (!roomCode) {
                    sendMessage(ws, {
                        type: SocketResponse.Error,
                        message: "Internal Server Error: Room Code Undefined",
                    });
                    return;
                }
                //to optimize, we can probably just return parsedMessage, since we're not transforming or adding any new data. Just relaying
                sendMessageToRoom(roomCode, {
                    type: SocketResponse.Playlist,
                    playlist_uri: parsedMessage.playlist_uri,
                    playlist_indexes: parsedMessage.playlist_indexes,
                });
            } 
            else if (parsedMessage.type === SocketRequest.Correct && roomCode && user) {
                console.log(`Received Correct Request: ${JSON.stringify(parsedMessage)}`);
                
                if(!(user in userMap)) {
                    console.log("ERROR: CORRECT REQUEST RECEIVED FROM DISCONNECTED USER")
                    return
                }
                sendMessageToRoom(roomCode, parsedMessage);
                userMap[user].answered_correctly = true
                if(entireLobbyAnsweredCorrectly(roomCode))
                {
                    resetLobbyCorrectAnswerFlags(roomCode)
                    clearRoomInterval(roomCode)
                    sendMessageToRoom(roomCode, {type: SocketResponse.Continue})
                    setContinueInterval(roomCode, 30)
                }

            } 
            else {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(msg, { binary: isBinary });
                    }
                });
            }
        });

        ws.on("close", () => {
            console.log("Connection closed...");

            if (roomCode) {
                removeUserFromRoom(roomCode, ws);
            }
            userSocketMap.delete(ws);
            console.log(`${user} disconnected...`);
        });
    });
};
