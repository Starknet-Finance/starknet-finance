"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CheckIcon } from "@heroicons/react/24/solid";
import { isAddress } from "~~/utils/scaffold-stark/common";

interface SendTokenProps {
  setIsNext: (isNext: boolean) => void;
}

interface Recipient {
  name: string;
  address: string;
}

interface Token {
  symbol: string;
  logo: string;
  name: string;
  price: number;
  address?: string;
}

const STORAGE_KEYS = {
  RECENT_RECIPIENTS: "recent_recipients",
  SELECTED_TOKEN: "selected_token",
};

const TOKEN_LIST_DATA = [
  {
    symbol: "ETH",
    logo: "/eth.svg",
    name: "Ethereum",
    price: 0.2,
  },
  {
    symbol: "BTC",
    logo: "/btc.png",
    name: "Bitcoin",
    price: 0.2,
  },
  {
    symbol: "BNB",
    logo: "/binance.svg",
    name: "Binance Coin",
    price: 0.2,
  },
];

const SendToken = ({ setIsNext }: SendTokenProps) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_TOKEN);
    return stored ? JSON.parse(stored) : TOKEN_LIST_DATA[0];
  });

  const [tokenInput, setTokenInput] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null,
  );
  const [recipientInput, setRecipientInput] = useState("");

  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_RECIPIENTS);
    return stored
      ? JSON.parse(stored)
      : [
          { name: "Jupeng", address: "0xd325hbt5bhyb3b4y5h36bh54" },
          { name: "Carlos", address: "0xd325hbt5bhyb3b4y5h36b32c" },
          { name: "Mehdi", address: "0xd325hbt5bhyb3b4y5h36b32c" },
        ];
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SELECTED_TOKEN,
      JSON.stringify(selectedToken),
    );
  }, [selectedToken]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.RECENT_RECIPIENTS,
      JSON.stringify(recipients),
    );
  }, [recipients]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const handleTokenInput = (value: string) => {
    setTokenInput(value);
    if (isAddress(value)) {
      // If it's a valid address, create a custom token
      setSelectedToken({
        symbol: "Custom Token",
        logo: "/token-placeholder.png", // Use a placeholder image
        name: "Custom Token",
        price: 0,
        address: value,
      });
      setIsTokenDropdownOpen(false);
    }
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setTokenInput("");
    setIsTokenDropdownOpen(false);
  };

  const handleRecipientInput = (value: string) => {
    setRecipientInput(value);
    if (isAddress(value)) {
      setSelectedRecipient({
        name: "Custom Address",
        address: value,
      });
    } else {
      setSelectedRecipient(null);
    }
  };

  const handleNext = () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!selectedRecipient && !recipientInput) {
      toast.error("Please select or enter a recipient address");
      return;
    }

    let recipientAddress = selectedRecipient
      ? selectedRecipient.address
      : recipientInput;

    if (!isAddress(recipientAddress)) {
      toast.error("Please enter a valid recipient address");
      return;
    }

    if (recipientInput && isAddress(recipientInput)) {
      const newRecipient = {
        name: "Custom Address",
        address: recipientInput,
      };
      if (!recipients.find((r) => r.address === recipientInput)) {
        setRecipients((prev) => [newRecipient, ...prev].slice(0, 5));
      }
      setSelectedRecipient(newRecipient);
    }

    setIsNext(true);
  };

  const isNextButtonEnabled =
    amount !== null &&
    amount > 0 &&
    (selectedRecipient !== null ||
      (recipientInput && isAddress(recipientInput)));

  return (
    <div className="h-full mx-auto bg-[#161616] p-6 text-white rounded-lg relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <img src="/arrow-narrow-up.png" alt="" className="-mt-2" />
            <h1 className="text-2xl font-bold gradient-text">SEND TOKENS</h1>
          </div>
          <p className="text-gray-400 m-0">
            Send tokens to a wallet or ENS name
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#65656526] mb-5"></div>

      {/* Amount Input Section */}
      <div className="text-center mb-8">
        {amount == null ? (
          <h2
            onClick={() => setAmount(0.0)}
            className="text-4xl font-bold mb-2 cursor-pointer hover:text-gray-300 transition-colors"
          >
            Enter Amount
          </h2>
        ) : (
          <input
            value={amount}
            onChange={handleAmountChange}
            className="bg-transparent text-center text-4xl font-bold w-full focus:outline-none"
            placeholder="0.00"
            type="number"
          />
        )}
        <p className="text-gray-400">
          ~{" "}
          {amount
            ? `${(Number(amount) * 40000).toLocaleString()} USD`
            : "0.00 USD"}
        </p>
      </div>

      {/* Token Selection Section */}
      <div className="mb-6 relative">
        <label className="text-xl mb-2 block">Token</label>
        <div
          className="bg-[#1E1E1E] h-[70px] border border-transparent transition hover:border-gray-500 p-3 rounded-lg flex items-center justify-between cursor-pointer"
          onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
        >
          {selectedToken.address ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#474747] rounded-lg flex items-center justify-center text-xl">
                #
              </div>
              <div>
                <div className="text-lg">{selectedToken.name}</div>
                <div className="text-gray-400 text-sm">
                  {`${selectedToken.address.slice(0, 6)}...${selectedToken.address.slice(-4)}`}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={selectedToken.logo}
                alt={selectedToken.name}
                className="w-8 h-8"
              />
              <div className="flex flex-col">
                <span className="text-xl">{selectedToken.symbol}</span>
                <span className="text-sm text-gray-400">
                  {selectedToken.name}
                </span>
              </div>
            </div>
          )}
          <img
            src="/arrow-down.svg"
            alt="dropdown"
            className={`transition-transform duration-200 ${
              isTokenDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isTokenDropdownOpen && (
          <div className="absolute w-full mt-2 bg-[#1E1E1E] rounded-lg overflow-hidden z-10 shadow-lg">
            <div className="p-3 border-b border-[#2c2c2c]">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => handleTokenInput(e.target.value)}
                className="w-full bg-[#2c2c2c] p-2 rounded-lg focus:outline-none text-lg text-white"
                placeholder="Enter token address"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-[240px] overflow-y-auto">
              <div className="p-3 text-sm text-gray-400">Popular Tokens</div>
              {TOKEN_LIST_DATA.map((token, index) => {
                const isSelected = selectedToken.symbol === token.symbol;
                return (
                  <div
                    key={index}
                    className="p-3 px-5 hover:bg-[#2c2c2c] cursor-pointer transition-colors"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={token.logo}
                          alt={token.name}
                          className="w-8 h-8"
                        />
                        <div>
                          <div className="text-lg">{token.name}</div>
                          <div className="text-gray-400 text-sm">
                            {token.symbol}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#c4aeff] flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {tokenInput && isAddress(tokenInput) && (
                <div
                  className="p-3 px-5 hover:bg-[#2c2c2c] cursor-pointer border-t border-[#2c2c2c]"
                  onClick={() => {
                    handleTokenInput(tokenInput);
                    setIsTokenDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#474747] rounded-lg flex items-center justify-center text-xl">
                      #
                    </div>
                    <div>
                      <div className="text-lg">Custom Token</div>
                      <div className="text-gray-400 text-sm">
                        {`${tokenInput.slice(0, 6)}...${tokenInput.slice(-4)}`}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recipient Selection Section */}
      <div className="mb-6 relative">
        <label className="text-xl mb-2 block">Recipient Wallet</label>
        <div
          className="bg-[#1E1E1E] h-[70px] border border-transparent transition hover:border-gray-500 p-3 rounded-lg flex items-center justify-between cursor-pointer"
          onClick={() => setIsRecipientDropdownOpen(!isRecipientDropdownOpen)}
        >
          {selectedRecipient ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#474747] rounded-lg flex items-center justify-center text-xl">
                {selectedRecipient.name[0]}
              </div>
              <div>
                <div className="text-lg">{selectedRecipient.name}</div>
                <div className="text-gray-400 text-sm">
                  {`${selectedRecipient.address.slice(0, 6)}...${selectedRecipient.address.slice(-4)}`}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">
              {recipientInput || "Address or ENS"}
            </span>
          )}
          <img
            src="/arrow-down.svg"
            alt="dropdown"
            className={`transition-transform duration-200 ${
              isRecipientDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isRecipientDropdownOpen && (
          <div className="absolute w-full mt-2 bg-[#1E1E1E] rounded-lg overflow-hidden z-10 shadow-lg">
            <div className="p-3 border-b border-[#2c2c2c]">
              <input
                type="text"
                value={recipientInput}
                onChange={(e) => handleRecipientInput(e.target.value)}
                className="w-full bg-[#2c2c2c] p-2 rounded-lg focus:outline-none text-lg text-white"
                placeholder="Enter wallet address"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-[240px] overflow-y-auto">
              <div className="p-3 text-sm text-gray-400">Recent Recipients</div>
              {recipients.map((recipient, index) => (
                <div
                  key={index}
                  className="p-3 px-5 hover:bg-[#2c2c2c] cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedRecipient(recipient);
                    setRecipientInput("");
                    setIsRecipientDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#474747] rounded-lg flex items-center justify-center text-xl">
                        {recipient.name[0]}
                      </div>
                      <div>
                        <div className="text-lg">{recipient.name}</div>
                        <div className="text-gray-400 text-sm">
                          {`${recipient.address.slice(0, 6)}...${recipient.address.slice(-4)}`}
                        </div>
                      </div>
                    </div>
                    <img
                      src="/copy.png"
                      alt="copy"
                      className="scale-[110%] hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAddress(recipient.address);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <button
        disabled={!isNextButtonEnabled}
        className={`${
          isNextButtonEnabled
            ? "next-button-bg border-[2.5px] border-[#c4aeff] cursor-pointer hover:brightness-110"
            : "bg-[#474747] cursor-not-allowed"
        } w-full text-xl py-4 rounded-lg transition-all duration-200`}
        onClick={handleNext}
      >
        Confirm
      </button>
    </div>
  );
};

export default SendToken;
