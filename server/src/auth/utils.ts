import { Request } from "express";
import { authCookiesSchema } from "../schemas";

export const isLoggedIn = (req: Request): boolean => {
    const parsedCookies = authCookiesSchema.safeParse(req.cookies)
    if(parsedCookies.success && parsedCookies.data.auth_token) {
        console.log(`Redirecting from /login to / from auth_token = ${parsedCookies.data.auth_token}`);
        return true
    }
    return false
}