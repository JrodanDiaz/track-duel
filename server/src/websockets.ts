import { Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { rooms } from "./handlers/roomHandler";

export const configureWebsocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });

    const onSocketPostError = () => {
        console.log(`Error during Websocket Connection`);
    };

    wss.on("connection", (ws, req) => {
        console.log(`Websocket Connection established...`);
        let roomCode: string | null = null

        ws.on("error", onSocketPostError);

        ws.on("message", (msg, isBinary) => {
            console.log(`Received Websocket Message: ${msg}`);
            const parsedMessage = JSON.parse(msg.toString())

            if (parsedMessage.type === 'join-room' && parsedMessage.roomCode) {
                //disgusting type cast to stop TS from crying. Is Zod validation really necessary
                roomCode = parsedMessage.roomCode as string;
                if (rooms[roomCode]) {
                  rooms[roomCode].users.add(ws);  // Add the user to the room
                  ws.send(JSON.stringify({ type: 'room-joined', roomCode: roomCode }));
                } else {
                  ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
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
            console.log("Connection closed");
            
            if(roomCode && rooms[roomCode]) {
                console.log(`Room Before: ${rooms[roomCode].users.size}`);
                rooms[roomCode].users.delete(ws)
                console.log(`Room After: ${rooms[roomCode].users.size}`);
                if(rooms[roomCode].users.size === 0) {
                    delete rooms[roomCode]
                }
            }
        });
    });
};