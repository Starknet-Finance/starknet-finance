import Image from "next/image";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { TokenData } from "~~/types/avnu";

interface SelectTokenListProps {
  tokens: TokenData[];
  onSelect: (token: TokenData) => void;
  isLoading: boolean;
  selectedToken?: TokenData;
}

export default function SelectTokenList({
  tokens,
  onSelect,
  isLoading,
  selectedToken,
}: SelectTokenListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(tokens);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(term.toLowerCase()) ||
        token.symbol.toLowerCase().includes(term.toLowerCase()) ||
        token.address.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTokens(filtered);
  };

  return (
    <div className="space-y-2 rounded-lg px-2.5 py-2 transition-all duration-200">
      <div className="relative">
        <input
          className="bg-[#151515] outline-none p-3 pl-10 text-sm rounded-lg w-full h-[51px] 
            transition-colors focus:bg-[#1a1a1a] text-white placeholder-gray-400"
          placeholder="Search name, symbol, or paste address"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {/* <Image
          src="/search.svg"
          alt="search"
          width={20}
          height={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50"
        /> */}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-4 text-gray-400">
            Loading tokens...
          </div>
        ) : (
          <>
            {filteredTokens.map((token) => {
              const isSelected = selectedToken?.address === token.address;
              return (
                <div
                  key={token.address}
                  className={`p-2 rounded-lg flex items-center justify-between cursor-pointer 
                    ${isSelected ? "bg-[#3a3a3a]" : "bg-[#313131]"} 
                    hover:bg-[#3a3a3a] transition-colors`}
                  onClick={() => onSelect(token)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <img
                      src={token.logoUri}
                      alt={token.symbol}
                      width={24}
                      height={24}
                      onError={(e) => {
                        // Fallback to a default image if the logo fails to load
                        (e.target as HTMLImageElement).src =
                          "/token-placeholder.svg";
                      }}
                    />
                    <div className="flex items-center justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-1">
                          <div className="text-lg text-white">{token.name}</div>
                          <a
                            href={`https://starkscan.co/token/${token.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Image
                              src="/open-new-window.svg"
                              alt="View on explorer"
                              width={16}
                              height={16}
                              className="opacity-60 hover:opacity-100 transition-opacity"
                            />
                          </a>
                        </div>
                        <div className="text-gray-400 text-sm uppercase">
                          {token.symbol}
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
          </>
        )}
      </div>
    </div>
  );
}
