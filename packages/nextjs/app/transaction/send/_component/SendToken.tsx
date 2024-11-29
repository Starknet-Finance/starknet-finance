import Image from "next/image";
import React, { useState, useEffect } from "react";
import { handleNumberInput } from "~~/utils/validateData";
import SelectTokenList from "../../_components/SelectTokenList";

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
}

const STORAGE_KEYS = {
  RECENT_RECIPIENTS: "recent_recipients",
  SELECTED_TOKEN: "selected_token",
};

const SendToken = ({ setIsNext }: SendTokenProps) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | null>(null);
  const availableTokens: Token[] = [
    { symbol: "BTC", logo: "/btc.png", name: "Bitcoin", price: 0.2 },
    { symbol: "ETH", logo: "/eth.svg", name: "Ethereum", price: 0.2 },
    { symbol: "BNB", logo: "/binance.svg", name: "Binance Coin", price: 0.2 },
  ];

  const [selectedToken, setSelectedToken] = useState<Token>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_TOKEN);
    return stored ? JSON.parse(stored) : availableTokens[0];
  });

  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null,
  );
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [showTokenList, setShowTokenList] = useState(true);

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
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsTokenDropdownOpen(false);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setShowTokenList(true);
      setSelectedRecipient(null);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (amount !== null && amount > 0) {
        setStep(2);
        setShowTokenList(false);
      }
    } else if (step === 2) {
      if (selectedRecipient !== null) {
        if (!recipients.find((r) => r.address === selectedRecipient.address)) {
          setRecipients((prev) => [selectedRecipient, ...prev].slice(0, 5));
        }
        setIsNext(true);
      }
    }
  };

  const isNextButtonEnabled =
    (step === 1 && amount !== null && amount > 0) ||
    (step === 2 && selectedRecipient !== null);

  return (
    <div className="h-full mx-auto bg-[#161616] p-6 text-white rounded-lg relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col ml-8">
          <div className="flex items-center gap-3">
            <img src="/arrow-narrow-up.png" alt="" className="-mt-2" />
            <h1 className="text-2xl font-bold gradient-text">
              {step === 1 ? "SEND TOKENS" : "SELECT RECIPIENT"}
            </h1>
          </div>
          <p className="text-gray-400 m-0">
            {step === 1
              ? "Send tokens to a wallet or ENS name"
              : "Choose or enter recipient address"}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#65656526] mb-5"></div>

      {/* Amount Input Section */}
      {step === 1 && (
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
              ref={setInputRef}
              value={amount}
              onChange={(e) => {
                if (handleNumberInput(e.target.value)) {
                  handleAmountChange(e);
                }
              }}
              className="bg-transparent text-center text-4xl font-bold w-full focus:outline-none"
              placeholder="0.00"
            />
          )}
          <p className="text-gray-400">
            ~{" "}
            {amount
              ? `${(Number(amount) * 40000).toLocaleString()} USD`
              : "0.00 USD"}
          </p>
        </div>
      )}

      {/* Token Selection Section */}
      {step >= 1 && (
        <>
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
                <div className="flex flex-col">
                  <span className="text-xl">{selectedToken.symbol}</span>
                  <span className="text-sm text-gray-400">
                    {selectedToken.name}
                  </span>
                </div>
              </div>
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
                {availableTokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="p-3 hover:bg-[#2c2c2c] cursor-pointer flex items-center gap-2 transition-colors"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-8 h-8"
                    />
                    <div className="flex flex-col">
                      <span className="text-xl">{token.symbol}</span>
                      <span className="text-sm text-gray-400">
                        {token.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showTokenList && (
            <div className="mb-6">
              <SelectTokenList
                isBg
                selectedToken={selectedToken}
                onSelect={handleTokenSelect}
              />
            </div>
          )}
        </>
      )}

      {/* Recipient Selection Section */}
      {step >= 2 && (
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
              <span className="text-gray-400">Address or ENS</span>
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
            <div className="space-y-2 mt-2">
              {recipients.map((recipient, index) => (
                <div
                  key={index}
                  className="bg-[#1E1E1E] p-3 px-5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#2c2c2c] transition-colors"
                  onClick={() => {
                    setSelectedRecipient(recipient);
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* Button Group */}
      <div className="flex gap-4 mt-4">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="w-1/3 text-xl py-4 rounded-lg border-[2.5px] border-[#c4aeff] bg-transparent hover:bg-[#2c2c2c] transition-all duration-200"
          >
            Back
          </button>
        )}
        <button
          disabled={!isNextButtonEnabled}
          className={`${
            isNextButtonEnabled
              ? "next-button-bg border-[2.5px] border-[#c4aeff] cursor-pointer hover:brightness-110"
              : "bg-[#474747] cursor-not-allowed"
          } ${step > 1 ? "w-2/3" : "w-full"} text-xl py-4 rounded-lg transition-all duration-200`}
          onClick={handleNext}
        >
          {step === 1 ? "Next" : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default SendToken;
