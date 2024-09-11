import { Request, Response } from "express";
import { userCredentialsSchema } from "../schemas";
import { createUser} from "../data/queries";
import { createJwt, jwtCookieOptions } from "../auth/jwt";

export const registerHandler = async (req: Request, res: Response) => {
  const { body } = req
  const validBody = userCredentialsSchema.safeParse(body)

  if(!validBody.success || validBody.error) {
    console.log("Invalid JSON register body!");
    res.status(400).send(JSON.stringify({errorMessage: "Invalid JSON Body"}))
    return
  }

  await createUser(validBody.data)
  const jwt = createJwt(validBody.data.username);
  console.log(`JWT generated: ${jwt}`);
  
  res.cookie("auth-token", jwt, jwtCookieOptions)
  res.status(200).send(`User ${validBody.data.username} successfully created`);

}