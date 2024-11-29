/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
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
const transactions: Transaction[] = [
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
  {
    id: 3,
    type: "Swap",
    amount: 12067,
    token: "USDT",
    toAmount: 0.15272,
    toToken: "BTC",
    date: "15/11/2024, 16:30",
    sendTo: "0xd3...1d4f",
    status: "Failed",
  },
  {
    id: 4,
    type: "Receive",
    amount: 12000,
    token: "USDT",
    date: "10/11/2024, 14:20",
    sendTo: "0xd3...1d4f",
    status: "Failed",
  },
  {
    id: 5,
    type: "Send",
    amount: 4159,
    token: "USD",
    date: "05/11/2024, 09:45",
    sendTo: "0xd3...1d4f",
    status: "Failed",
  },
];
export default function TransactionTable() {
  return (
    <div className="border border-[#0b0b0b] bg-black rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex gap-2">
            <Image src="/info.svg" width={14} height={14} alt="icon" />
            <h3 className="text-xl gradient-text font-bold">
              CURRENT TRANSACTIONS
            </h3>
          </div>
          <p className="text-[#FFFFFF80] text-sm">
            Lorem Ipsum has been the industry's standard
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
        <p className="text-sm cursor-pointer">History</p>
        <p className="text-sm text-[#3D3D3D] cursor-pointer">
          Pending Transaction
        </p>
      </div>
      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="hover:bg-gray-800/30 p-2 rounded-lg">
            <div className="grid grid-cols-12 items-center gap-1">
              <span className="text-[#666] col-span-1">
                NO.<a className="text-[#D56AFF] no-underline">{tx.id}</a>
              </span>
              <span className="col-span-2 text-center transaction-type-bg transaction-type-border px-4 py-1 rounded-lg">
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
    </div>
  );
}
