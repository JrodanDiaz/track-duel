export const handleSpotifyRedirect = async () => {
    const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    if (!spotifyClientId) throw new Error("Spotify Client Id is undefined");

    const redirect_url = `${import.meta.env.VITE_BACKEND_URL}/auth/callback`;
    const scope =
      "streaming user-read-email user-read-private user-read-playback-state";

    const auth_query_params = new URLSearchParams({
      response_type: "code",
      client_id: spotifyClientId,
      scope: scope,
      redirect_uri: redirect_url,
    });

    window.location.href =
      "https://accounts.spotify.com/authorize/?" + auth_query_params.toString();
  };

  export const getSpotifyToken = (): string => {
    const token = localStorage.getItem("spotify-token")
    if(token) return token
    return ""
  }

  export const setSpotifyToken = (token: string) => {
    localStorage.setItem("spotify-token", token)
  }

