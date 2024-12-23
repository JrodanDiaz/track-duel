import jwt from "jsonwebtoken"

export const createJwt = (username: string, userId: number) => {
    return jwt.sign({sub: username, id: userId}, "secret", {expiresIn: '60m'})
}

export const jwtCookieOptions = {
    maxAge: 1000 * 60 * 60, 
    secure: false,
    httpOnly: true,
}