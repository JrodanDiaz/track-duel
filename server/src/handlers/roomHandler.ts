import { Request, Response } from "express"
import { WebSocket } from "ws"
import { respondWithError } from "../auth/utils"

type DuelRoom = {
    users: Set<WebSocket>
}

type DuelRooms = {
    [roomCode: string]: DuelRoom
}

type UserRoomMap = {
  [username: string]: string
}

export const rooms: DuelRooms = {}
export const userRoomMap: UserRoomMap = {}

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
  if(userRoomMap[user]) {
    delete rooms[userRoomMap[user]]
  }


    const roomCode = generateRoomCode();
    rooms[roomCode] = { users: new Set() };
    userRoomMap[user] = roomCode
    console.log(`Rooms: ${JSON.stringify(rooms)}`);
    
    res.status(200).json({ roomCode: roomCode });
}