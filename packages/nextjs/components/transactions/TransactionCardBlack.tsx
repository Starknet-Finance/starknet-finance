import Image from "next/image";

interface TransactionCardProps {
  amount: string;
  usdAmount: string;
  recipient: {
    name: string;
    address: string;
  };
  timestamp: string;
}

const TransactionCardBlack: React.FC<TransactionCardProps> = ({
  amount,
  usdAmount,
  recipient,
  timestamp,
}) => {
  return (
    <div>
      <div className="bg-[#000] rounded-t-lg p-4">
        {/* Title */}
        <p className="text-sm text-white mb-2">Send</p>

        {/* Amount Section */}
        <div className="flex items-center gap-1 mb-6">
          <Image src="/btc.png" alt="BTC" width={32} height={32} />
          <div className="flex items-center gap-1.5">
            <span className="text-[26px] text-white">{amount}</span>
            <span className="text-sm text-[#C0C0C0]"> ~${usdAmount}</span>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-[1px] bg-[#65656526] mb-5"></div>

          {/* To Label */}
          <div className="absolute top-[-13px] left-1/2 -translate-x-1/2">
            <div className="flex justify-center">
              <div className="bg-[#3A3A3A] flex items-center justify-center rounded-md w-20 h-6">
                <p className="text-white text-[13px]">To</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#474747] rounded-lg flex items-center justify-center">
            <p className="text-[15px] text-white"> {recipient.name[0]}</p>
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-white">
              {recipient.name}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#929292]">
                {recipient.address}
              </span>
              <Image
                src="/copy-icon.svg"
                alt="Copy"
                className="cursor-pointer"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Timestamp */}
      <div className="bg-[#E8C2FF33] rounded-b-lg py-4 flex items-center justify-center gap-2">
        <div className="w-4 h-4 rounded-full flex items-center justify-center">
          <Image src="/timer.svg" width={16} height={16} alt="icon" />
        </div>
        <span className="text-[#E8C2FF] text-sm">{timestamp}</span>
      </div>
    </div>
  );
};

export default TransactionCardBlack;
