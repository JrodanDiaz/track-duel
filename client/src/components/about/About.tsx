import BlackBackground from "../common/BlackBackground";
import Navbar from "../common/Navbar";

export default function About() {
    return (
        <BlackBackground>
            <Navbar />
            <div className="flex flex-col items-center justify-center p-4">
                <header className="text-6xl text-offwhite underline tracking-wide">
                    About
                </header>
                <p className="text-xl text-offwhite">AHHHHHHHHHHHHHHHHHHH</p>
                <p className="text-xl text-offwhite">AHHHHHHHHHHHHHHHHHHH</p>
                <p className="text-xl text-offwhite">AHHHHHHHHHHHHHHHHHHH</p>
                <p className="text-xl text-offwhite">AHHHHHHHHHHHHHHHHHHH</p>
                <img src="/fleshwater.jpg" height={400} width={900} />
            </div>
        </BlackBackground>
    );
}
