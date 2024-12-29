const imageSources = [
    "/aroundthefur.jpg",
    "/fleshwater.jpg",
    "/isthisit.png",
    "/roomonfire.jpg",
];
export default function AlbumScroll() {
    return (
        <div className="relative  w-full">
            <div className=" absolute flex gap-10 animate-scroll items-center justify-center border-[1px] border-gray-600">
                {[...imageSources, ...imageSources, ...imageSources].map((src) => (
                    <img src={src} height={150} width={150} />
                ))}
            </div>
        </div>
    );
}
