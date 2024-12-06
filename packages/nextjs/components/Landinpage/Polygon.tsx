import Image from "next/image";

export default function Polygon() {
  return (
    <div className="flex items-center gap-2 my-[90px]">
      <Image
        src="/landingpage/polygon-left.svg"
        alt="icon"
        width={160}
        height={160}
      />
      <div className="h-[1px] w-full bg-[#000]"></div>
      <Image
        src="/landingpage/polygon-right.svg"
        alt="icon"
        width={160}
        height={160}
      />
    </div>
  );
}
