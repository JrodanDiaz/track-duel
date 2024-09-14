import { Link } from "react-router-dom";
import { useUserContext } from "./UserContext";

export default function Root() {
  const user = useUserContext()

  return (
    <>
      <div className="flex gap-4">
        <h1>Hello glorious daddy {user.username}</h1>
        <div className="border-black border-[1px] rounded-sm p-3">
          <h1>wsg gang</h1>
        </div>
        <div className="border-black border-[1px] rounded-sm p-3">
          <h1>wsg gang</h1>
        </div>
        <div className="border-black border-[1px] rounded-sm p-3">
          <Link to="/register">Register</Link>
        </div>
        <div className="border-black border-[1px] rounded-sm p-3">
          <Link to="/login">login</Link>
        </div>
      </div>
    </>
  );
}
