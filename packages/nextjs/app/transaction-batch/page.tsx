"use client";

import Image from "next/image";
import { HeaderActions } from "~~/components/HeaderActions";
import { useState } from "react";
import { TransactionFinanceCardBlack } from "./_component/TransactionFinanceCard";

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

const TransactionBatch = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return (
    <div className="p-8 min-h-screen relative">
      {/* Header Section */}
      <HeaderActions />
      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <h1 className="text-5xl uppercase font-semibold mt-5 mb-2">
            the first starknet platform
          </h1>
          <div className="flex items-center gap-4">
            <h2 className="text-5xl uppercase font-semibold gradient-text">
              transaction batch
            </h2>
            <span className="bg-[#F44] rounded-[74px] w-[67px] font-semibold text-[22px] h-8 flex items-center justify-center">
              2
            </span>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-7 flex flex-col gap-3">
          <div className="bg-[#1C1C1C] rounded-lg p-4">
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
            <p className="text-sm text-[#FFFFFF80]">
              Proceed all transactions at once
            </p>
            <div className="bg-[#656565] h-[1px] w-full mb-3 mt-2 opacity-40"></div>
            <div className="flex flex-col gap-2.5">
              {LIST_TRANSACTION.map((transaction) => (
                <TransactionFinanceCardBlack
                  key={transaction.id}
                  {...transaction}
                  isExpanded={expandedId === transaction.id}
                  onExpand={(isExpanded) => {
                    setExpandedId(isExpanded ? transaction.id : null);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#1C1C1C] rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Image
                src="/batched/batched-transaction.svg"
                alt="icon"
                width={20}
                height={20}
              />
              <p className="uppercase gradient-text text-xl font-bold">
                Transaction checks
              </p>
            </div>
            <p className="text-sm text-[#FFFFFF80]">
              Proceed all transactions at once
            </p>
            <div className="flex items-center justify-between p-2 bg-[#E8C2FF] rounded-md mt-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[#000] font-semibold">
                  Run a simulation
                </span>
                <Image
                  src={"/transaction-check-noti.svg"}
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
        </div>
        <div className="col-span-3">
          <div className="bg-[#161616] rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Image src="/info.svg" alt="icon" width={18} height={18} />
              <p className="uppercase gradient-text text-xl font-bold">
                preparing your order...
              </p>
            </div>
            <p className="text-sm text-[#FFFFFF80]">
              One more step to complete your transaction
            </p>
            <div className="rounded-[11px] bg-[#1C1C1C] pt-4 pb-6 px-2.5 mt-4">
              <div className="flex gap-2">
                <div className="w-full">
                  <div className="bg-[#D56AFF] rounded-sm h-[14px] mb-1.5"></div>
                  <p className="text-[14px]">Queue Transaction</p>
                </div>
                <div className="w-full">
                  <div className="bg-[#D56AFF] rounded-sm h-[14px] mb-1.5"></div>
                  <p className="text-[14px]">Create Batch</p>
                </div>
                <div className="w-full">
                  <div className="bg-white rounded-sm h-[14px] mb-1.5"></div>
                  <p className="text-[14px] text-[#FFFFFF80]">Execute</p>
                </div>
              </div>
            </div>
            <button className="flex-1 py-4 rounded-lg w-full text-xl button-bg mt-3.5">
              Confirm & Sign
            </button>
          </div>

          <div className="bg-[#e8c2ff33]  rounded-b-lg py-4 flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full flex items-center justify-center">
              <Image src="/timer.svg" width={16} height={16} alt="icon" />
            </div>
            <span className="text-[#E8C2FF] text-sm">
              1/3 signer sign the contract
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionBatch;
