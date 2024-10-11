import SpotifyWebApi from "spotify-web-api-node";
import { Track } from "../types";
import { useEffect, useState } from "react";
import Player from "./Player";
import PlaylistsContainer from "./PlaylistsContainer";
import TrackSearchResult from "./TrackSearchResult";
import { test_uris } from "../playlists";

export default function Play() {
  const spotifyToken = localStorage.getItem("spotify-token");
  if (!spotifyToken) {
    window.location.href = "/";
    return;
  }

  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track>();

  const spotifyApi = new SpotifyWebApi({
    clientId: import.meta.env.SPOTIFY_CLIENT_ID,
  });
  spotifyApi.setAccessToken(spotifyToken);

  function chooseTrack(track: Track) {
    setPlayingTrack(track);
    setSearch("");
  }

  useEffect(() => {
    if (!search) return setSearchResults([]);
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
  }, [search]);

  //this is lowkey working, just need to get the track uri's and call it a day
  // spotifyApi.getPlaylist("5jKkHPUXGZHitWujNXQREE").then((data) => {
  //     console.log(`playlist data: ${JSON.stringify(data.body.tracks)}`);
  // })

  return (
    <>
      <div className=" w-screen h-screen bg-main-black py-4 md:py-12 overflow-y-auto">
        <div className=" w-full flex flex-col gap-10 justify-center items-center">
          <h1 className=" text-6xl text-offwhite text-pretty text-center">
            Choose your Track
          </h1>
          <PlaylistsContainer
            className="flex flex-wrap p-2"
            uris={test_uris}
            spotifyApi={spotifyApi}
          />
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
            <Player accessToken={spotifyToken} trackUri={playingTrack?.uri} />
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
      </div>
    </>
  );
}
