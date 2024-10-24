import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlaylistResponse } from "../../api/spotifyTypes";

type PlaylistState = PlaylistResponse

//ChatGPT is the goat for generating this
const initialState: PlaylistState = {
    images: [{ url: "" }],
    name: "",
    tracks: {
      items: [
        {
          track: {
            album: {
              images: [{ url: "" }],
              name: "",
            },
            artists: [{ name: "" }],
            name: "",
            uri: "",
          },
        },
      ],
    },
  };

  const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        updatePlaylist(state, action: PayloadAction<PlaylistResponse>) {
            state.images = action.payload.images
            state.name = action.payload.name
            state.tracks = action.payload.tracks
        }
    }
  })

  export const {updatePlaylist} = playlistSlice.actions
  export default playlistSlice.reducer

