interface Props {
    message: string;
    className?: string;
}
export default function ErrorMessage({ message, className = "" }: Props) {
    return <span className={`text-red-600 ${className}`}>{message}</span>;
}
