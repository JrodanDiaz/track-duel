import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import useUser from "../hooks/useUser";
import useAppDispatch from "../hooks/useAppDispatch";
import Player from "./Player";
import PlaylistsContainer from "./PlaylistsContainer";
import TrackSearchResult from "./TrackSearchResult";
import { Track } from "../types";
import { test_uris } from "../playlists";
import { isLoggedIn } from "../api/auth";
import { getSpotifyToken } from "../api/spotify";
import { useGetPlaylistEssentialsQuery } from "../store/api/playlistsApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { updatePlaylist } from "../store/state/playlistState";
import { useNavigate } from "react-router-dom";
import { getRandomSongSelection } from "../utils";
import { updateTracks } from "../store/state/trackSelectionState";

export default function Play() {
  const user = useUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isLoggedIn(user)) {
    window.location.href = "/";
    return;
  }

  const [search, setSearch] = useState<string>("");
  const [play, setPlay] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track>();
  const [selectedPlaylistUri, setSelectedPlaylistUri] = useState<string | undefined>();
  const [confirmedPlaylistUri, setConfirmedPlaylistUri] = useState<string | undefined>();

  const {
    data: playlistData,
    isLoading,
    isSuccess,
  } = useGetPlaylistEssentialsQuery(confirmedPlaylistUri ?? skipToken);

  if (isSuccess) {
    dispatch(updatePlaylist(playlistData));
    const randomSelection = getRandomSongSelection(playlistData);
    dispatch(updateTracks(randomSelection));
    navigate("/duel");
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: import.meta.env.SPOTIFY_CLIENT_ID,
  });
  spotifyApi.setAccessToken(getSpotifyToken());

  function chooseTrack(track: Track) {
    setPlayingTrack(track);
    setSearch("");
  }

  useEffect(() => {
    if (!search) return setSearchResults([]);
    const timerId = setTimeout(() => {
      spotifyApi.searchTracks(search, { limit: 5 }).then((res) => {
        if (!res?.body?.tracks) return;
        setSearchResults(
          res.body.tracks.items.map((track) => {
            return {
              cover: track.album.images[0].url,
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
            };
          })
        );
      });
    }, 500);
    return () => clearTimeout(timerId);
  }, [search]);

  let content: React.ReactNode;

  content = (
    <div className=" w-full flex flex-col gap-10 justify-center items-center">
      <h1 className=" text-6xl text-offwhite text-pretty text-center">
        Choose your Track, {user.username}
      </h1>
      <h1 className="text-3xl text-offwhite font-protest"></h1>
      <PlaylistsContainer
        className="flex flex-wrap p-2"
        uris={test_uris}
        setPlaylistUri={setSelectedPlaylistUri}
      />
      {selectedPlaylistUri && (
        <>
          <button
            onClick={() => setConfirmedPlaylistUri(selectedPlaylistUri)}
            className=" px-3 py-5 border-2 border-main-green text-main-green font-bold hover:text-main-black hover:bg-main-green"
          >
            {isLoading ? "Loading" : "Lock In Playlist"}
          </button>
        </>
      )}
      {playlistData && (
        <h1 className="text-xl text-lilac">Locked in playlist: {playlistData.name}</h1>
      )}
      <input
        type="text"
        placeholder="Enter track..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=" bg-main-black border-[1px] text-offwhite text-xl border-offwhite px-3 py-2 rounded-sm focus:outline-none"
      />

      {playingTrack && !search && (
        <>
          <h1 className=" text-3xl text-orangey text-pretty">
            Current Track: {playingTrack.title} by {playingTrack.artist}
          </h1>
          {playingTrack.cover && (
            <img src={playingTrack.cover} height={200} width={200} />
          )}
        </>
      )}
      <div className={`${!playingTrack || search ? "hidden" : ""}`}>
        <Player
          accessToken={getSpotifyToken()}
          trackUri={playingTrack?.uri}
          play={play}
          setPlay={setPlay}
        />
      </div>
      <div className="flex flex-wrap justify-evenly w-3/5">
        {searchResults.map((track, i) => (
          <TrackSearchResult
            track={track}
            key={`${i}-${track.title}`}
            chooseTrack={chooseTrack}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className=" w-screen h-screen bg-main-black py-4 md:py-12 overflow-y-auto">
      {content}
    </div>
  );
}
