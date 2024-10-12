import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface playlistIdState {
    playlistId: string | undefined
}

const initialState: playlistIdState = {
    playlistId: undefined
}

const playlistIdSlice = createSlice({
    name: "playlistId",
    initialState,
    reducers: {
        updatePlaylistId(state, action: PayloadAction<playlistIdState> ){
            state.playlistId = action.payload.playlistId
        }
    }
})

export const {updatePlaylistId} = playlistIdSlice.actions
export default playlistIdSlice.reducer