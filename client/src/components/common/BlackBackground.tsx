interface Props {
  className?: string;
  children: React.ReactNode;
}
export default function BlackBackground({ className, children }: Props) {
  return (
    <div
      className={` bg-main-black w-screen h-screen overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
}
