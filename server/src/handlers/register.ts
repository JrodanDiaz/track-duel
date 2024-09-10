import { Request, Response } from "express";
import { userCredentialsSchema } from "../schemas";
import { createTable, createUser } from "../data/queries";

export const registerHandler = async (req: Request, res: Response) => {
  const { body } = req
  const validBody = userCredentialsSchema.safeParse(body)

  if(!validBody.success || validBody.error) {
    res.status(400).send(JSON.stringify({errorMessage: "Invalid JSON Body"}))
    return
  }
  console.log(`we umm we have a good json where username = ${validBody.data.username} and password = ${validBody.data.password}`);

  await createTable();
  await createUser(validBody.data)
  console.log(`${validBody.data.username} was created`);
  res.status(200).send(`User created`);
}