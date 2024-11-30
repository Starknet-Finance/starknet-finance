"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Call } from "starknet";
import { useAccount } from "~~/hooks/useAccount";
import { useAIAssistantState } from "~~/services/store/assistant";
import { BatchTransaction, Transaction } from "~~/types/assistant";

export default function FormMessage() {
  const { address, account } = useAccount();
  const [message, setMessage] = useState("");

  const { messages, setMessages, setIsLoading, isLoading, createNewChat } =
    useAIAssistantState();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // check if message is empty
    if (message.trim() === "") return toast.error("Message is empty");
    if (!account) return toast.error("Please connect your wallet");

    try {
      setIsLoading(true);
      toast.loading("Processing...");

      if (messages.length === 0) {
        createNewChat();
      }

      // if this is first message, add address book to chat history

      let tempMessages = messages.map((message) => ({
        sender: message.sender,
        content: message.content,
      }));
      let addressBookData = "";
      const addressBook = localStorage.getItem("addressBook");
      addressBookData = addressBook
        ? `Here is the current connected account's address book: ${addressBook}, when the receiver is a name and you cant find it in the address book, give me error, else if user ask to do something with address book, you can use this data, for example, send 100 USDC to [name] in address book, you can read that address from name and construct the transaction`
        : "";
      tempMessages = [
        {
          sender: "user",
          content: addressBookData,
        },
        ...tempMessages,
      ];

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "user",
          content: message,
          timestamp: Date.now(),
        },
      ]);
      // submit message to brian
      const response = await fetch("https://api.brianknows.org/api/v0/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-brian-api-key": "brian_AnrbN1JzeWQqKK6l5",
        },
        body: JSON.stringify({
          prompt: message,
          address,
          messages: tempMessages,
          chainId: "4012", // starknet mainnet
        }),
      });
      const data = await response.json();

      console.log(messages);

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      if (data.result && data.result.length > 0) {
        // check if this is a batch transaction (multiple results)
        if (data.result.length > 1) {
          const allCalls: Call[] = [];
          const subTransactions: Transaction[] = [];

          // process each transaction in the batch
          for (const result of data.result) {
            if (result.data.steps && result.data.steps.length > 0) {
              const calls = result.data.steps;
              allCalls.push(...calls);
              subTransactions.push(result.data);
            }
          }

          // connect all response description and connect by and to construct the batch description
          const batchDescription = data.result
            .map((r: any) => r.data.description)
            .join(" and ");

          //  batch transaction
          const batchTransaction: BatchTransaction = {
            description: batchDescription,
            batchDescription: `Batch transaction containing ${data.result.length} operations`,
            steps: data.result.flatMap((r: any) => r.data.steps || []),
            multicallData: allCalls,
            isBatch: true,
            subTransactions,
          };

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: "brian",
              content: batchTransaction.batchDescription,
              timestamp: Date.now(),
              transaction: batchTransaction,
            },
          ]);
        } else {
          // single transaction processing
          const result = data.result[0];
          if (result.data.steps && result.data.steps.length > 0) {
            const calls = result.data.steps;

            setMessages((prevMessages) => [
              ...prevMessages,
              {
                sender: "brian",
                content: result?.data?.description,
                timestamp: Date.now(),
                transaction: {
                  ...result.data,
                  multicallData: calls,
                  isBatch: false,
                },
              },
            ]);
          }
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "brian",
          content: `${error.message}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setMessage("");
      toast.dismiss();
    }
  };

  return (
    <div className="bg-white fixed bottom-0 w-[67.5vw] flex p-4 rounded-b-lg">
      <input
        className="bg-white outline-none px-3 flex-1 text-[#000]"
        placeholder="Ex: Transfer 100 USDT to address “0xd3j4333nejkjd87f76aa88vg9b”"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        disabled={isLoading}
        onClick={handleSubmit}
        className="disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer button-bg px-6 py-2.5 rounded-lg"
      >
        Start
      </button>
    </div>
  );
}
