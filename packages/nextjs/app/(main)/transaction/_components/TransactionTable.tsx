import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { Contract, hash, RpcProvider } from "starknet";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";
import { useGlobalState } from "~~/services/store/store";
import { universalStrkAddress } from "~~/utils/Constants";
import { getTxIdFromStorage } from "~~/utils/helper";
import { notification } from "~~/utils/scaffold-stark";

type Transaction = {
  id: number;
  type: "Receive" | "Send" | "Swap";
  amount: number;
  token: string;
  toAmount?: number;
  toToken?: string;
  date: string;
  sendTo: string;
  status: "Succeed" | "Failed";
};

type PendingTransaction = {
  transaction_hash: string;
  block_hash: string;
  from_address: string;
  block_number: number;
  signatures?: number;
  isSigned?: boolean;
};

const transactionHistory: Transaction[] = [
  {
    id: 1,
    type: "Receive",
    amount: 12000,
    token: "USDT",
    date: "25/11/2024, 07:15",
    sendTo: "0xd3...1d4f",
    status: "Succeed",
  },
  {
    id: 2,
    type: "Send",
    amount: 7159,
    token: "USDT",
    date: "22/11/2024, 23:59",
    sendTo: "0xd3...1d4f",
    status: "Succeed",
  },
];

export default function TransactionTable() {
  const [activeTab, setActiveTab] = useState<"history" | "pending">("history");
  const { activeMOA } = useGlobalState();
  const { account } = useAccount();
  const { data: multisigAbi } = useDeployedContractInfo("Multisig");
  const [listPendingTransaction, setListPendingTransaction] = useState<
    PendingTransaction[]
  >([]);
  const [isSigned, setIsSigned] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  const handleGetPendingTransactions = useCallback(async () => {
    try {
      const multisigAddress = activeMOA?.moa_address;
      if (!multisigAddress) {
        notification.error("Select MutilsigAddress");
        return;
      }

      const provider = new RpcProvider({ nodeUrl: `http://127.0.0.1:5050` });
      const blockNumber = (await provider.getBlockLatestAccepted())
        .block_number;

      const proposedEvents = await provider.getEvents({
        chunk_size: 100,
        keys: [[hash.getSelectorFromName("TransactionProposed")]],
        address: multisigAddress,
        from_block: { block_number: Number(0) },
        to_block: { block_number: blockNumber },
      });

      const executedEvents = await provider.getEvents({
        chunk_size: 100,
        keys: [[hash.getSelectorFromName("TransactionExecuted")]],
        address: multisigAddress,
        from_block: { block_number: Number(0) },
        to_block: { block_number: blockNumber },
      });

      const executedTxHashes = executedEvents.events.map(
        (event: any) => event.transaction_hash,
      );

      const pendingTxs = proposedEvents.events.filter(
        (event: any) => !executedTxHashes.includes(event.transaction_hash),
      );

      setListPendingTransaction(pendingTxs);
      return { events: pendingTxs };
    } catch (error) {
      console.error("Error fetching pending transactions:", error);
      notification.error("Failed to fetch pending transactions");
    }
  }, [activeMOA?.moa_address]);

  const handleSignTransaction = async (txHash: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [txHash]: true }));
      const multisigAddress = activeMOA?.moa_address;
      if (!multisigAddress || !account) {
        notification.error("Select MutilsigAddress or Connect wallet");
        return;
      }

      const transactionId = getTxIdFromStorage(txHash);

      const multisigContract = new Contract(multisigAbi?.abi!, multisigAddress);
      const signTransactionCalldata = multisigContract?.populate(
        "sign_transaction",
        [
          transactionId,
          [
            {
              to: universalStrkAddress,
              selector: hash.getSelectorFromName("transfer"),
              calldata: [
                "0x00BDfb22Ee694229a502e3f36b08355160eFa439D83D7f034055A1D7ca02C74B",
                10000n,
              ],
            },
          ],
        ],
      );

      const tx = await account.execute(signTransactionCalldata);
      if (tx) {
        notification.success("Transaction signed successfully");
        await handleGetPendingTransactions();
      }
    } catch (error: any) {
      console.error("Error details:", error);
      notification.error(error.message || "Failed to sign transaction");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [txHash]: false }));
    }
  };

  const checkExecutedTransactions = useCallback(async () => {
    try {
      const provider = new RpcProvider({ nodeUrl: `http://127.0.0.1:5050` });
      const multisigAddress = activeMOA?.moa_address;
      if (!multisigAddress) return;

      const blockNumber = (await provider.getBlockLatestAccepted())
        .block_number;

      const events = await provider.getEvents({
        chunk_size: 100,
        keys: [[hash.getSelectorFromName("TransactionExecuted")]],
        address: multisigAddress,
        from_block: { block_number: Number(0) },
        to_block: { block_number: blockNumber },
      });

      if (events && events.events.length > 0) {
        await handleGetPendingTransactions();
      }
    } catch (error) {
      console.error("Error checking executed transactions:", error);
    }
  }, [activeMOA?.moa_address, handleGetPendingTransactions]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeTab === "pending") {
      handleGetPendingTransactions();

      interval = setInterval(async () => {
        await handleGetPendingTransactions();
        await checkExecutedTransactions();
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeTab, handleGetPendingTransactions, checkExecutedTransactions]);

  return (
    <div className="bg-black rounded-xl p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex gap-2">
            <Image src="/info.svg" width={14} height={14} alt="icon" />
            <h3 className="text-xl gradient-text font-bold">
              CURRENT TRANSACTIONS
            </h3>
          </div>
          <p className="text-[#FFFFFF80] text-sm">
            View and manage your transactions
          </p>
        </div>
        <div className="relative w-[50%]">
          <input
            type="text"
            placeholder="Search token, address"
            className="bg-[#121212] rounded-lg px-4 py-3 w-full text-sm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9C9C9C] text-[10px] bg-[#F8F8F80D] p-1 rounded-md">
            ⌘ + K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 pb-2 my-4 border-b border-[#65656580]">
        <p
          className={`text-sm cursor-pointer ${activeTab === "history" ? "text-white" : "text-[#3D3D3D]"}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </p>
        <p
          className={`text-sm cursor-pointer ${activeTab === "pending" ? "text-white" : "text-[#3D3D3D]"}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Transaction
        </p>
      </div>

      {activeTab === "history" ? (
        <div className="space-y-4">
          {transactionHistory.map((tx) => (
            <div key={tx.id} className="hover:bg-gray-800/30 p-2 rounded-lg">
              <div className="grid grid-cols-12 items-center gap-1">
                <span className="text-[#666] col-span-1">
                  NO.<a className="text-[#D56AFF] no-underline">{tx.id}</a>
                </span>
                <span className="col-span-2 text-sm flex items-center justify-center text-center transaction-type-bg transaction-type-border px-4 py-1 rounded-lg w-[80px]">
                  {tx.type}
                </span>
                <div className="col-span-3 flex items-center gap-2">
                  <div className="bg-emerald-500 w-6 h-6 rounded-full flex items-center justify-center">
                    {tx.token === "USDT" ? "T" : "$"}
                  </div>
                  <span>{tx.amount.toLocaleString()}</span>
                  {tx.type === "Swap" && (
                    <>
                      <span className="text-[#C0C0C0]">to</span>
                      <div className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center">
                        ₿
                      </div>
                      <span>{tx.toAmount}</span>
                    </>
                  )}
                </div>
                <div className="col-span-3">
                  <p className="font-medium">
                    To: <span>{tx.sendTo}</span>
                  </p>
                </div>
                <span className="col-span-2 text-[#C0C0C0] text-sm">
                  {tx.date}
                </span>
                <div className="col-span-1">
                  <p
                    className={`${tx.status === "Succeed" ? "text-[#6CFF85] bg-[#007F1E36]" : "text-[#FF6C6F] bg-[#7F000236]"} text-center rounded-md px-1.5 py-1 font-bold w-full`}
                  >
                    {tx.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col max-h-[350px] gap-5 overflow-y-auto">
          {listPendingTransaction?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-800/30 p-4 rounded-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <p className="text-gray-400">Hash:</p>
                  <p className="font-medium">
                    {item.transaction_hash.slice(0, 6)}...
                    {item.transaction_hash.slice(-4)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-gray-400">From:</p>
                  <p className="font-medium">
                    {item.from_address.slice(0, 6)}...
                    {item.from_address.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p>Block Number : </p>
                <p>{item.block_number}</p>
              </div>
              {!isSigned && (
                <div className="flex items-center gap-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    onClick={() => handleSignTransaction(item.transaction_hash)}
                    disabled={loadingStates[item.transaction_hash]}
                  >
                    {loadingStates[item.transaction_hash]
                      ? "Signing..."
                      : "Sign"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
