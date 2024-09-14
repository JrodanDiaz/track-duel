import { Request, RequestHandler, Response } from "express";
import { authCookiesSchema } from "../schemas";

export const isLoggedIn = (req: Request): boolean => {
    const parsedCookies = authCookiesSchema.safeParse(req.cookies)
    if(parsedCookies.success && parsedCookies.data.auth_token) {
        console.log(`Redirecting from /login to / from auth_token = ${parsedCookies.data.auth_token}`);
        return true
    }
    return false
}

export const getToken = (req: Request) => {
    const parsedToken = authCookiesSchema.safeParse(req.cookies)
    if(!parsedToken.success){
        return "" 
    }
    return parsedToken.data.auth_token
}

export const getTokenHandler = (req: Request, res: Response) => {
    const token = getToken(req)
    if(!token) {
        res.json({errorMessage: "Auth token not set"})
        return
    }
    res.json({auth_token: token})
}

export const respondWithError = (res: Response, code: number, message: string) => {
    res.status(code).json({errorMessage: message})
}