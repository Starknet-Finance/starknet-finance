/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeaderActions } from "~~/components/HeaderActions";
import TransactionButtons from "~~/components/transactions/TransactionButtons";
import TransactionTable from "../transaction/_components/TransactionTable";

type Transaction = {
  id: number;
  type: "Receive" | "Send" | "Swap";
  amount: number;
  token: string;
  toAmount?: number;
  toToken?: string;
  date: string;
};

type Asset = {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  percentage: number;
  icon: string;
};

const transactions: Transaction[] = [
  {
    id: 1,
    type: "Receive",
    amount: 12000,
    token: "USDT",
    date: "25/11/2024, 07:15",
  },
  {
    id: 2,
    type: "Send",
    amount: 7159,
    token: "USDT",
    date: "22/11/2024, 23:59",
  },
  {
    id: 3,
    type: "Swap",
    amount: 12067,
    token: "USDT",
    toAmount: 0.15272,
    toToken: "BTC",
    date: "15/11/2024, 16:30",
  },
  {
    id: 4,
    type: "Receive",
    amount: 12000,
    token: "USDT",
    date: "10/11/2024, 14:20",
  },
  {
    id: 5,
    type: "Send",
    amount: 4159,
    token: "USD",
    date: "05/11/2024, 09:45",
  },
];

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

const Overview = () => {
  const router = useRouter();

  return (
    <div className="p-8 min-h-screen relative">
      {/* Header Section */}
      <HeaderActions />
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
        <TransactionButtons />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-black rounded-xl">
          {/* Transactions List */}
          <TransactionTable />
        </div>

        {/* Balance Section */}
        <div className="bg-black/40 rounded-xl">
          <div className="rounded-tr rounded-tl bg-[#2b195c] px-3 py-4">
            <h3 className="text-gray-300 text-xl">Total Balance</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-gray-300 text-3xl"></span>
              <span className="py-2 text-5xl font-bold gradient-text">
                $ 4,217,015
              </span>
            </div>
            <div className="mb-2 h-4 w-full rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[70%]"></div>
              <div className="bg-orange-400 h-full w-[25%]"></div>
              <div className="bg-blue-500 h-full w-[5%]"></div>
            </div>
          </div>
          {/* Assets Tabs */}
          <div className="px-4 py-5">
            <div className="flex gap-4 mb-4">
              <button className="text-white">Assets</button>
              <button className="text-gray-400">NFTs</button>
            </div>

            {/* Asset list would go here */}
            <div className="space-y-6 mt-6">
              {assets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={asset.icon}
                      width={40}
                      height={40}
                      alt={asset.name}
                    />
                    <div>
                      <div className="flex flex-col">
                        <span className="font-semibold">{asset.symbol}</span>
                        <span className="text-gray-400 text-sm">
                          {asset.name}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">%Portfolio</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{asset.amount}</div>
                    <div className="text-gray-400">${asset.value}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl text-gray-500">
                        {asset.percentage}%
                      </span>
                      <div className="w-16 h-3 bg-gray-900 rounded-full overflow-hidden transform -skew-x-12">
                        <div
                          className="h-full bg-purple-500 transform -skew-x-12"
                          style={{
                            width: `${asset.percentage}%`,
                            marginLeft: "-4px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
