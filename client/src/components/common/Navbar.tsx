import { Link } from "react-router-dom";
import useUser from "../../hooks/useUser";

export const NavbarLink = ({
    to,
    content,
    className = "",
}: {
    to: string;
    content: string;
    className?: string;
}) => {
    return (
        <Link
            to={to}
            className={`text-offwhite text-xl font-lato relative group ${className}`}
        >
            {content}
            <div className="absolute top-10 w-full h-0.5 h-1 bg-white/80 scale-x-0 group-hover:scale-x-100 transition-all duration-200  group-hover:bg-main-green/80"></div>
        </Link>
    );
};

export default function Navbar() {
    const user = useUser();

    return (
        <nav className="border-[1px] border-gray-900 w-full flex justify-between items-center p-2 transition-colors duration-500 hover:border-b-main-green">
            <div className="text-6xl text-main-green font-bebas w-3/5 pl-16">
                TRACK DUEL
            </div>
            <NavbarLink to="/" content="Home" />
            <NavbarLink to="/about" content="About" />
            <NavbarLink to="/leaderboard" content="Leaderboard" />
            {user.username && user.spotifyToken ? (
                <NavbarLink to="/profile" content="Profile" />
            ) : (
                <NavbarLink to="/login" content="Login" className="  text-lilac" />
            )}
            <div></div>
            {/* <Link to={"/profile"} className={`text-offwhite text-xl font-lato`}>
                Profile
            </Link>
            <Link to={"/about"} className={`text-offwhite text-xl font-lato`}>
                About
            </Link>
            <Link
                to={"/leaderboard"}
                className={`text-offwhite text-xl font-lato relative group`}
            >
                Leaderboard
                <div className="absolute w-full h-0.5 bg-white/80 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </Link> */}
        </nav>
    );
}
