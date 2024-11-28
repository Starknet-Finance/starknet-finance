import Image from "next/image";
import React, { useState } from "react";
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
}

const SendToken = ({ setIsNext }: SendTokenProps) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token>({
    symbol: "BTC",
    logo: "/btc.png",
  });
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null,
  );
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [showTokenList, setShowTokenList] = useState(true);

  const availableTokens: Token[] = [
    { symbol: "BTC", logo: "/btc.png" },
    { symbol: "ETH", logo: "/btc.png" },
  ];

  const recipients: Recipient[] = [
    { name: "Jupeng", address: "0xd325hbt5bhyb3b4y5h36bh54" },
    { name: "Carlos", address: "0xd325hbt5bhyb3b4y5h36b32c" },
    { name: "Mehdi", address: "0xd325hbt5bhyb3b4y5h36b32c" },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const handleNext = () => {
    if (step === 1) {
      if (amount !== null && amount > 0) {
        setStep(2);
        setShowTokenList(false);
      }
    } else if (step === 2) {
      if (selectedRecipient !== null) {
        setIsNext(true);
      }
    }
  };

  const isNextButtonEnabled =
    (step === 1 && amount !== null && amount > 0) ||
    (step === 2 && selectedRecipient !== null);

  return (
    <div className="h-full mx-auto bg-[#161616] p-6 text-white rounded-lg">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <img src="/arrow-narrow-up.png" alt="" className="-mt-2" />
          <h1 className="text-2xl font-bold gradient-text">SEND TOKENS</h1>
        </div>
        <p className="text-gray-400 m-0 mb-5">
          Send tokens to a wallet or ENS name
        </p>
      </div>

      <div className="w-full h-[1px] bg-[#65656526] mb-5"></div>

      <div className="text-center mb-8">
        {amount == null ? (
          <h2
            onClick={() => setAmount(0.0)}
            className="text-4xl font-bold mb-2 cursor-pointer"
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
        <input
          type="text"
          value={null ?? "0"}
          onChange={handleAmountChange}
          className="customize-caret bg-transparent text-center text-4xl font-bold w-full focus:outline-none hidden"
          placeholder="0.00"
        />
        <p className="text-gray-400">
          ~ {amount ? `${Number(amount) * 40000} USD` : "0.00 USD"}
        </p>
      </div>

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
                <span className="text-xl">{selectedToken.symbol}</span>
              </div>
              <img
                src="/arrow-down.svg"
                alt="dropdown"
                className="scale-[105%]"
              />
            </div>

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
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-8 h-8"
                    />
                    <span className="text-xl">{token.symbol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showTokenList && (
            <div className="mb-6">
              <SelectTokenList isBg />
            </div>
          )}
        </>
      )}

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
                    {selectedRecipient.address}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-400">Address or ENS</span>
            )}
            <img
              src="/arrow-down.svg"
              alt="dropdown"
              className="scale-[105%]"
            />
          </div>

          {isRecipientDropdownOpen && (
            <div className="space-y-2 mt-2">
              {recipients.map((recipient, index) => (
                <div
                  key={index}
                  className="bg-[#1E1E1E] p-3 px-5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#2c2c2c]"
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
                        {recipient.address}
                      </div>
                    </div>
                  </div>
                  <img
                    src="/copy.png"
                    alt="copy"
                    className="scale-[110%]"
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

      <button
        disabled={!isNextButtonEnabled}
        className={`${
          isNextButtonEnabled
            ? "next-button-bg border-[2.5px] border-[c4aeff] cursor-pointer"
            : "bg-[#474747] cursor-not-allowed"
        } w-full text-xl py-4 rounded-lg mt-4 transition-colors`}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default SendToken;
