interface Props {
    content: string;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    submit?: boolean;
    disabled?: boolean;
}
export default function Button({
    content,
    className,
    onClick,
    submit = false,
    disabled = false,
}: Props) {
    return (
        <button
            className={`bg-transparent border-2 border-main-green text-main-green px-5 py-2 ${className} disabled:border-gray-500 disabled:text-gray-500`}
            type={submit ? "submit" : "button"}
            onClick={onClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
}
