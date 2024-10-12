import { useSelector } from "react-redux";
import { RootState } from "../store/store";
export default function usePlaylistId() {
  return useSelector((state: RootState) => state.playlistIdState.playlistId);
}
