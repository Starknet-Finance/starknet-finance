import { ethers, formatEther } from "ethers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getChecksumAddress } from "starknet";
import useSupportedTokens from "~~/hooks/useSupportedTokens";
import { fetchPriceFromCoingecko } from "~~/services/web3/PriceService";
import { Transaction, TransactionStep } from "~~/types/assistant";

const SwapTransaction = ({
  step,
  transaction,
}: {
  step: TransactionStep;
  transaction: Transaction;
}) => {
  const { data: supportedTokens, isLoading } = useSupportedTokens();

  const [fromTokenPrice, setFromTokenPrice] = useState(0);
  const [toTokenPrice, setToTokenPrice] = useState(0);
  const [fromTokenUri, setFromTokenUri] = useState("");
  const [toTokenUri, setToTokenUri] = useState("");
  const [addressBookAddress, setAddressBookAddress] = useState<null | {
    name: string;
  }>(null);

  // get token price
  const handleInit = async () => {
    setFromTokenPrice(transaction.fromAmountUSD || 0);
    setToTokenPrice(transaction.toAmountUSD || 0);

    // get token uri
    const fromTokenUri = supportedTokens?.content?.find(
      (token) => token.address === transaction.fromToken.address,
    )?.logoUri;
    setFromTokenUri(fromTokenUri || "");

    const toTokenUri = supportedTokens?.content?.find(
      (token) => token.address === transaction.toToken.address,
    )?.logoUri;
    setToTokenUri(toTokenUri || "");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  return (
    <div className="bg-[#131313] rounded-md relative">
      <div className="bg-[#F8F8F80D] p-1 rounded-md w-fit cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Image
          src={"/ai-assistant/swap.svg"}
          alt="icon"
          width={16}
          height={16}
          className="rotate-90"
        />
      </div>
      <div className="flex items-center gap-1 px-3 py-5 relative">
        <Image
          src={"/ai-assistant/remove-icon.svg"}
          alt="icon"
          width={14}
          height={14}
          className="cursor-pointer absolute top-3 right-3"
        />
        <Image src={fromTokenUri} alt="icon" width={32} height={32} />
        <p className="font-medium text-lg">
          {formatEther(transaction.fromAmount || "0")}
        </p>
        <p className="text-[#C0C0C0] text-[14px] font-medium ml-1">
          ~${fromTokenPrice}
        </p>
      </div>
      <div className="bg-[#65656526] h-[1px] w-full"></div>
      <div className="flex items-center gap-1 px-3 py-5">
        <Image src={toTokenUri} alt="icon" width={32} height={32} />
        <p className="font-medium text-lg">
          {formatEther(transaction.toAmount || "0")}
        </p>
        <p className="text-[#C0C0C0] text-[14px] font-medium ml-1">
          ~${toTokenPrice}
        </p>
      </div>
    </div>
  );
};

export default SwapTransaction;
