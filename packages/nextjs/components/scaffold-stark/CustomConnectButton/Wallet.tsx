import React, { useState } from "react";
import { Connector } from "@starknet-react/core";
import Image from "next/image";
import { useTheme } from "next-themes";

const Wallet = ({
  handleConnectWallet,
  connector,
  loader,
}: {
  connector: Connector;
  loader: ({ src }: { src: string }) => string;
  handleConnectWallet: (
    e: React.MouseEvent<HTMLButtonElement>,
    connector: Connector,
  ) => void;
}) => {
  const [_, setClicked] = useState(false);
  const { resolvedTheme } = useTheme();

  // connector has two : dark and light icon
  const icon =
    typeof connector.icon === "object"
      ? resolvedTheme === "dark"
        ? (connector.icon.dark as string)
        : (connector.icon.light as string)
      : (connector.icon as string);
  return (
    <div
      className="bg-white cursor-pointer rounded-md flex flex-col items-center justify-center w-[180px] h-[130px]"
      onClick={(e: any) => {
        setClicked(true);
        handleConnectWallet(e, connector);
      }}
    >
      <Image
        alt={connector.name}
        loader={loader}
        src={icon}
        width={50}
        height={50}
      />
      <span className="text-[#111928] font-bold m-0 mt-3">
        {connector.name}
      </span>
    </div>
  );
};

export default Wallet;
