import { Request, Response } from "express";
import { authCookiesSchema, userCredentialsSchema } from "../schemas";
import { validateUser } from "../data/queries";
import { createJwt, jwtCookieOptions } from "../auth/jwt";

export const loginHandler = async (req: Request, res: Response) => {
    const {body} = req
    
    const parsedCookies = authCookiesSchema.safeParse(req.cookies)
    if(parsedCookies.success && parsedCookies.data.auth_token) {
        console.log(`Redirecting from /login to / from auth_token = ${parsedCookies.data.auth_token}`);
        res.redirect("/")
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
    res.cookie("auth_token", jwt, jwtCookieOptions)
    res.status(200).send("Successfully logged in.")
}