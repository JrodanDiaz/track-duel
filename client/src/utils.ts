import { PlaylistResponse } from "./api/spotifyTypes";
import { Track } from "./api/spotifyTypes";

export const getRandomPlaylistIndexes = (playlistLength: number, amount = 3) => {
  const indexes = new Set<number>()
  while(indexes.size < amount) {
    indexes.add(Math.floor(Math.random() * playlistLength))
  }
  return [...indexes]
}

export const getSongsFromIndexes = (playlistIndexes: number[], playlist: PlaylistResponse) => {
  const tracks: Track[] = playlistIndexes.map(index => playlist.tracks.items[index].track)
  return tracks
}

export const getRandomSongSelection = (
    immutablePlaylist: PlaylistResponse,
    amount = 3
  ): Track[] => {
    const playlist = JSON.parse(JSON.stringify(immutablePlaylist));
    const selection: Track[] = [];
    for (let i = 0; i < amount; i++) {
      const randomIndex = Math.floor(Math.random() * playlist.tracks.items.length);
      const randomTrack = playlist.tracks.items[randomIndex].track;
      playlist.tracks.items.splice(randomIndex, 1);
      selection.push(randomTrack);
    }
    console.log(selection);
    return selection;
  };
