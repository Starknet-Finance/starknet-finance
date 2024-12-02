import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const CARD_DATA = [
  {
    title: "POWER USERS",
    listText: [
      "Advanced features for crypto natives",
      "AI-powered automation",
      "Custom operation flows",
    ],
    image: "/landingpage/power.png",
  },
  {
    title: "TEAMS",
    listText: [
      "Collaborative treasury management",
      "Real-time notifications",
      "Streamlined workflows",
    ],
    image: "/landingpage/team.png",
  },
  {
    title: "ENTERPRISE",
    listText: [
      "Professional-grade tools",
      "Advanced automation",
      "Custom integration support",
    ],
    image: "/landingpage/enterprise.png",
  },
];

const Card = ({
  title,
  listText,
  image,
}: {
  title: string;
  listText: any;
  image: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-[0px_4px_30.4px_0px_rgba(0,0,0,0.05)] p-5">
      <div className="flex justify-end">
        <Image
          src={image}
          alt="image"
          width={500}
          height={500}
          className="w-[220px] h-[260px]"
        />
      </div>
      <p className="text-[32px] font-semibold mt-5">{title}</p>
      <ul className="mt-10 mb-6 list-inside list-disc">
        {listText.map((item: any, index: number) => (
          <li key={index} className="text-[#5D5D5D] font-medium">
            {item}
          </li>
        ))}
      </ul>
      <div className="w-8 h-8 bg-[#000] cursor-pointer flex items-center justify-center rounded-full">
        <Image
          src="/landingpage/arrow-right-icon.svg"
          alt="icon"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
};

export default function AvaiableNow() {
  return (
    <div className="content">
      <p className="subtitle">AVAILABLE NOW</p>
      <h2 className="title">Built for Everyone</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {CARD_DATA.map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </div>
      <div>
        <Image
          src={"/landingpage/padding4.svg"}
          alt="icon"
          width={50}
          height={100}
          className="mt-7 mx-auto"
        />
      </div>
    </div>
  );
}
