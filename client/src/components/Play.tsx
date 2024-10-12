import SpotifyWebApi from "spotify-web-api-node";
import { Track } from "../types";
import { useEffect, useState } from "react";
import Player from "./Player";
import PlaylistsContainer from "./PlaylistsContainer";
import TrackSearchResult from "./TrackSearchResult";
import { test_uris } from "../playlists";
import useUser from "../hooks/useUser";
import { isLoggedIn } from "../api/auth";
import { getSpotifyToken } from "../api/spotify";
import { useGetPlaylistEssentialsQuery } from "../store/api/playlistsApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import useAppDispatch from "../hooks/useAppDispatch";
import { updatePlaylistId } from "../store/state/playlistIdState";
import usePlaylistId from "../hooks/usePlaylistId";

export default function Play() {
  const user = useUser();
  const playlistIdStore = usePlaylistId();
  if (!isLoggedIn(user)) {
    window.location.href = "/";
    return;
  }

  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<Track>();
  const [selectedPlaylistUri, setSelectedPlaylistUri] = useState<
    string | undefined
  >();

  const {
    data: playlistData,
    isLoading,
    isError,
  } = useGetPlaylistEssentialsQuery(selectedPlaylistUri ?? skipToken);

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

  //this is lowkey working, just need to get the track uri's and call it a day
  // spotifyApi.getPlaylist("5jKkHPUXGZHitWujNXQREE").then((data) => {
  //     console.log(`playlist data: ${JSON.stringify(data.body.tracks)}`);
  // })

  let content: React.ReactNode;

  if (playlistData) {
    dispatch(updatePlaylistId({ playlistId: selectedPlaylistUri }));
    content = (
      <>
        <img src={playlistData.images[0].url} height={200} width={200} />
        <h1 className=" text-xl text-offwhite">{playlistData.name}</h1>
        {playlistData.tracks.items.map((item) => (
          <p className=" text-xl text-offwhite">
            {item.track.name} by {item.track.artists[0].name}
          </p>
        ))}
        {playlistIdStore && <p>playlist Id store: {playlistIdStore}</p>}
      </>
    );
  }

  if (playlistData === undefined) {
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
  }

  return (
    <div className=" w-screen h-screen bg-main-black py-4 md:py-12 overflow-y-auto">
      {content}
    </div>
  );

  // return (
  //   <>
  //     <div className=" w-screen h-screen bg-main-black py-4 md:py-12 overflow-y-auto">
  //       <div className=" w-full flex flex-col gap-10 justify-center items-center">
  //         <h1 className=" text-6xl text-offwhite text-pretty text-center">
  //           Choose your Track, {user.username}
  //         </h1>
  //         {playlistData && (
  //           <>
  //             <img src={playlistData.images[0].url} height={100} width={100} />
  //             <h1 className=" text-2xl text-offwhite">{playlistData.name}</h1>
  //           </>
  //         )}
  //         <h1 className="text-3xl text-offwhite font-protest"></h1>
  //         {isLoading && (
  //           <h1 className="text-3xl text-offwhite font-protest">LOADING</h1>
  //         )}
  //         {isError && (
  //           <h1 className="text-3xl text-red-600 font-protest">ERROR</h1>
  //         )}

  //         <PlaylistsContainer
  //           className="flex flex-wrap p-2"
  //           uris={test_uris}
  //           setPlaylistUri={setSelectedPlaylistUri}
  //         />
  //         <input
  //           type="text"
  //           placeholder="Enter track..."
  //           value={search}
  //           onChange={(e) => setSearch(e.target.value)}
  //           className=" bg-main-black border-[1px] text-offwhite text-xl border-offwhite px-3 py-2 rounded-sm focus:outline-none"
  //         />

  //         {playingTrack && !search && (
  //           <>
  //             <h1 className=" text-3xl text-orangey text-pretty">
  //               Current Track: {playingTrack.title} by {playingTrack.artist}
  //             </h1>
  //             {playingTrack.cover && (
  //               <img src={playingTrack.cover} height={200} width={200} />
  //             )}
  //           </>
  //         )}
  //         <div className={`${!playingTrack || search ? "hidden" : ""}`}>
  //           <Player
  //             accessToken={getSpotifyToken()}
  //             trackUri={playingTrack?.uri}
  //           />
  //         </div>
  //         <div className="flex flex-wrap justify-evenly w-3/5">
  //           {searchResults.map((track, i) => (
  //             <TrackSearchResult
  //               track={track}
  //               key={`${i}-${track.title}`}
  //               chooseTrack={chooseTrack}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
