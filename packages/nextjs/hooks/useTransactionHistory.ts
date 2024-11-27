import { useEffect, useMemo, useState } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import {
  Contract,
  RpcProvider,
  hash,
  uint256,
  getChecksumAddress,
} from "starknet";
import { universalErc20Abi } from "~~/utils/Constants";
import { EmittedEvent } from "@starknet-io/types-js/dist/types/api";
import { formatEther } from "ethers";
import { useInterval } from "usehooks-ts";

interface TransactionEvent {
  type: "send" | "receive";
  tokenAddress: string;
  amount: string;
  from: string;
  to: string;
  //   timestamp: number;
  hash: string;
}

export const useTransactionHistory = (tokenAddresses: string[]) => {
  const { address } = useAccount();
  const [history, setHistory] = useState<TransactionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const provider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl: `https://starknet-sepolia.public.blastapi.io/rpc/v0_7`,
      }),
    []
  );

  const fetchTransactionHistory = async () => {
    if (!address || tokenAddresses.length === 0) return;
    try {
      setLoading(true);
      const allEvents: TransactionEvent[] = [];

      for (const tokenAddress of tokenAddresses) {
        const blockNumber = (await provider.getBlockLatestAccepted())
          .block_number;

        const [sentEvents] = await Promise.all([
          provider.getEvents({
            from_block: { block_number: blockNumber - 50 },
            to_block: { block_number: blockNumber },
            chunk_size: 1000,
            keys: [
              [hash.getSelectorFromName("Transfer")], // Transfer events
            ],
            address: tokenAddress,
          }),
        ]);

        //   Process sent events
        const processedSentEvents = await processEvents(
          sentEvents.events,
          tokenAddress,
          address
        );

        allEvents.push(...processedSentEvents);
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
  }, [address, JSON.stringify(tokenAddresses)]);

  useInterval(async () => {
    fetchTransactionHistory();
  }, 10_000);

  return { history, loading, error, refetch: fetchTransactionHistory };
};

async function processEvents(
  events: EmittedEvent[],
  tokenAddress: string,
  accountAddress: string
): Promise<TransactionEvent[]> {
  const processedEvents: TransactionEvent[] = [];

  for (const event of events) {
    try {
      const fromAddress = getChecksumAddress(event.data[0]);
      const toAddress = getChecksumAddress(event.data[1]);
      const userAddress = getChecksumAddress(accountAddress);
      if (fromAddress !== userAddress && toAddress !== userAddress) continue;

      processedEvents.push({
        type: fromAddress === userAddress ? "send" : "receive",
        tokenAddress,
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
    } catch (err) {
      console.error("Error processing event:", err);
    }
  }

  return processedEvents;
}
