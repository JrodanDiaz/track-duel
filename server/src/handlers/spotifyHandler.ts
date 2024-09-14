import { Request, Response } from "express"
import { SpotifyAuthRes, spotifyTokenSchema } from "../schemas"

const redirect_url = "http://localhost:3000/auth/callback"

export const spotifyLoginHandler = (req: Request, res: Response) => {
    const spotifyClientId = process.env.SPOTIFY_CLIENT_ID
    if(!spotifyClientId) throw new Error("Internal Server Error (env)")

    const scope = "streaming user-read-email user-read-private user-read-playback-state";
    const auth_query_params = new URLSearchParams({
        response_type: "code",
        client_id: spotifyClientId,
        scope: scope,
        redirect_uri: redirect_url,
    });

  console.log(`spotifyLoginHandler: Redirecting to callback`);
    

  res.redirect("https://accounts.spotify.com/authorize/?" + auth_query_params.toString())
}

export const spotifyCallbackHandler = async (req: Request, res: Response) => {

  var code = req.query.code || null;

  if (code === null) {
    console.log("state or code is null");
    res.status(400).redirect("/")
  } else {
    console.log(`callback, code = ${code}`);
    
    const spotifyAuthResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: new URLSearchParams({
        code: code as string,
        redirect_uri: redirect_url,
        grant_type: "authorization_code",
      }),
      headers: {
        Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
         

    if(!spotifyAuthResponse.ok) {
        console.log("Spotify auth response !ok status = " + spotifyAuthResponse.status);
        return
    }

    const parsedSpotifyResponse = spotifyTokenSchema.safeParse(await spotifyAuthResponse.json())
    if(!parsedSpotifyResponse.success){
        console.log("Spotify Response JSON failed zod validation");
        return
    }
    console.log(`we got the access token: ${parsedSpotifyResponse.data.access_token}`);
    res.status(200).send("W")
  }
;
} 