interface Props {
    content: string;
    className?: string;
    reverse?: boolean;
}
export default function Marquee({ content, className = "", reverse = false }: Props) {
    return (
        <>
            <div
                className={`w-full overflow-hidden whitespace-nowrap animate-marquee ${
                    reverse ? "animate-marquee" : "animate-reverseMarquee"
                } ${className}`}
            >
                {content}
            </div>
        </>
    );
}
