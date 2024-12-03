import React, { useState } from "react";
import { TransactionFinanceCard } from "./TransactionFinanceCard";

interface TransactionOverviewProps {
  amount: number;
  token: {
    symbol: string;
    logo: string;
    name: string;
    address: string;
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
  const [isExpanded, setIsExpanded] = useState(true);

  const handleExpand = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  return (
    <div className="h-full mx-auto bg-[#161616] p-6 text-white rounded-xl border border-[#FFFFFF0D]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <img src="/info.svg" alt="info" className="w-6 h-6" />
        <h1 className="text-2xl font-bold gradient-text">
          TRANSACTION OVERVIEW
        </h1>
      </div>
      <p className="text-gray-400 mb-6">
        Carefully check the information below.
      </p>
      <div className="w-full h-[1px] bg-[#65656526] mb-5"></div>

      {/* Current Transaction Card */}
      <div className="flex-1 flex flex-col gap-2.5 mb-6">
        <TransactionFinanceCard
          id="current"
          token={token}
          amount={amount}
          recipient={recipient}
          isExpanded={isExpanded}
          onExpand={handleExpand}
        />
      </div>

      {/* Transaction Details */}
      <div className="rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between p-2 mb-4 bg-[#E8C2FF] rounded-md">
          <div className="flex items-center gap-1.5">
            <span className="text-[#000] font-semibold">
              Transaction checks
            </span>
            <img
              src="/transaction-check-noti.svg"
              alt="icon"
              width={14}
              height={14}
            />
          </div>
          <button className="px-6 py-2 font-medium rounded-lg text-[#D56AFF] border border-[#D56AFF]">
            Simulate
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onAddToBatch}
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
