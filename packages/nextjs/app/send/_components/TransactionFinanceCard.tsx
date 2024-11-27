import Image from "next/image";
import TransactionCard from "~~/components/transactions/TransactionCard";

export const TransactionFinanceCard = ({
  token,
  amount,
  recipient,
  canRemove,
  isExpanded,
  onExpand,
  id,
}: {
  token: any;
  amount: any;
  recipient: any;
  canRemove?: boolean;
  isExpanded: boolean;
  onExpand: (isExpanded: boolean) => void;
  id: string;
}) => {
  return (
    <div className="bg-[#2B2B2B] rounded-md">
      <div className="flex items-center gap-2 p-2">
        <div className="w-10 h-10 bg-[#F8F8F82B] rounded-md flex items-center justify-center">
          <Image
            src="/arrow-narrow-up.png"
            alt="send"
            className="w-6 h-6"
            width={24}
            height={24}
          />
        </div>
        <div className="ml-2 flex-1">
          <div className="flex items-center gap-2">
            <Image
              src={token.logo}
              alt={token.symbol}
              className="w-6 h-6"
              width={24}
              height={24}
            />
            <span className="text-xl">{amount}</span>
            <span className="text-gray-400">~${amount * 40000}</span>
          </div>
          <div className="text-gray-400">
            To{" "}
            <span className="text-[#d56aff] underline">{recipient.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {canRemove && (
            <Image
              src="/delete-icon.svg"
              alt="delete"
              className="cursor-pointer"
              width={16}
              height={16}
            />
          )}

          <Image
            src="/arrow-down.svg"
            alt="expand"
            className={`cursor-pointer transition-transform duration-300 ${
              isExpanded ? "rotate-[-90deg]" : ""
            }`}
            width={20}
            height={20}
            onClick={() => onExpand(!isExpanded)}
          />
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#65656526]"></div>
      <div
        className={`grid transition-all duration-300 ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-2">
            <TransactionCard
              amount={amount.toString()}
              recipient={{
                name: recipient.name,
                address: recipient.address,
              }}
              usdAmount={(amount * 40000).toString()}
              timestamp={new Date().toLocaleString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
