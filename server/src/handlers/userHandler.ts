import { Request, Response } from "express";
import { clearTable, getUsers } from "../data/queries";

export const getUsersHandler = async (req: Request, res: Response) => {
    const users = await getUsers();
    if("errorMessage" in users){
        res.status(400).send("Internal Server Error")
        return
    }
    res.status(200).send(JSON.stringify(users))
}

export const clearUsersHandler = async (req: Request, res: Response) => {
    await clearTable();
    res.status(200).send("Users table successfully cleared")
}