import express from "express";
import cookieParser from 'cookie-parser'
import cors from "cors"
import { registerHandler } from "./handlers/register";
import { clearUsersHandler, getUsersHandler } from "./handlers/userHandler";
import { loginHandler } from "./handlers/login";
import { spotifyLoginHandler, spotifyCallbackHandler } from "./handlers/spotifyHandler";
import "dotenv/config"

const app = express();
const port = 3000;

var corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  console.log("GET request from home route received");
  res.send("Express + TypeScript Server hello");
});

app.get("/users", getUsersHandler)
app.post("/users", clearUsersHandler)


app.post("/register", registerHandler)
app.post("/login", loginHandler)

app.get("/spotify", spotifyLoginHandler)
app.get('/auth/callback', spotifyCallbackHandler )


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
