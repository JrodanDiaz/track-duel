import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";


interface PartialUser {
    username: string;
    authToken: string;
}

const initialState: User = {
    username: "",
    authToken: "",
    spotifyToken: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser(state, action: PayloadAction<User>){
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