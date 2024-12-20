interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  bg: string;
  text: string;
  border: string;
  content: string;
  px?: string;
  py?: string;
  submit?: boolean;
}
export default function SexyButton({
  onClick,
  bg,
  text,
  border,
  content,
  px = "px-5",
  py = "py-3",
  submit = false,
}: Props) {
  return (
    <>
      <button
        onClick={onClick}
        className={`relative inline-flex items-center justify-start inline-block ${px} ${py} overflow-hidden font-bold rounded-full group`}
        type={submit ? "submit" : "button"}
      >
        <span
          className={`w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 ${bg} opacity-[3%]`}
        ></span>
        <span
          className={`absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 ${bg} opacity-100 group-hover:-translate-x-8`}
        ></span>
        <span
          className={`relative w-full text-left ${text} transition-colors duration-200 ease-in-out group-hover:text-gray-900`}
        >
          {content}
        </span>
        <span className={`absolute inset-0 border-2 ${border} rounded-full`}></span>
      </button>
    </>
  );
}
