/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import SelectTokenList from "../../_components/SelectTokenList";
import useSupportedTokens from "~~/hooks/useSupportedTokens";
import { SwapQuoteResponse, TokenData } from "~~/types/avnu";
import useBestQuote from "~~/hooks/avnu/useBestQuote";
import { buildSwap, getBestQuote } from "~~/services/api/quotes";
import { debounce } from "lodash";
import { ethers, formatUnits } from "ethers";
import { num } from "starknet";
import toast from "react-hot-toast";
import { useAccount } from "~~/hooks/useAccount";
import { useTransactionStorage } from "~~/hooks/useTransactionStorage";

type Token = {
  symbol: string;
  icon: string;
  address: string;
};

type TokenInputProps = {
  amount: string;
  usdValue: string;
  token: Token;
  readOnly?: boolean;
  onTokenSelect: () => void;
  variant?: "top" | "bottom" | "none";
  onAmountChange: (value: string) => void;
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
    <img src={token.icon} alt={token.symbol} width={20} height={20} />
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
  onAmountChange,
}: TokenInputProps) => {
  return (
    <div className={`bg-[#2B2B2B] p-3 ${getRadiusClass(variant)}`}>
      <div className="flex justify-end">
        <TokenSelector token={token} onClick={onTokenSelect} />
      </div>
      <input
        type="number"
        className="bg-[#2B2B2B] outline-none text-[28px] w-full [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="0.00"
        value={amount}
        readOnly={readOnly}
        onChange={(e) => onAmountChange(e.target.value)}
      />
      <p className="text-sm text-[#767C82]">~ {usdValue} USD</p>
    </div>
  );
};

const TransactionDetail = ({ label, value }: TransactionDetailProps) => (
  <div className="flex items-center justify-between">
    <p className="text-[#E2E8FFB2] text-sm">{label}</p>
    <p className="font-medium text-right">{value}</p>
  </div>
);

const SwapHeader = () => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <Image
        src="/arrow-narrow-up.png"
        alt="swap direction"
        className="-mt-2"
        width={22}
        height={22}
      />
      <h1 className="text-xl font-bold gradient-text uppercase">swap tokens</h1>
    </div>
    <p className="text-[#FFFFFF80] text-sm">
      Lorem Ipsum has been the industry's standard
    </p>
  </div>
);

const Divider = () => <div className="w-full h-[1px] bg-[#65656526] my-5" />;

const SwapToken = () => {
  const { account } = useAccount();
  const [showList, setShowList] = useState(false);
  const [fromToken, setFromToken] = useState<Token>({
    symbol: "",
    icon: "",
    address: "",
  });
  const [toToken, setToToken] = useState<Token>({
    symbol: "",
    icon: "",
    address: "",
  });
  const [selectedTokenType, setSelectedTokenType] = useState<"from" | "to">(
    "from",
  );
  const [swapFromAmount, setSwapFromAmount] = useState<string>("");
  const [swapToAmount, setSwapToAmount] = useState<string>("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string>("");
  const [buyAmountInUSD, setBuyAmountInUSD] = useState<string>("");
  const [sellAmountInUSD, setSellAmountInUSD] = useState<string>("");
  const [bestQuote, setBestQuote] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { addTransaction } = useTransactionStorage();
  const { data: supportedTokens, isLoading } = useSupportedTokens();

  const handleTokenSelect = (type: "from" | "to") => {
    setSelectedTokenType(type);
    setShowList(true);
  };

  const handleTokenChoice = (token: TokenData) => {
    const selectedToken = {
      symbol: token.symbol,
      icon: token.logoUri,
      address: token.address,
    };

    if (selectedTokenType === "from") {
      setFromToken(selectedToken);
    } else {
      setToToken(selectedToken);
    }
    setShowList(false);
  };

  const handleFromAmountChange = async (value: string) => {
    setSwapFromAmount(value);
    setQuoteError(""); // Clear previous errors

    // Clear previous timeout if exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't fetch if we don't have both tokens or amount
    if (!fromToken?.address || !toToken?.address || !value) {
      setSwapToAmount("");
      return;
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      setIsLoadingQuote(true);
      try {
        const valueInWei = ethers.parseUnits(value, 18);
        const hexValue = ethers.toBeHex(valueInWei);
        const response: SwapQuoteResponse = JSON.parse(
          await getBestQuote({
            sellTokenAddress: fromToken.address,
            buyTokenAddress: toToken.address,
            sellAmount: hexValue,
          }),
        );

        if (response?.length > 0) {
          // set the amount back to number
          const amount = response[0].buyAmount;
          setSwapToAmount(
            formatUnits(num.hexToDecimalString(amount.toString()), 18),
          );
          setBuyAmountInUSD(response[0].buyAmountInUsd.toString());
          setSellAmountInUSD(response[0].sellAmountInUsd.toString());
          setBestQuote(response[0].quoteId);
        } else {
          setQuoteError("No quote available for this swap");
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setSwapToAmount("");
        setQuoteError("Failed to get quote. Please try again.");
      } finally {
        setIsLoadingQuote(false);
      }
    }, 1000); // 1 second delay
  };

  const handleSwap = async () => {
    if (!account) return toast.error("Please connect your wallet");
    if (!bestQuote) return toast.error("No best quote found");
    // build transaction
    const response = await JSON.parse(
      await buildSwap({
        quoteId: bestQuote,
        slippage: 0.05,
        includeApprove: true,
        takerAddress: account?.address as string,
      }),
    );
    try {
      await account.execute(response?.calls);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToBatch = async () => {
    if (!account) return toast.error("Please connect your wallet");

    try {
      if (
        !fromToken.address ||
        !toToken.address ||
        !swapFromAmount ||
        !swapToAmount ||
        !bestQuote
      ) {
        return toast.error("Please complete the swap details first");
      }

      // Get token metadata
      const fromTokenMetadata = supportedTokens?.content?.find(
        (token) => token.address === fromToken.address,
      );
      const toTokenMetadata = supportedTokens?.content?.find(
        (token) => token.address === toToken.address,
      );

      // Build the swap transaction
      const response = await JSON.parse(
        await buildSwap({
          quoteId: bestQuote,
          slippage: 0.05,
          includeApprove: true,
          takerAddress: account?.address as string,
        }),
      );

      // Add to batch storage
      addTransaction({
        meta: {
          type: "swap",
          fromToken: {
            symbol: fromToken.symbol,
            logo: fromToken.icon,
            name: fromTokenMetadata?.name || fromToken.symbol,
            address: fromToken.address,
            amount: parseFloat(swapFromAmount),
            amountUSD: parseFloat(sellAmountInUSD),
          },
          toToken: {
            symbol: toToken.symbol,
            logo: toToken.icon,
            name: toTokenMetadata?.name || toToken.symbol,
            address: toToken.address,
            amount: parseFloat(swapToAmount),
            amountUSD: parseFloat(buyAmountInUSD),
          },
          recipient: {
            address: account?.address as string,
            name: "Me",
          },
        },
        callData: response.calls,
      });

      toast.success("Added swap to batch");
    } catch (error) {
      console.error("Failed to add swap to batch:", error);
      toast.error("Failed to add to batch. Please try again.");
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (supportedTokens?.content && supportedTokens.content.length > 0) {
      // Set default tokens only if they haven't been set yet
      if (!fromToken?.symbol) {
        setFromToken({
          symbol: supportedTokens.content[0].symbol,
          icon: supportedTokens.content[0].logoUri,
          address: supportedTokens.content[0].address,
        });
      }
      if (!toToken?.symbol && supportedTokens.content.length > 1) {
        setToToken({
          symbol: supportedTokens.content[1].symbol,
          icon: supportedTokens.content[1].logoUri,
          address: supportedTokens.content[1].address,
        });
      }
    }
  }, [supportedTokens, fromToken?.symbol, toToken?.symbol]);

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
            variant={showList && selectedTokenType === "from" ? "none" : "top"}
            amount={swapFromAmount}
            usdValue={sellAmountInUSD}
            token={fromToken}
            onAmountChange={handleFromAmountChange}
            onTokenSelect={() => handleTokenSelect("from")}
          />

          {showList && selectedTokenType === "from" && (
            <div className="bg-[#1D1D1D] rounded-b-xl">
              <SelectTokenList
                tokens={supportedTokens?.content || []}
                onSelect={handleTokenChoice}
                isLoading={isLoading}
              />
            </div>
          )}

          <div className="h-[1px] bg-[#65656580] w-full" />

          <TokenInput
            variant={showList && selectedTokenType === "to" ? "none" : "bottom"}
            amount={swapToAmount}
            usdValue={buyAmountInUSD}
            token={toToken}
            readOnly
            onTokenSelect={() => handleTokenSelect("to")}
            onAmountChange={(value) => setSwapToAmount(value)}
          />

          {showList && selectedTokenType === "to" && (
            <div className="bg-[#1D1D1D] rounded-b-xl">
              <SelectTokenList
                tokens={supportedTokens?.content || []}
                onSelect={handleTokenChoice}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          onClick={handleAddToBatch}
          disabled={!!quoteError || isLoadingQuote}
          className="flex-1 py-3 rounded-lg text-[#E8C2FF] border border-[#D56AFF]"
        >
          Add to Batch
        </button>
        <button
          onClick={handleSwap}
          disabled={!!quoteError || isLoadingQuote}
          className="flex-1 py-3 rounded-lg button-bg"
        >
          Swap now
        </button>
      </div>

      {quoteError && (
        <div className="mt-2 text-red-500 text-sm text-center">
          {quoteError}
        </div>
      )}
    </div>
  );
};

export default SwapToken;
