import { IncomingMessage, Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { rooms, userRoomMap } from "./handlers/roomHandler";

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

            if (parsedMessage.type === "join-room" && parsedMessage.roomCode) {
                //disgusting type cast to stop TS from crying. Is Zod validation really necessary
                roomCode = parsedMessage.roomCode as string;
                if (rooms[roomCode]) {
                    rooms[roomCode].users.add(ws);
                    console.log(`User ${user} joined room ${roomCode}`);

                    const lobby = getUsersFromRoom(roomCode);

                    console.log(`${roomCode} Lobby: ${lobby}`);

                    sendMessage(ws, {type: "room-joined", users: lobby})

                    sendMessageToRoom(roomCode, { type: "user-joined", user: user });
                } else {
                    sendMessage(ws, {type: "error", message: "Room not found"})
                }
            } else if (parsedMessage.type === "start-duel" && parsedMessage.roomCode) {
                sendMessageToRoom(parsedMessage.roomCode, {type: "start-duel"})
            } else {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(msg, { binary: isBinary });
                    }
                });
            }
        });

        ws.on("close", () => {
            console.log("Connection closed...");
            userSocketMap.delete(ws);

            if (roomCode && rooms[roomCode]) {

                rooms[roomCode].users.delete(ws);
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

            console.log(`${user} disconnected...`);
        });
    });
};
