"use client";

import Image from "next/image";
import React from "react";
import ListMessage from "~~/components/AIAssistant/ListMessage";
import TransactionCard from "~~/components/transactions/TransactionCard";
import { useAIAssistantState } from "~~/services/store/assistant";

const AIAssistant = () => {
  const { messages } = useAIAssistantState();

  return (
    <div className="h-full">
      {messages.length <= 0 ? (
        <div className="p-8 flex flex-col justify-center h-full">
          <div className="mb-5">
            <p className="gradient-text text-[48px] font-bold uppercase">
              send, swap <br /> fast & easily for now
            </p>
            <p className="text-sm text-[#8B8B8B] font-medium">
              Use one of the prompt we recommend below or use your own to begin.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <TransactionCard />
            <TransactionCard />
            <TransactionCard />
            <TransactionCard /> */}
          </div>
          <div className="flex items-center gap-1.5 mt-2 cursor-pointer w-fit">
            <Image
              src={"/refresh-icon.svg"}
              width={16}
              height={16}
              alt="icon"
            />
            <p className="text-[13px] text-[#8B8B8B]">Refresh prompt</p>
          </div>
        </div>
      ) : (
        <ListMessage />
      )}
    </div>
  );
};

export default AIAssistant;
