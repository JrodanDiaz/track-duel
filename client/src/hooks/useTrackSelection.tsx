import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function useTrackSelection() {
  return useSelector((state: RootState) => state.trackSelection.tracks);
}
