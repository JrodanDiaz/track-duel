import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

interface UserState {
    username: string;
    authToken: string;
    spotifyToken: string;
}

interface PartialUser {
    username: string;
    authToken: string;
}

const initialState: UserState = {
    username: "pleasework",
    authToken: "",
    spotifyToken: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser(state, action: PayloadAction<UserState>){
            return {...state, ...action.payload}
        },
        authenticateUser(state, action: PayloadAction<PartialUser>)  {
            return {...action.payload, spotifyToken: state.spotifyToken}
        },
        authenticateSpotify(state, action: PayloadAction<string>) {
            state.spotifyToken = action.payload
        }
    }
})

export const {updateUser, authenticateUser, authenticateSpotify} = userSlice.actions
export default userSlice.reducer