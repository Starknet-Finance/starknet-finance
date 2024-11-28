import Image from "next/image";
const TOKEN_LIST_DATA = [
  {
    icon: "/eth.svg",
    name: "Ethereum",
    subName: "ETH",
    price: 0.2,
  },
  {
    icon: "/btc.png",
    name: "Bitcoin",
    subName: "BTC",
    price: 0.2,
  },
  {
    icon: "/binance.svg",
    name: "Binance Coin",
    subName: "BNB",
    price: 0.2,
  },
];
export default function SelectTokenList({ isBg = false }: { isBg?: boolean }) {
  return (
    <div
      className={`space-y-2 rounded-lg px-2.5 py-2 ${isBg ? "bg-[#1E1E1E] hover:border hover:border-[#525252]" : ""}`}
    >
      <input
        className="bg-[#151515] outline-none p-3 text-sm rounded-lg w-full h-[51px]"
        placeholder="Search or paste token address"
      />
      {TOKEN_LIST_DATA.map((item, index) => (
        <div
          key={index}
          className="p-2 rounded-lg flex items-center justify-between cursor-pointer bg-[#313131]"
        >
          <div className="flex items-start gap-2 w-full">
            <Image src={item.icon} alt="icon" width={24} height={24} />
            <div className="flex items-center justify-between flex-1">
              <div>
                <div className="flex items-center gap-1">
                  <div className="text-lg">{item.name}</div>
                  <Image
                    src="/open-new-window.svg"
                    alt="icon"
                    width={16}
                    height={16}
                  />
                </div>
                <div className="text-gray-400 text-sm uppercase">
                  {item.subName}
                </div>
              </div>
              <p className="text-sm">{item.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
