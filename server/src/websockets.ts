import { IncomingMessage, Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { rooms, userRoomMap } from "./handlers/roomHandler";

const getUserFromRequest = (req: IncomingMessage) => {
    const path = "http://localhost:3000"
    const url = new URL(path + req.url)
    return url.searchParams.get("user")
}

const userSocketMap = new Map<WebSocket, string>()

export const configureWebsocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });

    const onSocketPostError = () => {
        console.log(`Error during Websocket Connection`);
    };

    wss.on("connection", (ws, req) => {
        console.log(`Websocket Connection established...`);
        let roomCode: string | null = null
        const user = getUserFromRequest(req)
        if(!user) {
            ws.close()
            console.log(`User Undefined. Closing connection`);
            return 
        }
        userSocketMap.set(ws, user)

        ws.on("error", onSocketPostError);

        ws.on("message", (msg, isBinary) => {
            console.log(`Received Websocket Message: ${msg.toString()}`);
            const parsedMessage = JSON.parse(msg.toString())

            if (parsedMessage.type === 'join-room' && parsedMessage.roomCode) {
                //disgusting type cast to stop TS from crying. Is Zod validation really necessary
                roomCode = parsedMessage.roomCode as string;
                if (rooms[roomCode]) {
                  rooms[roomCode].users.add(ws);  
                  console.log(`User ${user} joined room ${roomCode}`);

                  const lobby = Array.from(rooms[roomCode].users).map(socket => userSocketMap.get(socket));

                  console.log(`${roomCode} Lobby: ${lobby}`);

                  ws.send(JSON.stringify({ type: 'room-joined', users: lobby }));

                  rooms[roomCode].users.forEach(socket => {
                    socket.send(JSON.stringify({type: "user-joined", user: user}))
                  })
                } else {
                  ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                }
              }
            else if(parsedMessage.type === "start-duel" && parsedMessage.roomCode) {
                rooms[parsedMessage.roomCode].users.forEach(socket => {
                    socket.send(JSON.stringify({type: "start-duel"}))
                })
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
                    console.log(`Deleting room ${roomCode}`);
                    delete rooms[roomCode]
                }
                else {
                    const room = Array.from(rooms[roomCode].users).map(socket => userSocketMap.get(socket));
                    rooms[roomCode].users.forEach(socket => {
                        socket.send(JSON.stringify({type: "room-update", room: room}))
                    })
                }
            }
            if(user && userRoomMap[user]) {
                console.log(`userRoomMap before DC: ${JSON.stringify(userRoomMap)}`);
                delete userRoomMap[user]
                console.log(`userRoomMap after DC: ${JSON.stringify(userRoomMap)}`);
                
            }

            // if(userSocketMap.has(ws)) {
            console.log(`userSocketMap Size Before: ${userSocketMap.size}`);
            userSocketMap.delete(ws)
            console.log(`userSocketMap Size After: ${userSocketMap.size}`);
            // }

            if(user) {
                console.log(`${user} disconnected...`);
            }
        });
    });
};