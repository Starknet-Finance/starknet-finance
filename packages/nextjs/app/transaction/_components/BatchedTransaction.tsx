import Image from "next/image";
import { useGlobalState } from "~~/services/store/store";
import { TransactionFinanceCard } from "./TransactionFinanceCard";
import { useState } from "react";

const LIST_TRANSACTION = [
  {
    id: "1",
    token: { symbol: "USDT", logo: "/usdt.svg" },
    amount: 1000,
    recipient: { name: "Jupeng", address: "0x123" },
  },
  {
    id: "2",
    token: { symbol: "USDT", logo: "/usdt.svg" },
    amount: 2000,
    recipient: { name: "Carlos", address: "0x456" },
  },
];

export const BatchedTransaction = () => {
  const { setOpenBatchedTransaction } = useGlobalState();
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
        {LIST_TRANSACTION.map((transaction) => (
          <TransactionFinanceCard
            key={transaction.id}
            {...transaction}
            isExpanded={expandedId === transaction.id}
            onExpand={(isExpanded) => {
              setExpandedId(isExpanded ? transaction.id : null);
            }}
          />
        ))}
      </div>
      <div className="flex gap-4">
        <button className="flex-1 py-4 rounded-lg text-xl shadow-[inset_0_0_0_2px_#d56aff] text-[#C4AEFF]">
          Add new transaction
        </button>
        <button className="flex-1 py-4 rounded-lg text-xl button-bg">
          Confirm batch
        </button>
      </div>
    </div>
  );
};
