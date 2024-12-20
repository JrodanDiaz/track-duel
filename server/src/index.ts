import express from "express";
import cookieParser from 'cookie-parser'
import cors from "cors"
import { registerHandler } from "./handlers/register";
import { clearUsersHandler, getUsersHandler } from "./handlers/userHandler";
import { loginHandler } from "./handlers/login";
import { spotifyLoginHandler, spotifyCallbackHandler } from "./handlers/spotifyHandler";
import dotenv from "dotenv"
import { implicitLoginHandler } from "./handlers/implicit_login";
import { getTokenHandler } from "./auth/utils";
import { createPlaylistHandler, getSavedPlaylistsHandler, revealPlaylistsHandler } from "./handlers/playlistHandler";

dotenv.config()
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

app.get("/auth/getToken", getTokenHandler)

app.get("/users", getUsersHandler)
app.post("/users", clearUsersHandler)

app.post("/register", registerHandler)
app.post("/login", loginHandler)
app.get("/implicit_login", implicitLoginHandler)

app.get("/spotify", spotifyLoginHandler)
app.get('/auth/callback', spotifyCallbackHandler )

app.get("/playlist", getSavedPlaylistsHandler)
app.post("/playlist", createPlaylistHandler)
app.get("/playlists/reveal", revealPlaylistsHandler)


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  // console.log(`Testing ENV: ${process.env.SPOTIFY_CLIENT_ID}`);
  
});

/* 
user registers / logins, gets cookie with timeout
this cookie value is saved to react context, which will last until the browser is refreshed
once the browser is refreshed, we still have the cookie, but we have no way to reach it. 
  maybe, on page load, we can call a request to some api route, that will return us our cookie value if it exists, otherwise return ""
On the Front end, this context cookie will prevent the user from reaching protected routes (/account, /login, /register)
On the backend, we will read the REAL cookie from the request, which WILL expire
with this cookie we will decide whether or not to reveal actually sensitive information

*/