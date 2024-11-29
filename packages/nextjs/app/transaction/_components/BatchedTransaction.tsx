import Image from "next/image";
import { useGlobalState } from "~~/services/store/store";
import { TransactionFinanceCard } from "./TransactionFinanceCard";
import { useState } from "react";

interface BatchedTransactionProps {
  transactions: any[];
  onSubmit: () => void;
  onRemoveTransaction: (index: number) => void;
}

export const BatchedTransaction = ({
  transactions,
  onSubmit,
  onRemoveTransaction,
}: BatchedTransactionProps) => {
  const { setOpenBatchedTransaction } = useGlobalState();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRemoveTransaction = (id: string) => {
    const index = Number(id.split("-")[1]);
    onRemoveTransaction(index);
  };

  // Convert Contract calls to display format
  const formatTransactions = (transactions: any[]) => {
    return transactions.map((tx, index) => ({
      id: `tx-${index}`,
      token: {
        symbol:
          tx._contract.address ===
          "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
            ? "ETH"
            : tx._contract.address ===
                "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
              ? "USDC"
              : tx._contract.address ===
                  "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"
                ? "USDT"
                : "Unknown",
        logo:
          tx._contract.address ===
          "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
            ? "/eth.svg"
            : tx._contract.address ===
                "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
              ? "/usdc.svg"
              : tx._contract.address ===
                  "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"
                ? "/usdt.svg"
                : "/token-placeholder.png",
        name:
          tx._contract.address ===
          "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
            ? "Ethereum"
            : tx._contract.address ===
                "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
              ? "USD Coin"
              : tx._contract.address ===
                  "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8"
                ? "Tether"
                : "Unknown Token",
        address: tx._contract.address,
      },
      amount: Number(tx.calldata[1]) / 1e18, // Convert from wei
      recipient: {
        name: `Recipient ${index + 1}`,
        address: tx.calldata[0],
      },
      canRemove: true,
    }));
  };

  const formattedTransactions = formatTransactions(transactions);

  return (
    <div className="flex flex-col absolute right-0 top-0 h-full bg-[#1C1C1C] w-[476px] p-4 z-50 animate-[slideIn_0.3s_ease-out] translate-x-0">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/batched/batched-transaction.svg"
              alt="icon"
              width={20}
              height={20}
            />
            <p className="uppercase gradient-text text-xl font-bold">
              Batched transactions
            </p>
          </div>
          <p className="text-[#FFFFFF80] text-sm">
            Proceed all transactions at once
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Image
            src="/batched/expand.svg"
            alt="icon"
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <Image
            onClick={() => setOpenBatchedTransaction(false)}
            src="/batched/close.svg"
            alt="icon"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="h-[1px] bg-[#65656526] w-full mt-[22px] mb-[14px]"></div>

      <div className="flex-1 flex flex-col gap-2.5 mb-6 max-h-[900px] overflow-y-auto">
        {formattedTransactions.map((transaction) => (
          <TransactionFinanceCard
            key={transaction.id}
            {...transaction}
            isExpanded={expandedId === transaction.id}
            onExpand={(isExpanded) => {
              setExpandedId(isExpanded ? transaction.id : null);
            }}
            canRemove={true}
            onRemove={() => handleRemoveTransaction(transaction.id)}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setOpenBatchedTransaction(false)}
          className="flex-1 py-4 rounded-lg text-xl shadow-[inset_0_0_0_2px_#d56aff] text-[#C4AEFF]"
        >
          Add new transaction
        </button>
        <button
          onClick={onSubmit}
          disabled={transactions.length === 0}
          className={`flex-1 py-4 rounded-lg text-xl ${
            transactions.length > 0
              ? "button-bg cursor-pointer"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Confirm batch ({transactions.length})
        </button>
      </div>
    </div>
  );
};
