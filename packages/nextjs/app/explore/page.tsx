"use client";
import type { NextPage } from "next";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "~~/hooks/useAccount";
import { useTransactionStorage } from "~~/hooks/useTransactionStorage";

const Explore: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { addTransaction } = useTransactionStorage();
  const router = useRouter();
  const [url, setUrl] = useState<string>("http://localhost:3001");
  const [displayUrl, setDisplayUrl] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow) return;

      switch (event.data.type) {
        case "GET_PARENT_ADDRESS":
          iframeWindow.postMessage(
            {
              type: "PARENT_ADDRESS",
              address: connectedAddress,
            },
            "*",
          );
          break;

        case "EXECUTE_TRANSACTION":
          try {
            console.log("Received transaction calls:", event.data.calls);

            // Extract transaction details from the first call
            const firstCall = event.data.calls[0];
            const amount = BigInt(firstCall.calldata[1]);
            const recipientAddress =
              "0x" + BigInt(firstCall.calldata[0]).toString(16);

            // Add transaction to storage
            addTransaction({
              meta: {
                type: "transfer",
                amount: Number(amount) / 1e18, // Convert from wei to ETH
                token: {
                  symbol: "ETH",
                  logo: "/token-placeholder.png",
                  name: "Ethereum",
                  address: firstCall.contract_address,
                },
                recipient: {
                  name:
                    recipientAddress.slice(0, 6) +
                    "..." +
                    recipientAddress.slice(-4),
                  address: recipientAddress,
                },
              },
              callData: event.data.calls,
            });

            // Redirect to transaction-batch page
            router.push("/transaction-batch");

            iframeWindow.postMessage(
              {
                type: "TRANSACTION_RESPONSE",
                result: {
                  transaction_hash: "0x...", // Replace with actual transaction hash
                },
              },
              "*",
            );
          } catch (error) {
            iframeWindow.postMessage(
              {
                type: "TRANSACTION_RESPONSE",
                error:
                  error instanceof Error ? error.message : "Transaction failed",
              },
              "*",
            );
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [connectedAddress, addTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`;
    }
    setDisplayUrl(formattedUrl);
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="flex-1 px-4 py-2 text-white bg-gray-800 rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 w-[130px] button-bg rounded-lg flex justify-center items-center gap-2"
        >
          Load
        </button>
      </form>
      {displayUrl && (
        <div className="w-full h-[80vh] rounded-lg overflow-hidden border border-gray-300">
          <iframe
            ref={iframeRef}
            src={displayUrl}
            className="w-full h-full"
            title="Website Preview"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
          />
        </div>
      )}
    </div>
  );
};

export default Explore;
