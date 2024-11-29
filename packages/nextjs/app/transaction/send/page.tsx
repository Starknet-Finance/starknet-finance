"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TransactionOverview from "../_components/TransactionOverview";
import { HeaderActions } from "~~/components/HeaderActions";
import { BatchedTransaction } from "../_components/BatchedTransaction";
import { useGlobalState } from "~~/services/store/store";
import SendToken from "./_component/SendToken";
import { Routes } from "~~/utils/Routes";
import TransactionTable from "../_components/TransactionTable";

type Asset = {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  percentage: number;
  icon: string;
};

const assets: Asset[] = [
  {
    symbol: "USDT",
    name: "Tether",
    amount: 4098.01,
    value: 30.89,
    percentage: 79,
    icon: "/usdt.svg", // You'll need to add these icons to your public folder
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.019268,
    value: 1135.96,
    percentage: 20,
    icon: "/usdt.svg",
  },
  {
    symbol: "MTH",
    name: "Monetha",
    amount: 100.01,
    value: 30.89,
    percentage: 1,
    icon: "/usdt.svg",
  },
];

const Send = () => {
  const router = useRouter();
  const [isNext, setIsNext] = useState(false);
  const { openBatchedTransaction } = useGlobalState();

  return (
    <div className="p-8 min-h-screen relative">
      {/* Header Section */}
      <HeaderActions />
      {openBatchedTransaction && <BatchedTransaction />}

      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <h1 className="text-5xl font-semibold mt-5 mb-2">YOUR ACCOUNT</h1>
          <h2 className="text-5xl font-semibold gradient-text mb-8">
            OVERVIEW
          </h2>
          <p className="text-gray-300">
            Starnket Finance has been audited by top experts in <br />
            blockchain security.
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex items-end gap-4 ">
          <button className="w-[130px] flex justify-center button-bg px-6 py-3 rounded-lg items-center gap-2">
            <span className="mr-2">
              <Image src="/down.svg" width={10} height={10} alt="icon" />
            </span>{" "}
            Receive
          </button>
          <button
            onClick={() => router.push(Routes.transactionSend)}
            className="w-[130px] button-bg px-6 py-3 rounded-lg flex justify-center items-center gap-2 shadow-[inset_0_0_0_2.5px_#c4aeff]"
          >
            <span className="mr-2">
              <Image src="/up.svg" width={10} height={10} alt="icon" />
            </span>{" "}
            Send
          </button>
          <button
            className="w-[130px] button-bg px-6 py-3 rounded-lg flex justify-center items-center gap-2"
            onClick={() => router.push(Routes.transactionSwap)}
          >
            <span className="mr-2">
              <Image src="/swap.svg" width={14} height={14} alt="icon" />
            </span>{" "}
            Swap
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 flex flex-col">
          <div className="flex-1">
            <TransactionTable />
          </div>
          <button className="rounded-lg font-medium mt-2 bg-[#6161613B] px-4 py-1.5 w-fit">
            CSV Export
          </button>
        </div>
        {/* Balance Section */}
        <div className="bg-black/40 rounded-xl">
          {isNext ? (
            <TransactionOverview
              amount={1000}
              token={{ symbol: "USDT", logo: "/usdt.svg" }}
              recipient={{ name: "John Doe", address: "0x1234567890" }}
            />
          ) : (
            <SendToken setIsNext={setIsNext} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Send;