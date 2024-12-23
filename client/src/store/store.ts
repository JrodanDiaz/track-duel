import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state/userState"
import playlistIdReducer from "./state/playlistIdState"
import { spotifyApiSlice } from "./api/playlistsApiSlice";
import playlistReducer from "./state/playlistState"
import trackSelectionReducer from "./state/trackSelectionState"

export const store = configureStore({
    reducer: {
        user: userReducer,
        playlistState: playlistReducer,
        playlistIdState: playlistIdReducer,
        trackSelection: trackSelectionReducer,
        [spotifyApiSlice.reducerPath]: spotifyApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(spotifyApiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch