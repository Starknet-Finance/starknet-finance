"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "~~/hooks/useAccount";
import { isAddress } from "~~/utils/scaffold-stark/common";

interface SendTokenProps {
  setIsNext: (isNext: boolean) => void;
}

const SendToken = ({ setIsNext }: SendTokenProps) => {
  const { account } = useAccount();

  // State management
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState({
    symbol: "BTC",
    logo: "/btc.png",
  });
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<null | {
    name: string;
    address: string;
  }>(null);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [recipientInput, setRecipientInput] = useState("");

  // Sample data
  const availableTokens = [
    { symbol: "BTC", logo: "/btc.png" },
    { symbol: "ETH", logo: "/btc.png" },
    // Add more tokens as needed
  ];

  const recipients = [
    { name: "Jupeng", address: "0xd325hbt5bhyb3b4y5h36bh54" },
    { name: "Carlos", address: "0xd325hbt5bhyb3b4y5h36b32c" },
    { name: "Mehdi", address: "0xd325hbt5bhyb3b4y5h36b32c" },
  ];

  // Handlers
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // fetch token price
    setAmount(Number(e.target.value));
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // Optional: Add toast notification here
  };

  const handleNext = () => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!selectedRecipient || !recipientInput) {
      toast.error("Please select a recipient");
      return;
    }

    // check if sending address to selectedRecipient or recipientInput

    let recipientAddress = "";
    if (selectedRecipient) {
      recipientAddress = selectedRecipient.address;
    } else {
      recipientAddress = recipientInput;
    }

    if (!isAddress(recipientAddress)) {
      toast.error("Please enter a valid recipient address");
      return;
    }

    setIsNext(true);
  };

  return (
    <div className="h-full mx-auto bg-[#161616] p-6 text-white">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3 ">
          <img src="/arrow-narrow-up.png" alt="" className="-mt-2" />
          <h1 className="text-2xl font-bold gradient-text">SEND TOKENS</h1>
        </div>
        <p className="text-gray-400 m-0 mb-5 ">
          Send tokens to a wallet or ENS name
        </p>
      </div>
      <div className="w-full h-[1px] bg-[#65656526] mb-5"></div>

      {/* Amount Section */}
      <div className="text-center mb-8">
        {amount == null ? (
          <h2
            onClick={() => {
              setAmount(0.0);
            }}
            className="text-4xl font-bold mb-2"
          >
            Enter Amount
          </h2>
        ) : (
          <input
            ref={setInputRef}
            type="number"
            value={amount!}
            onChange={handleAmountChange}
            className="bg-transparent text-center text-4xl font-bold w-full focus:outline-none"
            placeholder="0.00"
          />
        )}
        <input
          type="text"
          value={null ?? "0"}
          onChange={handleAmountChange}
          className="customize-caret bg-transparent text-center text-4xl font-bold w-full focus:outline-none hidden"
          placeholder={"0.00"}
        />
        <p className="text-gray-400">
          ~ {amount ? `${Number(amount) * 40000} USD` : "0.00 USD"}
        </p>
      </div>

      {/* Token Selection */}
      <div className="mb-6 relative">
        <label className="text-xl mb-2 block">Send token</label>
        <div
          className="bg-[#1E1E1E] h-[70px] border border-transparent transition hover:border-gray-500 p-3 rounded-lg flex items-center justify-between cursor-pointer"
          onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
        >
          <div className="flex items-center gap-2">
            <img
              src={selectedToken.logo}
              alt={selectedToken.symbol}
              className="w-8 h-8"
            />
            <span className="text-xl">{selectedToken.symbol}</span>
          </div>
          <img src="/arrow-down.svg" alt="dropdown" className="scale-[105%]" />
        </div>

        {/* Token Dropdown */}
        {isTokenDropdownOpen && (
          <div className="absolute w-full mt-2 bg-[#1E1E1E] rounded-lg overflow-hidden z-10">
            {availableTokens.map((token) => (
              <div
                key={token.symbol}
                className="p-3 hover:bg-[#2c2c2c] cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setSelectedToken(token);
                  setIsTokenDropdownOpen(false);
                }}
              >
                <img src={token.logo} alt={token.symbol} className="w-8 h-8" />
                <span className="text-xl">{token.symbol}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipient Wallet */}
      <div className="mb-6 relative">
        <label className="text-xl mb-2 block">Recipient Wallet</label>
        <div
          className="bg-[#1E1E1E] h-[70px] border border-transparent transition hover:border-gray-500 p-3 rounded-lg flex items-center justify-between cursor-pointer"
          onClick={() => setIsRecipientDropdownOpen(!isRecipientDropdownOpen)}
        >
          {selectedRecipient && recipientInput == "" ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#474747] rounded-lg flex items-center justify-center text-xl">
                {selectedRecipient.name[0]}
              </div>
              <div>
                <div className="text-lg">{selectedRecipient.name}</div>
                <div className="text-gray-400 text-sm">
                  {selectedRecipient.address}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">
              {recipientInput || "Address or ENS"}
            </span>
          )}
          <img src="/arrow-down.svg" alt="dropdown" className="scale-[105%]" />
        </div>

        {/* Updated Recipient Dropdown */}
        {isRecipientDropdownOpen && (
          <div className="absolute w-full mt-2 bg-[#1E1E1E] rounded-lg overflow-hidden z-10">
            {/* Search/Input field at top of dropdown */}
            <div className="p-3 border-b border-[#2c2c2c]">
              <input
                type="text"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                className="w-full bg-[#2c2c2c] p-2 rounded-lg focus:outline-none text-lg"
                placeholder="Search or paste address"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Scrollable recipients list */}
            <div className="max-h-[240px] overflow-y-auto">
              {/* Recent/Saved Recipients section */}
              <div className="p-3 text-sm text-gray-400">Recent Recipients</div>
              {recipients.map((recipient, index) => (
                <div
                  key={index}
                  className="p-3 px-5 hover:bg-[#2c2c2c] cursor-pointer"
                  onClick={() => {
                    setSelectedRecipient(recipient);
                    setRecipientInput("");
                    setIsRecipientDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#474747] rounded-lg flex items-center justify-center text-xl">
                      {recipient.name[0]}
                    </div>
                    <div>
                      <div className="text-lg">{recipient.name}</div>
                      <div className="text-gray-400 text-sm">
                        {recipient.address}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show input as an option if it's a valid address */}
              {recipientInput && isAddress(recipientInput) && (
                <div
                  className="p-3 px-5 hover:bg-[#2c2c2c] cursor-pointer border-t border-[#2c2c2c]"
                  onClick={() => {
                    setSelectedRecipient({
                      name: "Custom Address",
                      address: recipientInput,
                    });
                    setIsRecipientDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#474747] rounded-lg flex items-center justify-center text-xl">
                      #
                    </div>
                    <div>
                      <div className="text-lg">Custom Address</div>
                      <div className="text-gray-400 text-sm">
                        {recipientInput}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        className={`${amount != null && amount > 0 && selectedRecipient != null ? "next-button-bg border-[2.5px] border-[c4aeff]" : "bg-[#474747]"} w-full  text-xl py-4 rounded-lg mt-4 transition-colors`}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default SendToken;
