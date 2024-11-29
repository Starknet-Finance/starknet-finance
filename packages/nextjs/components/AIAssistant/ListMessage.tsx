"use client";

import Image from "next/image";
import { TransactionInfoBatch, TransactionInfoSingle } from "./TransactionInfo";
import { useAIAssistantState } from "~~/services/store/assistant";
import { useEffect, useRef } from "react";

export default function ListMessage() {
  const { messages } = useAIAssistantState();
  const messagesEndRef = useRef<HTMLDivElement>(null);


  console.log(messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      <p
        className="text-2xl w-full py-5 rounded-t-lg text-center"
        style={{
          background: "rgba(255, 255, 255, 0.26)",
          backdropFilter: "blur(15.800000190734863px)",
        }}
      >
        {messages[0].content}
      </p>

      <div className="absolute top-[80px] bottom-0 left-0 right-0 flex flex-col gap-4 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`flex flex-col gap-1 ${
                message.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex gap-2 w-[40%]">
                {message.sender !== "user" && (
                  <Image
                    src="/ai-avt.svg"
                    alt="avt"
                    className="h-fit"
                    width={40}
                    height={40}
                  />
                )}
                <div>
                  {message.sender === "user" && (
                    <p className="text-[15px] font-medium text-right mb-1">
                      <span className="text-[#D56AFF]">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>{" "}
                      You
                    </p>
                  )}
                  <div
                    className={`rounded-lg py-3 px-3.5 bg-white text-[#464646]`}
                  >
                    <p>{message.content}</p>
                    {/* {message.receiveToken && (
                      <button className="w-full button-bg text-white px-5 py-2.5 rounded-lg text-sm mt-2">
                        Receive Token
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
            {message.transaction && (
              <div className="ml-12 mt-2">
                {message.transaction.isBatch ? (
                  <TransactionInfoBatch transaction={message.transaction} />
                ) : (
                  <TransactionInfoSingle transaction={message.transaction} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
