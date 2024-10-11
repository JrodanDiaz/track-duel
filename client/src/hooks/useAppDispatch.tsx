import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";

export default function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
