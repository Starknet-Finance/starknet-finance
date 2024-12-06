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
import { Contract, RpcProvider } from "starknet";
import { useAccount } from "~~/hooks/useAccount";
import { universalErc20Abi } from "~~/utils/Constants";
import toast from "react-hot-toast";
import { parseEther } from "ethers";
import scaffoldConfig from "~~/scaffold.config";
import { useTransactionStorage } from "~~/hooks/useTransactionStorage";
import TransactionButtons from "~~/components/transactions/TransactionButtons";

interface TransactionData {
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
}

const Send = () => {
  const router = useRouter();
  const [isNext, setIsNext] = useState(false);
  const { openBatchedTransaction, setOpenBatchedTransaction } =
    useGlobalState();
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionData | null>(null);
  const { transactions, addTransaction, removeTransaction } =
    useTransactionStorage();
  const { account } = useAccount();

  const handleTransactionSubmit = (transaction: TransactionData) => {
    setCurrentTransaction(transaction);
  };

  const handleSend = async () => {
    console.log("Sending transaction:", currentTransaction);
    if (!currentTransaction || !account) {
      toast.error("Missing transaction details or wallet not connected");
      return;
    }

    try {
      const provider = new RpcProvider({
        nodeUrl: `https://starknet-sepolia.public.blastapi.io/rpc/v0_7`,
      });

      const tokenContract = new Contract(
        universalErc20Abi,
        currentTransaction.token.address,
        provider,
      );

      // Create transfer call using contract's populate method
      const transferCall = tokenContract.populate("transfer", [
        currentTransaction.recipient.address,
        parseEther(currentTransaction.amount.toString()),
      ]);

      // Execute the transaction
      const response = await account.execute([transferCall]);
      console.log("Transaction submitted:", response);
      toast.success(
        `Successfully sent ${currentTransaction.amount} ${currentTransaction.token.symbol} to ${currentTransaction.recipient.name}`,
      );

      // Reset states
      setCurrentTransaction(null);
      setIsNext(false);
    } catch (error: any) {
      console.error("Batch transaction failed:", error);
      // Check if it's the user rejection error
      // For all other errors, show error toast
      toast.error("Batch transaction failed. Please try again.");
    }
  };

  const handleAddToBatch = () => {
    if (!currentTransaction) {
      toast.error("No transaction to add to batch");
      return;
    }

    try {
      const provider = new RpcProvider({
        nodeUrl: scaffoldConfig.targetNetworks[0].rpcUrls.public.http[0],
      });

      const tokenContract = new Contract(
        universalErc20Abi,
        currentTransaction.token.address,
        provider,
      );

      const transferCall = tokenContract.populate("transfer", [
        currentTransaction.recipient.address,
        parseEther(currentTransaction.amount.toString()),
      ]);

      // Add to storage instead of local state
      addTransaction({
        meta: {
          type: "transfer",
          ...currentTransaction,
        },
        callData: transferCall,
      });

      setOpenBatchedTransaction(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(
        `Added ${currentTransaction.amount} ${currentTransaction.token.symbol} transfer to batch`,
      );

      setCurrentTransaction(null);
      setIsNext(false);
    } catch (error) {
      console.error("Failed to add to batch:", error);
      toast.error("Failed to add to batch. Please try again.");
    }
  };

  return (
    <div className="p-8 min-h-screen relative">
      {/* Header Section */}
      <HeaderActions />

      {openBatchedTransaction && (
        <BatchedTransaction
          transactions={transactions}
          onRemoveTransaction={(id: string) => removeTransaction(id.toString())}
          onSubmit={() => {
            setOpenBatchedTransaction(false);
            router.push(Routes.transactionBatch);
          }}
        />
      )}

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
          {isNext && currentTransaction ? (
            <TransactionOverview
              {...currentTransaction}
              onAddToBatch={handleAddToBatch}
              onSend={handleSend}
            />
          ) : (
            <SendToken
              setIsNext={setIsNext}
              onTransactionSubmit={handleTransactionSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Send;
