import { Request, Response } from "express";

export const handleSignOut = (req: Request, res: Response) => {
    res.clearCookie('authToken', { httpOnly: true, secure: false, sameSite: 'none' });
    res.status(200).send({ message: 'Successfully logged out' });
  }