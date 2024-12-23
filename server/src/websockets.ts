import { IncomingMessage, Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { rooms, userRoomMap } from "./handlers/roomHandler";

enum SocketRequest {
    JoinRoom = "join-room",
    LeaveRoom = "leave-room",
    StartDuel = "start-duel",
    SendPlaylist = "send-playlist",
    Answer = "answer"
}

enum SocketResponse {
    UserJoined = "user-joined",
    RoomJoined = "room-joined",
    Error = "error",
    StartDuel = "start-duel",
    LeftRoom = "left-room",
    Playlist = "playlist"
}

const userSocketMap = new Map<WebSocket, string>();

const sendMessage = (ws: WebSocket, message: Object) => {
    ws.send(JSON.stringify(message))
}

const getUserFromRequest = (req: IncomingMessage) => {
    const path = "http://localhost:3000";
    const url = new URL(path + req.url);
    return url.searchParams.get("user");
};

const sendMessageToRoom = (roomCode: string, message: Object) => {
    rooms[roomCode].users.forEach((socket) => {
        socket.send(JSON.stringify(message));
    });
};

const getUsersFromRoom = (roomCode: string) => {
    return Array.from(rooms[roomCode].users).map((socket) => userSocketMap.get(socket));
};

const removeUserFromRoom = (roomCode: string, socket: WebSocket) => {
    const user = userSocketMap.get(socket)
    if(!user) throw new Error("Error: Cannot remove user that is absent from UserSocketMap")
    if (rooms[roomCode]) {

        rooms[roomCode].users.delete(socket);
        console.log(`Removed ${user} from room ${roomCode}`);

        if (rooms[roomCode].users.size === 0) {
            delete rooms[roomCode];
            console.log(`Deleted empty room ${roomCode}`);
        } else {
            const room = getUsersFromRoom(roomCode);
            sendMessageToRoom(roomCode, { type: "room-update", room: room });
        }
    }
    if (userRoomMap[user]) {
        delete userRoomMap[user];
        console.log(`Deleted user's UserRoomMap: ${JSON.stringify(userRoomMap)}`);
    }

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

        ws.on("error", onSocketPostError);

        ws.on("message", (msg, isBinary) => {
            console.log(`Received Websocket Message: ${msg.toString()}`);
            const parsedMessage = JSON.parse(msg.toString());

            if (parsedMessage.type === SocketRequest.JoinRoom && parsedMessage.roomCode) {
                //disgusting type cast to stop TS from crying. Is Zod validation really necessary
                roomCode = parsedMessage.roomCode as string;
                if (rooms[roomCode]) {
                    rooms[roomCode].users.add(ws);
                    console.log(`User ${user} joined room ${roomCode}`);

                    const lobby = getUsersFromRoom(roomCode);

                    console.log(`${roomCode} Lobby: ${lobby}`);

                    const isHost = rooms[roomCode].users.size === 1
                    sendMessage(ws, {type: SocketResponse.RoomJoined, roomCode: roomCode, users: lobby, host: isHost})

                    sendMessageToRoom(roomCode, { type: SocketResponse.UserJoined, user: user });
                } else {
                    sendMessage(ws, {type: SocketResponse.Error, message: "Room not found"})
                }
            } else if (parsedMessage.type === SocketRequest.StartDuel && parsedMessage.roomCode) {
                sendMessageToRoom(parsedMessage.roomCode, {type: SocketResponse.StartDuel})
            } else if(parsedMessage.type === SocketRequest.LeaveRoom && roomCode) {
                removeUserFromRoom(roomCode, ws)
                sendMessage(ws, {type: SocketResponse.LeftRoom})
            } 
            else if(parsedMessage.type === SocketRequest.SendPlaylist) {
                if(!roomCode) {
                    sendMessage(ws, {type: SocketResponse.Error, message: "Internal Server Error: Room Code Undefined"})
                    return
                }
                //to optimize, we can probably just return parsedMessage, since we're not transforming or adding any new data. Just relaying
                sendMessageToRoom(roomCode, {type: SocketResponse.Playlist, playlist_uri: parsedMessage.playlist_uri, playlist_indexes: parsedMessage.playlist_indexes})
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
            
            if(roomCode) {
                removeUserFromRoom(roomCode, ws)
            }
            userSocketMap.delete(ws);
            console.log(`${user} disconnected...`);
        });
    });
};
