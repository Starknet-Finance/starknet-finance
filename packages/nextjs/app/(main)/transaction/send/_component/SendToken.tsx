"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CheckIcon } from "@heroicons/react/24/solid";
import { getChecksumAddress, validateChecksumAddress } from "starknet";
import useSupportedTokens from "~~/hooks/useSupportedTokens";

interface TransactionData {
  amount: number;
  token: {
    symbol: string;
    logo: string;
    name: string;
    address: string;
    decimal: number;
  };
  recipient: {
    name: string;
    address: string;
  };
}

interface SendTokenProps {
  setIsNext: (isNext: boolean) => void;
  onTransactionSubmit: (transaction: TransactionData) => void;
}

interface AddressEntry {
  id: number;
  name: string;
  address: string;
  timestamp: number;
}

interface Token {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: string;
  logoUri: string;
}

const STORAGE_KEYS = {
  SELECTED_TOKEN: "selected_token",
  ADDRESS_BOOK: "addressBook",
};

const SendToken = ({ setIsNext, onTransactionSubmit }: SendTokenProps) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);

  const { data: supportedToken } = useSupportedTokens();
  const { content: supportedTokenData } = supportedToken
    ? supportedToken
    : { content: [] };

  const [selectedToken, setSelectedToken] = useState<Token>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_TOKEN);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  });

  const [tokenInput, setTokenInput] = useState("");
  const [selectedRecipient, setSelectedRecipient] =
    useState<AddressEntry | null>(null);
  const [recipientInput, setRecipientInput] = useState("");
  const [addressBook, setAddressBook] = useState<AddressEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.ADDRESS_BOOK);
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error("Error loading address book:", error);
        return [];
      }
    }
    return [];
  });

  // Set default token when supported tokens load
  useEffect(() => {
    if (supportedTokenData && supportedTokenData.length > 0 && !selectedToken) {
      const defaultToken =
        supportedTokenData.find((t) => t.symbol === "ETH") ||
        supportedTokenData[0];
      setSelectedToken(defaultToken as any);
    }
  }, [supportedTokenData, selectedToken]);

  useEffect(() => {
    if (selectedToken) {
      localStorage.setItem(
        STORAGE_KEYS.SELECTED_TOKEN,
        JSON.stringify(selectedToken)
      );
    }
  }, [selectedToken]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const handleTokenInput = (value: string) => {
    setTokenInput(value);
    if (validateChecksumAddress(getChecksumAddress(value))) {
      const customToken = {
        symbol: "Custom Token",
        logoUri: "/token-placeholder.png",
        name: "Custom Token",
        decimals: 18,
        chainId: "0x534e5f474f45524c49",
        address: value,
      };
      setSelectedToken(customToken);
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
    if (validateChecksumAddress(getChecksumAddress(value))) {
      setSelectedRecipient({
        id: Date.now(),
        name: "Custom Address",
        address: value,
        timestamp: Date.now(),
      });
    } else {
      setSelectedRecipient(null);
    }
  };

  const [filteredAddressBook, setFilteredAddressBook] =
    useState<AddressEntry[]>(addressBook);

  useEffect(() => {
    if (recipientInput) {
      const filtered = addressBook.filter(
        (entry) =>
          entry.name.toLowerCase().includes(recipientInput.toLowerCase()) ||
          entry.address.toLowerCase().includes(recipientInput.toLowerCase())
      );
      setFilteredAddressBook(filtered);
    } else {
      setFilteredAddressBook(addressBook);
    }
  }, [recipientInput, addressBook]);

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

    if (!validateChecksumAddress(getChecksumAddress(recipientAddress))) {
      toast.error("Please enter a valid recipient address");
      return;
    }

    const transactionData = {
      amount: amount,
      token: {
        symbol: selectedToken.symbol,
        logo: selectedToken.logoUri,
        name: selectedToken.name,
        address: selectedToken.address,
        decimal: selectedToken.decimals,
      },
      recipient: {
        name: selectedRecipient?.name || "Custom Address",
        address: recipientAddress,
      },
    };

    setIsNext(true);
    onTransactionSubmit(transactionData); // Pass to parent
  };

  const isNextButtonEnabled =
    amount !== null &&
    amount > 0 &&
    (selectedRecipient !== null ||
      (recipientInput &&
        validateChecksumAddress(getChecksumAddress(recipientInput))));

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
          {selectedToken && (
            <div className="flex items-center gap-2">
              <img
                src={selectedToken.logoUri}
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
              <div className="p-3 text-sm text-gray-400">Supported Tokens</div>
              {supportedTokenData?.map((token) => {
                const isSelected = selectedToken?.address === token.address;
                return (
                  <div
                    key={token.address}
                    className="p-3 px-5 hover:bg-[#2c2c2c] cursor-pointer transition-colors"
                    onClick={() => handleTokenSelect(token as any)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={token.logoUri}
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
                placeholder="Search or enter address"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-[240px] overflow-y-auto">
              <div className="p-3 text-sm text-gray-400">Address Book</div>
              {filteredAddressBook.length > 0 ? (
                filteredAddressBook.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 px-5 hover:bg-[#2c2c2c] cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedRecipient(entry);
                      setRecipientInput("");
                      setIsRecipientDropdownOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#474747] rounded-lg flex items-center justify-center text-xl">
                          {entry.name[0]}
                        </div>
                        <div>
                          <div className="text-lg">{entry.name}</div>
                          <div className="text-gray-400 text-sm">
                            {`${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                          </div>
                        </div>
                      </div>
                      <img
                        src="/copy.png"
                        alt="copy"
                        className="scale-[110%] hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyAddress(entry.address);
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  {addressBook.length === 0
                    ? "No addresses in address book"
                    : "No matching addresses found"}
                </div>
              )}
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
