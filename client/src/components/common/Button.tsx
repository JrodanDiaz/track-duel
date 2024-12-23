interface Props {
    content: string;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    submit?: boolean;
}
export default function Button({ content, className, onClick, submit = false }: Props) {
    return (
        <button
            className={`bg-transparent border-2 border-main-green text-main-green px-5 py-2 ${className}`}
            type={submit ? "submit" : "button"}
            onClick={onClick}
        >
            {content}
        </button>
    );
}
