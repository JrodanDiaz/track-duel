import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state/userState"
import { spotifyApiSlice } from "./api/playlistsApiSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        [spotifyApiSlice.reducerPath]: spotifyApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(spotifyApiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch