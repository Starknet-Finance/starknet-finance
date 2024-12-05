"use client";

import { ethers } from "ethers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSupportedTokens from "~~/hooks/useSupportedTokens";
import { fetchPriceFromCoingecko } from "~~/services/web3/PriceService";

import { Transaction, TransactionStep } from "~~/types/assistant";
import { Address } from "../scaffold-stark";
import { getChecksumAddress } from "starknet";

const SendTokenTransaction = ({
  step,
  transaction,
}: {
  step: TransactionStep;
  transaction: Transaction;
}) => {
  const { data: supportedTokens, isLoading } = useSupportedTokens();

  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokenUri, setTokenUri] = useState("");
  const [addressBookAddress, setAddressBookAddress] = useState<null | {
    name: string;
  }>(null);

  // get token price
  const handleInit = async () => {
    const tokenPrice = await fetchPriceFromCoingecko(
      transaction.fromToken.symbol,
    );

    const amount = ethers.formatEther(transaction.toAmount || "0");
    const price = tokenPrice * parseFloat(amount);
    setTokenPrice(price);

    // get token uri
    const tokenUri = supportedTokens?.content?.find(
      (token) => token.address === transaction.fromToken.address,
    )?.logoUri;
    setTokenUri(tokenUri || "");

    // check if address is in address book
    const addressBook = await getAddressBook();

    const addressBookAddress = addressBook?.find(
      (address: any) =>
        getChecksumAddress(address.address) ===
        getChecksumAddress(transaction.receiver!),
    );
    // Don't set empty string, keep it as null if not found
    setAddressBookAddress(addressBookAddress || null);
  };

  const getAddressBook = async () => {
    const addressBook = localStorage.getItem("addressBook");
    return JSON.parse(addressBook || "[]");
  };

  useEffect(() => {
    handleInit();
  }, [isLoading]);

  return (
    <div className="bg-[#131313] rounded-md relative">
      <div className="bg-[#F8F8F80D] px-3 py-1 rounded-md w-fit cursor-pointer absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="text-[13px] font-semibold">Send To</p>
      </div>
      <div className=" flex items-center gap-1 px-3 py-5 relative">
        <Image
          src={"/ai-assistant/remove-icon.svg"}
          alt="icon"
          width={14}
          height={14}
          className="cursor-pointer absolute top-3 right-3"
        />
        <img src={tokenUri} alt="icon" width={32} height={32} />
        <p className="font-medium text-lg">
          {ethers.formatEther(transaction.toAmount || "0")}
        </p>
        <p className="text-[#C0C0C0] text-[14px] font-medium ml-1">
          ~${tokenPrice.toFixed(2)}
        </p>
      </div>
      <div className="bg-[#65656526] h-[1px] w-full"></div>
      <div className="flex items-center gap-3 px-3 py-5">
        <div className="flex items-end justify-between w-full">
          <div>
            {addressBookAddress !== null && (
              <p className="font-medium text-lg">
                {(addressBookAddress as any)?.name}
              </p>
            )}
            <Address address={transaction.receiver as `0x${string}`} />
          </div>
          {/* <Image
            src={"/copy-icon.svg"}
            alt="icon"
            width={16}
            height={16}
            className="cursor-pointer"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default SendTokenTransaction;
