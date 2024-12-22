import { generateRoomCodeSchema } from "../schemas"

export const generateRoomCode = async (user: string): Promise<string | undefined> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-room?user=${user}`)
    if(!response.ok) return 

    const parsedResponse = generateRoomCodeSchema.safeParse(await response.json())
    if(!parsedResponse.success) {
        console.log(`Error parsing room code response: ${parsedResponse.error}`);
        return 
    }
    return parsedResponse.data.roomCode
}