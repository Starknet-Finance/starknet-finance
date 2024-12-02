/* eslint-disable react/no-unescaped-entities */
import { Connector, useConnect } from "@starknet-react/core";
import { useRef, useState } from "react";
import Wallet from "~~/components/scaffold-stark/CustomConnectButton/Wallet";
import { useLocalStorage } from "usehooks-ts";
import { burnerAccounts } from "~~/utils/devnetAccounts";
import { BurnerConnector } from "~~/services/web3/stark-burner/BurnerConnector";
import { useTheme } from "next-themes";
import { BlockieAvatar } from "../BlockieAvatar";
import GenericModal from "./GenericModal";
import scaffoldConfig from "~~/scaffold.config";
import { LAST_CONNECTED_TIME_LOCALSTORAGE_KEY } from "~~/utils/Constants";
import Image from "next/image";
import { PlusIcon } from "@radix-ui/react-icons";

const loader = ({ src }: { src: string }) => {
  return src;
};

const ConnectModal = () => {
  const modalRef = useRef<HTMLInputElement>(null);
  const [isBurnerWallet, setIsBurnerWallet] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const { connectors, connect, error, status, ...props } = useConnect();
  const [_, setLastConnector] = useLocalStorage<{ id: string; ix?: number }>(
    "lastUsedConnector",
    { id: "" },
    {
      initializeWithValue: false,
    },
  );
  const [, setLastConnectionTime] = useLocalStorage<number>(
    LAST_CONNECTED_TIME_LOCALSTORAGE_KEY,
    0,
  );

  const handleCloseModal = () => {
    if (modalRef.current) {
      modalRef.current.checked = false;
    }
  };

  function handleConnectWallet(
    e: React.MouseEvent<HTMLButtonElement>,
    connector: Connector,
  ): void {
    if (connector.id === "burner-wallet") {
      setIsBurnerWallet(true);
      return;
    }
    connect({ connector });
    setLastConnector({ id: connector.id });
    setLastConnectionTime(Date.now());
    handleCloseModal();
  }

  function handleConnectBurner(
    e: React.MouseEvent<HTMLButtonElement>,
    ix: number,
  ) {
    const connector = connectors.find(
      (it) => it.id == "burner-wallet",
    ) as BurnerConnector;
    if (connector) {
      connector.burnerAccount = burnerAccounts[ix];
      connect({ connector });
      setLastConnector({ id: connector.id, ix });
      setLastConnectionTime(Date.now());
      handleCloseModal();
    }
  }

  return (
    <div>
      <label
        htmlFor="connect-modal"
        className="rounded-lg px-3 py-2 cursor-pointer bg-white w-fit"
      >
        <span className="text-[#292929] font-medium text-[15px]">
          Connect Wallet
        </span>
      </label>

      <input
        ref={modalRef}
        type="checkbox"
        id="connect-modal"
        className="modal-toggle"
      />
      <GenericModal
        modalId="connect-modal"
        className="z-[99999] w-fit py-5 connect-wallet-modal"
      >
        <div className="relative">
          <Image
            src={"/decore-connect-wallet.svg"}
            alt="bg-decore"
            width={100}
            height={50}
            className="absolute left-0 bottom-0 z-10 w-[392px]"
          />
          <div className="relative z-20 px-3 py-5">
            <div className="flex items-center justify-center gap-3">
              <Image
                src={"/starknet-finance.svg"}
                alt="logo"
                width={48}
                height={48}
              />
              <Image
                src={"/switch-wallet.svg"}
                alt="logo"
                width={18}
                height={18}
              />
              <div className="bg-[#D1D5DB] flex items-center justify-center rounded-lg w-12 h-12">
                <PlusIcon color="#444444" width={12} height={12} />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-[32px]">
                {isBurnerWallet ? "Choose account" : "Connect your wallet"}
              </h3>
              <p className="text-[13px] text-[#FCFDFE] mt-1">
                Binance's blockchain platform for fast, low-cost token <br />
                transactions and decentralized applications.
              </p>

              {/* <label
              onClick={() => setIsBurnerWallet(false)}
              htmlFor="connect-modal"
              className="btn btn-ghost btn-sm btn-circle cursor-pointer"
            >
              ✕
            </label> */}
            </div>
            <div className="flex gap-2 mt-[30px]">
              {!isBurnerWallet ? (
                connectors.map((connector, index) => (
                  <Wallet
                    key={connector.id || index}
                    connector={connector}
                    loader={loader}
                    handleConnectWallet={handleConnectWallet}
                  />
                ))
              ) : (
                <div className="flex flex-col pb-[20px] justify-end gap-3">
                  <div className="h-[300px] overflow-y-auto flex w-full flex-col gap-2">
                    {burnerAccounts.map((burnerAcc, ix) => (
                      <div
                        key={burnerAcc.publicKey}
                        className="w-full flex flex-col"
                      >
                        <button
                          className={`hover:bg-gradient-modal border rounded-md text-neutral py-[8px] pl-[10px] pr-16 flex items-center gap-4 ${isDarkMode ? "border-[#385183]" : ""}`}
                          onClick={(e) => handleConnectBurner(e, ix)}
                        >
                          <BlockieAvatar
                            address={burnerAcc.accountAddress}
                            size={35}
                          />
                          {`${burnerAcc.accountAddress.slice(0, 6)}...${burnerAcc.accountAddress.slice(-4)}`}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button className="w-full button-bg px-5 py-2.5 rounded-lg">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default ConnectModal;
