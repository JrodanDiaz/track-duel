import express from "express";
import { userCredentialsSchema } from "./schemas";

const app = express();
const port = 3000;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server hello");
  console.log("GET request from home route received.");
});

app.post("/register", (req, res) => {
  const { body } = req
  const validBody = userCredentialsSchema.safeParse(body)
  if(!validBody.success || validBody.error) {
    res.status(400).send(JSON.stringify({errorMessage: "Invalid JSON Body"}))
    return
  }
  console.log(`we have a good json where username = ${validBody.data.username} and password = ${validBody.data.password}`);
})


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
