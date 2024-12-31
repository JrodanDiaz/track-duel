import { Request, Response } from "express"
import { WebSocket } from "ws"
import { respondWithError } from "../auth/utils"
import {  deleteRoom } from "../websockets"

type DuelRoom = {
    users: Set<WebSocket>,
    interval_id: NodeJS.Timeout | null
}

type DuelRooms = {
    [roomCode: string]: DuelRoom
}

type UserMap = {
  [username: string]: {
    roomCode: string,
    answered_correctly: boolean
  }
}

export const rooms: DuelRooms = {}
export const userMap: UserMap = {}

const generateRoomCode = (length = 6) => {
    let code = ""
    for(let i = 0; i < length; i++) {
      code +=  String.fromCharCode(65 + (Math.floor(Math.random() * 26)))
    }
    return code
  }

export const generateRoomHandler = async (req: Request, res: Response) => {
  let user = req.query.user
  if(user === undefined || user.length === 0) {
    respondWithError(res, 400, "User Unspecified")
    return
  }
  user = user as string
  

  //if this user already has a generated room, delete it before adding new one
  if(userMap[user]?.roomCode) {
    const roomCode = userMap[user].roomCode
    deleteRoom(roomCode)
  }


    const roomCode = generateRoomCode();
    rooms[roomCode] = { users: new Set(), interval_id: null };
    userMap[user] = {roomCode: roomCode, answered_correctly: false}
    console.log(`Rooms: ${Object.keys(rooms)}`);
    
    res.status(200).json({ roomCode: roomCode });
}