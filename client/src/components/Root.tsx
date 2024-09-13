import { Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div className="flex gap-4">
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
        <div className="border-black border-[1px] rounded-sm p-3">
          <Link to="/spotify">Login with Spotify</Link>
        </div>
      </div>
    </>
  );
}
