import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track } from "../../api/spotifyTypes";

interface TrackSelectionState {
  tracks: Track[];
}

const initialState: TrackSelectionState = {
  tracks: [
    {
      album: {
        images: [{ url: "" }],
        name: "",
      },
      artists: [{ name: "" }],
      name: "",
      uri: "",
    },
  ],
};

const trackSelectionSlice = createSlice({
  name: "trackSelection",
  initialState,
  reducers: {
    updateTracks(state, action: PayloadAction<Track[]>) {
      state.tracks = action.payload;
    },
  },
});

export const { updateTracks } = trackSelectionSlice.actions;
export default trackSelectionSlice.reducer;
