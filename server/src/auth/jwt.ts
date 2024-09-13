import jwt from "jsonwebtoken"

export const createJwt = (username: string) => {
    return jwt.sign({subject: username}, "secret", {expiresIn: '15m'})
}

export const jwtCookieOptions = {
    maxAge: 1000 * 60 * 15, 
    secure: false,
    httpOnly: true,
}