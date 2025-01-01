import { useContext, useEffect, useRef } from "react";
import { WebsocketContext } from "./Duel";

interface Props {
    className?: string;
    children?: React.ReactNode;
}

export default function DuelChat({ className = "", children }: Props) {
    const socket = useContext(WebsocketContext);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [socket.answers]);

    return (
        <div className={className}>
            <div
                className="border-2 border-gray-500 p-5 w-full h-4/5 overflow-y-auto"
                ref={chatContainerRef}
            >
                {socket.answers.length === 0 && (
                    <p className="text-xl text-surface75 text-center">
                        Dead chat... Someone say something
                    </p>
                )}
                {socket.answers.map((answer, i) => {
                    const answerStyle =
                        "border-b-[1px] border-b-offwhite border-spacing-1 text-xl font-lato my-2";
                    if (answer.isCorrect) {
                        return (
                            <p className={`text-main-green  ${answerStyle}`}>
                                {answer.from} guessed the song correctly!
                            </p>
                        );
                    } else
                        return (
                            <p
                                className={`${answerStyle} ${
                                    i % 2 === 0 ? "text-offwhite " : " text-surface75"
                                }`}
                            >
                                <strong>{answer.from}:</strong> {answer.answer}
                            </p>
                        );
                })}
            </div>
            {children}
        </div>
    );
}
