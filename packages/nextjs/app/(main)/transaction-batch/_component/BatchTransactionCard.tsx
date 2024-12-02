import { parseEther } from "ethers";
import Image from "next/image";
import { TransactionFinanceCard } from "~~/app/(main)/transaction/_components/TransactionFinanceCard";
import SwapTransaction from "~~/components/AIAssistant/SwapTransaction";
import { StoredTransaction } from "~~/hooks/useTransactionStorage";

interface BatchedTransactionCardProps {
  transaction: StoredTransaction;
  onRemove: (id: string) => void;
  isExpanded: boolean;
  onExpand: (isExpanded: boolean) => void;
}

export const BatchTransactionCard = ({
  transaction,
  onRemove,
  isExpanded,
  onExpand,
}: BatchedTransactionCardProps) => {
  console.log(transaction);
  if (transaction.meta.type === "swap") {
    return (
      <div className="bg-[#2B2B2B] rounded-md">
        <div
          className="flex items-center gap-2 p-2 cursor-pointer"
          onClick={() => onExpand(!isExpanded)}
        >
          <div className="w-10 h-10 bg-[#F8F8F80D] rounded-md flex items-center justify-center">
            <Image
              src="/ai-assistant/swap.svg"
              alt="swap"
              width={20}
              height={20}
              className="rotate-90"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <img
                  src={transaction.meta.fromToken?.logo}
                  alt={transaction.meta.fromToken?.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-lg">
                  {Number(transaction.meta.fromToken?.amount).toFixed(3)}{" "}
                  {transaction.meta.fromToken?.symbol}
                </span>
                <span className="text-sm text-gray-400">
                  ~${transaction.meta.fromToken?.amountUSD.toLocaleString()}
                </span>
              </div>
              <Image
                src="/arrow-narrow-up.png"
                alt="to"
                width={16}
                height={16}
                className="rotate-90"
              />
              <div className="flex items-center gap-1">
                <img
                  src={transaction.meta.toToken?.logo}
                  alt={transaction.meta.toToken?.symbol}
                  className="w-6 h-6"
                />
                <span className="text-lg">
                  {Number(transaction.meta.toToken?.amount).toFixed(2)}{" "}
                  {transaction.meta.toToken?.symbol}
                </span>
                <span className="text-sm text-gray-400">
                  ~${transaction.meta.toToken?.amountUSD.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Image
              src="/delete-icon.svg"
              alt="delete"
              className="cursor-pointer"
              width={16}
              height={16}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(transaction.id);
              }}
            />
            <Image
              src="/arrow-down.svg"
              alt="expand"
              className={`cursor-pointer transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              width={20}
              height={20}
            />
          </div>
        </div>
        {/* Expanded content for swap */}
        <div className="w-full h-[1px] bg-[#65656526]"></div>
        <div
          className={`grid transition-all duration-300 ${
            isExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-2">
              <SwapTransaction
                step={transaction.callData}
                transaction={{
                  description: "Swap",
                  fromToken: {
                    address: transaction.meta.fromToken?.address || "",
                    symbol: transaction.meta.fromToken?.symbol || "",
                    decimals: 18,
                  },
                  toToken: {
                    address: transaction.meta.toToken?.address || "",
                    symbol: transaction.meta.toToken?.symbol || "",
                    decimals: 18,
                  },
                  fromAmount: parseEther(
                    transaction.meta.fromToken?.amount?.toString() || "0",
                  ).toString(),
                  toAmount: parseEther(
                    transaction.meta.toToken?.amount?.toString() || "0",
                  ).toString(),
                  receiver: transaction.meta.recipient?.address || "",
                  fromAmountUSD: transaction.meta.fromToken?.amountUSD || 0,
                  toAmountUSD: transaction.meta.toToken?.amountUSD || 0,
                  steps: [transaction.callData],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For transfer transactions, use the existing TransactionFinanceCard
  return (
    <TransactionFinanceCard
      token={transaction.meta.token!}
      amount={transaction.meta.amount!}
      recipient={transaction.meta.recipient!}
      canRemove={true}
      isExpanded={isExpanded}
      onExpand={onExpand}
      onRemove={() => onRemove(transaction.id)}
      id={transaction.id}
    />
  );
};
