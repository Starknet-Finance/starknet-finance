import Image from "next/image";

const CARD_DATA = [
  {
    title: "Smart Operations",
    listText: [
      "Visual: Interactive transaction interface",
      "One dashboard for all your operations",
      "Batch transactions, AI automation & more",
    ],
    image: "/landingpage/operation.svg",
  },
  {
    title: "Flexible Account Setup",
    listText: [
      "Visual: Modular account building blocks",
      "Build the perfect setup for your needs",
      "From personal wallets to team management",
    ],
    image: "/landingpage/account-setup.svg",
  },
  {
    title: "Seamless Integrations",
    listText: [
      "Visual: Connected apps ecosystem",
      "Works with your favorite tools",
      "Telegram, Slack, and custom webhooks",
    ],
    image: "/landingpage/intergration.svg",
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
      <p className="text-3xl font-semibold">{title}</p>
      <ul className="mt-10 mb-14 list-inside list-disc">
        {listText.map((item: any, index: number) => (
          <li key={index} className="text-[#5D5D5D] font-medium">
            {item}
          </li>
        ))}
      </ul>
      <div>
        <Image
          src={image}
          alt="image"
          width={500}
          height={500}
          className="w-[330px] h-[210px] mx-auto"
        />
      </div>
    </div>
  );
};

export default function KeyFeature() {
  return (
    <div className="content">
      <p className="subtitle">KEY FEATURES</p>
      <h2 className="title">
        The first wallet management platform <br /> launch on Starknet{" "}
      </h2>
      <div>
        <Image
          src={"/landingpage/decore-title.svg"}
          alt="icon"
          width={40}
          height={23}
          className="mt-5 mb-10 mx-auto"
        />
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {CARD_DATA.map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </div>
      <div>
        <Image
          src={"/landingpage/padding3.svg"}
          alt="icon"
          width={50}
          height={100}
          className="mt-7 mx-auto"
        />
      </div>
    </div>
  );
}
