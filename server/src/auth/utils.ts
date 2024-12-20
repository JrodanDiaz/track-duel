import { Request,  Response } from "express";
import { authCookiesSchema, jwtPayload } from "../schemas";
import jwt from "jsonwebtoken";

export const isLoggedIn = (req: Request): boolean => {
    const parsedCookies = authCookiesSchema.safeParse(req.cookies)
    if(parsedCookies.success && parsedCookies.data.authToken) {
        console.log(`Redirecting from /login to / from auth_token = ${parsedCookies.data.authToken}`);
        return true
    }
    return false
}

export const getToken = (req: Request) => {
    const parsedToken = authCookiesSchema.safeParse(req.cookies)
    if(!parsedToken.success){
        return "" 
    }
    return parsedToken.data.authToken
}

export const getTokenHandler = (req: Request, res: Response) => {
    const token = getToken(req)
    if(!token) {
        res.json({errorMessage: "Auth token not set"})
        return
    }
    res.json({authToken: token})
}

export const respondWithError = (res: Response, code: number, message: string) => {
    res.status(code).json({errorMessage: message})
}

export const getUserIdFromCookie =  (req: Request, res: Response): [success: boolean, id: number | null] => {
    const token = getToken(req);
   if (!token) {
     respondWithError(res, 401, "Auth Token not set.");
     return [false, null];
   }
 
   const jwtKey = process.env.JWT_SECRET;
   if (!jwtKey) {
     respondWithError(res, 500, "Internal Server Error (env)");
     return [false, null];
   }
   
   let userId: number | undefined;
 
    jwt.verify(token, jwtKey, (err, decoded) => {
     if (err) {
       respondWithError(res, 500, err.message);
       return;
     }
     if (!decoded) {
       respondWithError(res, 500, "Interal Server Error (no decoded JWT");
       return;
     }
 
     const decodedJwt = jwtPayload.safeParse(decoded);
     if (!decodedJwt.success) {
       console.log(`Error zod parsing jwt decoded: ${decodedJwt.error}`);
       respondWithError(res, 500, "Internal Server Error (decoding JWT)");
       return;
     }
     userId = decodedJwt.data.id
   });
 
   if(userId === undefined) {
     return [false, null]
   }
 
   return [true, userId]
 }