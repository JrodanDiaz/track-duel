interface Props {
    content: string;
    className?: string;
    reverse?: boolean;
}
export default function Marquee({ content, className = "", reverse = false }: Props) {
    return (
        <>
            <div className={`w-full overflow-hidden whitespace-nowrap  ${className}`}>
                <div
                    className={`w-full whitespace-nowrap font-bebas ${
                        reverse ? "animate-marquee" : "animate-reverseMarquee"
                    }`}
                >
                    {content}
                </div>
            </div>
        </>
    );
}
