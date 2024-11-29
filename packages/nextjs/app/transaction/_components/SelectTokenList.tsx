import Image from "next/image";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface Token {
  symbol: string;
  logo: string;
  name: string;
  price: number;
}

interface SelectTokenListProps {
  isBg?: boolean;
  selectedToken?: Token;
  onSelect?: (token: Token) => void;
}

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

export default function SelectTokenList({
  isBg = false,
  selectedToken,
  onSelect,
}: SelectTokenListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(TOKEN_LIST_DATA);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = TOKEN_LIST_DATA.filter(
      (token) =>
        token.name.toLowerCase().includes(term.toLowerCase()) ||
        token.subName.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredTokens(filtered);
  };

  const handleTokenSelect = (token: any) => {
    onSelect?.({
      symbol: token.subName,
      logo: token.icon,
      name: token.name,
      price: token.price,
    });
  };

  return (
    <div
      className={`space-y-2 rounded-lg px-2.5 py-2 transition-all duration-200
        ${isBg ? "bg-[#1E1E1E] hover:border hover:border-[#525252]" : ""}`}
    >
      <div className="relative">
        <input
          className="bg-[#151515] outline-none p-3 pl-10 text-sm rounded-lg w-full h-[51px] 
            transition-colors focus:bg-[#1a1a1a] text-white placeholder-gray-400"
          placeholder="Search or paste token address"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Image
          src="/search.svg"
          alt="search"
          width={20}
          height={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50"
        />
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {filteredTokens.map((item, index) => {
          const isSelected = selectedToken?.name === item.name;
          return (
            <div
              key={index}
              className={`p-2 rounded-lg flex items-center justify-between cursor-pointer 
                ${isSelected ? "bg-[#3a3a3a]" : "bg-[#313131]"} 
                hover:bg-[#3a3a3a] transition-colors`}
              onClick={() => handleTokenSelect(item)}
            >
              <div className="flex items-start gap-2 w-full">
                <Image src={item.icon} alt="icon" width={24} height={24} />
                <div className="flex items-center justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="text-lg text-white">{item.name}</div>
                      <Image
                        src="/open-new-window.svg"
                        alt="icon"
                        width={16}
                        height={16}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="text-gray-400 text-sm uppercase">
                      {item.subName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white">{item.price}</p>
                    <div className="w-20 h-8 bg-[#262626] rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">
                        ${(item.price * 40000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="ml-2">
                  <div className="w-6 h-6 rounded-full bg-[#c4aeff] flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-black" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredTokens.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            No tokens found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
