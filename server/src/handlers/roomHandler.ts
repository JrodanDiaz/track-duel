import { Request, Response } from "express"
import { WebSocket } from "ws"

type DuelRoom = {
    users: Set<WebSocket>
}

type DuelRooms = {
    [roomCode: string]: DuelRoom
}

export const rooms: DuelRooms = {}

const generateRoomCode = (length = 6) => {
    let code = ""
    for(let i = 0; i < length; i++) {
      code +=  String.fromCharCode(65 + (Math.floor(Math.random() * 26)))
    }
    return code
  }

export const generateRoomHandler = async (req: Request, res: Response) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = { users: new Set() };
    res.status(200).json({ roomCode: roomCode });
}