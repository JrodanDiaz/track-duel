import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSpotifyToken, SpotifyApiEndpoint } from "../../api/spotify";
import { PlaylistQuery } from "../../types";
import { PlaylistResponse, PlaylistMinimumResponse } from "../../api/spotifyTypes";

const playlistEssentialsFields = "name,images(url),tracks.items(track(uri,name,artists(name),album(name,images(url))))"
const playlistMinimumFields = "name,images(url)"

export const spotifyApiSlice = createApi({
  reducerPath: "spotifyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SpotifyApiEndpoint,
    headers: {Authorization: `Bearer ${getSpotifyToken()}`}
  }),
  endpoints: (builder) => ({
    getPlaylist: builder.query<any, PlaylistQuery>({
      query: (playlistQuery) => playlistQuery.fields ? `/playlists/${playlistQuery.playlist_id}?fields=${playlistQuery.fields}` : `/playlists/${playlistQuery.playlist_id}`
    }),
    getPlaylistMinimum: builder.query<PlaylistMinimumResponse, string>({
        query: (playlist_id) => `/playlists/${playlist_id}?fields=${playlistMinimumFields}`
    }),
    getPlaylistEssentials: builder.query<PlaylistResponse, string>({
        query: (playlist_id) => `/playlists/${playlist_id}?fields=${playlistEssentialsFields}`
    })
  }),
});

export const {useGetPlaylistQuery, useGetPlaylistEssentialsQuery, useGetPlaylistMinimumQuery} = spotifyApiSlice
