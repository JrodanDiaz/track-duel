import { Request, Response } from "express";
import { getToken, respondWithError } from "../auth/utils";
import jwt from "jsonwebtoken"

export const implicitLoginHandler = (req: Request, res: Response) => {
    const token = getToken(req)
    if(!token) {
        respondWithError(res, 400, "Auth Token not set.")
        return
    }

    const jwtKey = process.env.JWT_SECRET
    if(!jwtKey) {
        respondWithError(res, 400, "Internal Server Error (env)")
        return
    } 

    jwt.verify(token, jwtKey, (err, decoded) => {
        if(err) {
            respondWithError(res, 400, err.message)
            return
        }
        if(!decoded) {
           respondWithError(res, 400, "Interal Server Error (no decoded JWT")
           return
        }
        res.status(200).json({authToken: token, username: decoded.sub})
    })
}