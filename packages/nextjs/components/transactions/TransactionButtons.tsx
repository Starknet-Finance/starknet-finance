import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Routes } from "~~/utils/Routes";

interface TransactionButtonProps {
  icon: string;
  label: string;
  path: string;
}

const TransactionButton = ({ icon, label, path }: TransactionButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      className={`w-full flex justify-center button-bg px-6 py-3 rounded-lg items-center gap-2
        ${pathname === path ? "shadow-[inset_0_0_0_2.5px_#c4aeff]" : ""}`}
      onClick={() => router.push(path)}
    >
      <span className="mr-1">
        <Image
          src={icon}
          width={label === "Swap" ? 14 : 10}
          height={label === "Swap" ? 14 : 10}
          alt="icon"
        />
      </span>
      {label}
    </button>
  );
};

export default function TransactionButtons() {
  return (
    <div className="flex items-end gap-4">
      <TransactionButton
        icon="/down.svg"
        label="Receive"
        path={Routes.transactionReceive}
      />
      <TransactionButton
        icon="/up.svg"
        label="Send"
        path={Routes.transactionSend}
      />
      <TransactionButton
        icon="/swap.svg"
        label="Swap"
        path={Routes.transactionSwap}
      />
    </div>
  );
}
