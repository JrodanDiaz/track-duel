import { SetStateAction } from "react";

interface Props {
    placeholder?: string;
    className?: string;
    value: string;
    onChange: React.Dispatch<SetStateAction<string>>;
}
export default function Input({
    placeholder = "Placeholder text...",
    className,
    value,
    onChange,
}: Props) {
    return (
        <input
            className={`px-5 py-2 border-2 border-lilac focus:outline-none bg-transparent text-offwhite ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
