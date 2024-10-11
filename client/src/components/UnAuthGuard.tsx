import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useUser from "../hooks/useUser";

export default function UnAuthGuard({ element }: { element: JSX.Element }) {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    checkToken();
  }, [user]);

  const checkToken = () => {
    if (user.username && user.spotifyToken) {
      navigate("/");
    }
  };

  return <>{element}</>;
}
