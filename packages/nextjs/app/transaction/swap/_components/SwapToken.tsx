import Image from "next/image";
import React, { useState } from "react";
import SelectTokenList from "../../_components/SelectTokenList";

type Token = {
  symbol: string;
  icon: string;
};

type TokenInputProps = {
  amount: string;
  usdValue: string;
  token: Token;
  readOnly?: boolean;
  onTokenSelect: () => void;
  variant?: "top" | "bottom" | "none";
};

type TransactionDetailProps = {
  label: string;
  value: string;
};

const getRadiusClass = (variant?: "top" | "bottom" | "none") => {
  switch (variant) {
    case "top":
      return "rounded-t-xl";
    case "bottom":
      return "rounded-b-xl";
    case "none":
      return "";
    default:
      return "rounded-xl";
  }
};

const TokenSelector = ({
  token,
  onClick,
}: {
  token: Token;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex items-center gap-[5px] bg-[#181818] rounded-[7px] w-fit p-1 cursor-pointer"
  >
    <Image src={token.icon} alt={token.symbol} width={20} height={20} />
    <p className="text-sm">{token.symbol}</p>
    <Image src="/arrow-down.svg" alt="select token" width={16} height={16} />
  </div>
);

const TokenInput = ({
  amount,
  usdValue,
  token,
  readOnly = false,
  onTokenSelect,
  variant,
}: TokenInputProps) => (
  <div className={`bg-[#2B2B2B] p-3 ${getRadiusClass(variant)}`}>
    <div className="flex justify-end">
      <TokenSelector token={token} onClick={onTokenSelect} />
    </div>
    <input
      className="bg-[#2B2B2B] outline-none text-[28px] w-full"
      placeholder="0.15272"
      value={amount}
      readOnly={readOnly}
    />
    <p className="text-sm text-[#767C82]">~ {usdValue} USD</p>
  </div>
);

const TransactionDetail = ({ label, value }: TransactionDetailProps) => (
  <div className="flex items-center justify-between">
    <p className="text-[#E2E8FFB2] text-sm">{label}</p>
    <p className="font-medium text-right">{value}</p>
  </div>
);

const SwapHeader = () => (
  <div className="flex flex-col">
    <div className="flex items-center gap-3">
      <img src="/arrow-narrow-up.png" alt="swap direction" className="-mt-2" />
      <h1 className="text-xl font-bold gradient-text uppercase">swap tokens</h1>
    </div>
    <p className="text-[#FFFFFF80] text-sm">
      Lorem Ipsum has been the industry's standard
    </p>
  </div>
);

const Divider = () => <div className="w-full h-[1px] bg-[#65656526] my-5" />;

const SwapToken = () => {
  const [showList, setShowList] = useState(false);
  const [fromToken] = useState<Token>({ symbol: "BTC", icon: "/btc.png" });
  const [toToken] = useState<Token>({ symbol: "BTC", icon: "/btc.png" });

  const handleTokenSelect = () => {
    setShowList(!showList);
  };

  return (
    <div className="h-full mx-auto bg-[#161616] p-6 text-white rounded-lg flex flex-col">
      <SwapHeader />
      <Divider />

      <div className="flex-1">
        <div className="relative">
          {!showList && (
            <div className="bg-[#F8F8F80D] p-1 rounded-md w-fit cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/ai-assistant/swap.svg"
                alt="swap tokens"
                width={20}
                height={20}
                className="rotate-90"
              />
            </div>
          )}

          <TokenInput
            variant="top"
            amount="0.15272"
            usdValue="325"
            token={fromToken}
            onTokenSelect={handleTokenSelect}
          />

          {showList && (
            <div className="bg-[#1D1D1D]">
              <SelectTokenList />
            </div>
          )}

          <div className="h-[1px] bg-[#65656580] w-full" />

          <TokenInput
            variant="bottom"
            amount="0.15272"
            usdValue="325"
            token={toToken}
            readOnly
            onTokenSelect={handleTokenSelect}
          />
        </div>

        <Divider />

        <div>
          <TransactionDetail label="Min Receive" value="4" />
          <TransactionDetail label="Blockchain Fee" value="$500" />
          <TransactionDetail label="Transaction Fee" value="$20,000" />
        </div>
      </div>

      <button className="bg-[#474747] w-full py-3 rounded-lg mt-5">
        Swap now
      </button>
    </div>
  );
};

export default SwapToken;
