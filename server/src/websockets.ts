import { Server } from "http";
import WebSocket, { WebSocketServer } from "ws";

export const configureWebsocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });

    const onSocketPostError = () => {
        console.log(`Error during Websocket Connection`);
    };

    wss.on("connection", (ws, req) => {
        console.log(`Websocket Connection established...`);

        ws.on("error", onSocketPostError);

        ws.on("message", (msg, isBinary) => {
            console.log(`Received Websocket Message: ${msg}`);

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(msg, { binary: isBinary });
                }
            });
        });

        ws.on("close", () => {
            console.log("Connection closed");
        });
    });
};