import Image from "next/image";
import React, { useState } from "react";
import TransactionCard from "~~/components/transactions/TransactionCard";
import { useGlobalState } from "~~/services/store/store";
import { TransactionFinanceCard } from "./TransactionFinanceCard";

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

interface TransactionOverviewProps {
  amount: number;
  token: {
    symbol: string;
    logo: string;
  };
  recipient: {
    name: string;
    address: string;
  };
  onAddToBatch?: () => void;
  onSend?: () => void;
}

const TransactionOverview: React.FC<TransactionOverviewProps> = ({
  amount,
  token,
  recipient,
  onAddToBatch,
  onSend,
}) => {
  const { setOpenBatchedTransaction } = useGlobalState();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="h-full mx-auto bg-[#161616] p-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Image
          src="/info.svg"
          alt="info"
          className="w-6 h-6"
          width={24}
          height={24}
        />
        <h1 className="text-2xl font-bold gradient-text">
          TRANSACTION OVERVIEW
        </h1>
      </div>
      <p className="text-gray-400 mb-6">
        Carefully check the information below.
      </p>
      <div className="w-full h-[1px] bg-[#65656526] mb-5"></div>

      {/* Transaction Card */}
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

      {/* Transaction Details */}
      <div className="bg-[#2A2440] bg-opacity-40 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg">Transaction checks</span>
          <button className="px-6 py-2 bg-[#2A2440] rounded-lg text-[#C4AEFF]">
            Simulate
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Min Receive</span>
            <span>4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Blockchain Fee</span>
            <span>$500</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Transaction Fee</span>
            <span>$20,000</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setOpenBatchedTransaction(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex-1 py-4 rounded-lg text-xl shadow-[inset_0_0_0_2px_#d56aff] text-[#C4AEFF]"
        >
          Add to batch
        </button>
        <button
          onClick={onSend}
          className="flex-1 py-4 rounded-lg text-xl button-bg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TransactionOverview;
