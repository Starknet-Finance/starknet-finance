import Image from "next/image";
import { TransactionInfo } from "./TransactionInfo";

const CHAT_MESSAGES = [
  {
    id: 1,
    sender: {
      id: "user1",
      name: "John Doe",
    },
    content: "Swap 100 USDC to BTC then send to Carlos",
    timestamp: "2024-11-28T09:00:00Z",
    status: "read", // read, delivered, sent
  },

  {
    id: 2,
    sender: {
      id: "user2",
      name: "John Doe",
    },
    content:
      "You’re about to swap 100 UDSC to BTC then send to Carlos (0xd3...12c5). Here’s your transaction review.",
    sendTransaction: true,
    receiveToken: false,
    timestamp: "2024-11-28T09:00:00Z",
    status: "read", // read, delivered, sent
  },
  {
    id: 3,
    sender: {
      id: "user2",
      name: "John Doe",
    },
    content:
      "You’re about to swap 100 UDSC to BTC then send to Carlos (0xd3...12c5). Here’s your transaction review.",
    sendTransaction: false,
    receiveToken: false,
    timestamp: "2024-11-28T09:00:00Z",
    status: "read", // read, delivered, sent
  },
  {
    id: 4,
    sender: {
      id: "user2",
      name: "John Doe",
    },
    content:
      "You’re about to swap 100 UDSC to BTC then send to Carlos (0xd3...12c5). Here’s your transaction review.",
    sendTransaction: false,
    receiveToken: false,
    timestamp: "2024-11-28T09:00:00Z",
    status: "read", // read, delivered, sent
  },
  {
    id: 6,
    sender: {
      id: "user2",
      name: "John Doe",
    },
    content:
      "You’re about to swap 100 UDSC to BTC then send to Carlos (0xd3...12c5). Here’s your transaction review.",
    sendTransaction: false,
    receiveToken: true,
    timestamp: "2024-11-28T09:00:00Z",
    status: "read", // read, delivered, sent
  },
  {
    id: 6,
    sender: {
      id: "user2",
      name: "John Doe",
    },
    content: "...",
    timestamp: "2024-11-28T09:00:00Z",
    status: "read", // read, delivered, sent
  },
  {
    id: 11,
    sender: {
      id: "user1",
      name: "John Doe",
    },
    content: "Swap 1s",
    timestamp: "2024-11-28T09:00:00Z",
    status: "read",
  },
];

const CURRENT_USER_ID = "user1";

export default function ListMessage() {
  return (
    <div className="flex flex-col h-full relative">
      <p
        className="text-2xl w-full py-5 rounded-t-lg text-center"
        style={{
          background: "rgba(255, 255, 255, 0.26)",
          backdropFilter: "blur(15.800000190734863px)",
        }}
      >
        Swap 100 USDC to BTC then send to Carlos
      </p>

      <div className="absolute top-[80px] bottom-0 left-0 right-0 flex flex-col gap-4 p-4 overflow-y-auto">
        {CHAT_MESSAGES.map((message) => (
          <div key={message.id}>
            <div
              className={`flex flex-col gap-1 ${
                message.sender.id === CURRENT_USER_ID
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div className="flex gap-2 max-w-[400px]">
                {message.sender.id !== CURRENT_USER_ID && (
                  <Image
                    src="/ai-avt.svg"
                    alt="avt"
                    className="h-fit"
                    width={40}
                    height={40}
                  />
                )}
                <div>
                  {message.sender.id === CURRENT_USER_ID && (
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
                    {message.receiveToken && (
                      <button className="w-full button-bg text-white px-5 py-2.5 rounded-lg text-sm mt-2">
                        Receive Token
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {message.sendTransaction && (
              <div className="ml-12 mt-2">
                <TransactionInfo />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
