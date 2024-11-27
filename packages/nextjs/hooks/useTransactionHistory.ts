import { useEffect, useMemo, useState } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import {
  Contract,
  RpcProvider,
  hash,
  uint256,
  getChecksumAddress,
  TransactionReceipt,
  GetTransactionReceiptResponse,
} from "starknet";
import { sepoliaAvnuAddress, universalErc20Abi } from "~~/utils/Constants";
import { EmittedEvent } from "@starknet-io/types-js/dist/types/api";
import { formatEther } from "ethers";
import { useInterval } from "usehooks-ts";
import { TransactionWithHash } from "@starknet-io/types-js/dist/types/api/nonspec";
import { useTargetNetwork } from "./scaffold-stark/useTargetNetwork";

interface TransactionEvent {
  type: "send" | "receive" | "approve" | "swap";
  contractAddress: string;
  amount?: string;
  from?: string;
  to?: string;
  //   timestamp: number;
  hash: string;
  swap?: {
    taker_address: string;
    sell_address: string;
    sell_amount: string;
    buy_address: string;
    buy_amount: string;
    beneficiary: string;
  };
  receipt?: any;
}

export const useTransactionHistory = (contractAddresses: string[]) => {
  const { address } = useAccount();
  const [history, setHistory] = useState<TransactionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { targetNetwork } = useTargetNetwork();

  const publicNodeUrl = targetNetwork.rpcUrls.public.http[0];

  const publicClient = useMemo(() => {
    return new RpcProvider({
      nodeUrl: publicNodeUrl,
    });
  }, [publicNodeUrl]);
  const fetchTransactionHistory = async () => {
    if (!address || contractAddresses.length === 0) return;
    try {
      setLoading(true);
      const allEvents: TransactionEvent[] = [];

      const blockNumber = (await publicClient.getBlockLatestAccepted())
        .block_number;

      for (const contractAddress of contractAddresses) {
        const [sentEvents] = await Promise.all([
          publicClient.getEvents({
            from_block: { block_number: blockNumber - 50 },
            to_block: { block_number: blockNumber },
            chunk_size: 1000,
            keys: [[hash.getSelectorFromName("Transfer")]],
            address: contractAddress,
          }),
        ]);

        const [approvalEvents] = await Promise.all([
          publicClient.getEvents({
            from_block: { block_number: blockNumber - 50 },
            to_block: { block_number: blockNumber },
            chunk_size: 1000,
            keys: [
              //   [hash.getSelectorFromName("Transfer")], // Transfer events
              [hash.getSelectorFromName("Approval")], // Swap events
            ],
            address: contractAddress,
          }),
        ]);

        //   get swap events
        const [swapEvents] = await Promise.all([
          publicClient.getEvents({
            from_block: { block_number: blockNumber - 50 },
            to_block: { block_number: blockNumber },
            chunk_size: 1000,
            keys: [
              [hash.getSelectorFromName("Swap")], // Transfer events
            ],
            address: sepoliaAvnuAddress,
          }),
        ]);

        //   Process sent events
        const processedSentEvents = await processEvents(
          sentEvents.events,
          contractAddress,
          address,
          "send"
        );

        const processedApproveEvents = await processEvents(
          approvalEvents.events,
          contractAddress,
          address,
          "approve"
        );

        const processedSwapEvents = await processEvents(
          swapEvents.events,
          contractAddress,
          address,
          "swap"
        );

        allEvents.push(
          ...processedSentEvents,
          ...processedApproveEvents,
          ...processedSwapEvents
        );

        // then do transaction receipt here

        for (const event of allEvents) {
          const receipt = await publicClient.getTransactionReceipt(event.hash);
          event.receipt = receipt;
        }
      }

      setHistory(allEvents);
    } catch (err) {
      console.error("Error fetching transaction history:", err);
      setError("Failed to fetch transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [address, JSON.stringify(contractAddresses)]);

  useInterval(async () => {
    fetchTransactionHistory();
  }, 10_000);

  return { history, loading, error, refetch: fetchTransactionHistory };
};

async function processEvents(
  events: EmittedEvent[],
  contractAddress: string,
  accountAddress: string,
  type: "send" | "approve" | "swap"
): Promise<TransactionEvent[]> {
  const processedEvents: TransactionEvent[] = [];

  for (const event of events) {
    try {
      const fromAddress = getChecksumAddress(event.data[0]);
      const toAddress = getChecksumAddress(event.data[1]);
      const userAddress = getChecksumAddress(accountAddress);
      if (fromAddress !== userAddress && toAddress !== userAddress) continue;

      if (type === "send") {
        processedEvents.push({
          type: fromAddress === userAddress ? "send" : "receive",
          contractAddress,
          amount: formatEther(
            uint256
              .uint256ToBN({
                low: event.data[2],
                high: event.data[3],
              })
              .toString()
          ),
          from: event.data[0],
          to: event.data[1],
          // timestamp: Number(event.),
          hash: event.transaction_hash,
        });
      } else if (type === "approve") {
        processedEvents.push({
          type: "approve",
          contractAddress,
          amount: formatEther(
            uint256
              .uint256ToBN({
                low: event.data[2],
                high: event.data[3],
              })
              .toString()
          ),
          from: event.data[0],
          to: event.data[1],
          // timestamp: Number(event.),
          hash: event.transaction_hash,
        });
      } else if (type === "swap") {
        processedEvents.push({
          type: "swap",
          contractAddress: contractAddress,
          hash: event.transaction_hash,
          swap: {
            taker_address: event.data[0],
            sell_address: event.data[1],
            sell_amount: formatEther(
              uint256
                .uint256ToBN({
                  low: event.data[2],
                  high: event.data[3],
                })
                .toString()
            ),
            buy_address: event.data[4],
            buy_amount: formatEther(
              uint256
                .uint256ToBN({
                  low: event.data[5],
                  high: event.data[6],
                })
                .toString()
            ),
            beneficiary: event.data[7],
          },
        });
      }
    } catch (err) {
      console.error("Error processing event:", err);
    }
  }

  return processedEvents;
}
