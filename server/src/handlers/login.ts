import { Request, Response } from "express";
import { authCookiesSchema, userCredentialsSchema } from "../schemas";
import { validateUser } from "../data/queries";
import { createJwt, jwtCookieOptions } from "../auth/jwt";
import { isLoggedIn } from "../auth/utils";

export const loginHandler = async (req: Request, res: Response) => {
    const {body} = req
    
    if(isLoggedIn(req)) {
        res.sendStatus(307)
        return
    }
    
    const parsedBody = userCredentialsSchema.safeParse(body)
    if(!parsedBody.success || parsedBody.error) {
        res.status(400).send("Invalid JSON request")
        return
    }

    const loginSuccess = await validateUser(parsedBody.data)
    if(!loginSuccess){
        res.status(401).send("Invalid credentials")
        return
    }
    
    const jwt = createJwt(parsedBody.data.username)
    res.cookie("authToken", jwt, jwtCookieOptions)
    res.status(200).json({authToken: jwt, username: parsedBody.data.username})
}