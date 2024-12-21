import { PlaylistResponse } from "./api/spotifyTypes";
import { Track } from "./api/spotifyTypes";

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

export const generateRoomCode = (length = 6) => {
  let code = ""
  for(let i = 0; i < length; i++) {
    code +=  String.fromCharCode(65 + (Math.floor(Math.random() * 26)))
  }
  return code
}