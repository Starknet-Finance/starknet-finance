"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeaderActions } from "~~/components/HeaderActions";
import TransactionTable from "../_components/TransactionTable";
import TransactionButtons from "~~/components/transactions/TransactionButtons";
import ReceiveToken from "./_component/ReceiveToken";

const Receive = () => {
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
      <div className="grid grid-cols-3 gap-3 min-h-[620px]">
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
          <ReceiveToken />
        </div>
      </div>
    </div>
  );
};

export default Receive;
