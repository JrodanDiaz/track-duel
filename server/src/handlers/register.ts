import { Request, Response } from "express";
import { userCredentialsSchema } from "../schemas";
import { createUser} from "../data/queries";
import { createJwt, jwtCookieOptions } from "../auth/jwt";

export const registerHandler = async (req: Request, res: Response) => {
  const { body } = req
  const validBody = userCredentialsSchema.safeParse(body)

  if(!validBody.success || validBody.error) {
    console.log("Invalid JSON register body!");
    res.status(400).json({errorMessage: "Invalid JSON Request"})
    return
  }

  const userCreated = await createUser(validBody.data)
  if(!userCreated) {
    res.status(409).send("User already exists")
    return
  }
  const jwt = createJwt(validBody.data.username);
  console.log(`JWT generated: ${jwt}`);
  
  res.cookie("authToken", jwt, jwtCookieOptions)
  res.status(200).json({authToken: jwt})

}