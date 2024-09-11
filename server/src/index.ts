import express from "express";
import cookieParser from 'cookie-parser'
import { registerHandler } from "./handlers/register";
import { clearUsersHandler, getUsersHandler } from "./handlers/userHandler";

const app = express();
const port = 3000;

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server hello");
  console.log("GET request from home route received");
});

app.get("/users", getUsersHandler)
app.post("/users", clearUsersHandler)



app.post("/register", registerHandler)


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
