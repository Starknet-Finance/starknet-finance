import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Transaction } from "~~/types/assistant";
import SendTokenTransaction from "./SendTokenTransaction";
import { useAccount } from "~~/hooks/useAccount";
import toast from "react-hot-toast";
import { getChecksumAddress } from "starknet";
import useSupportedTokens from "~~/hooks/useSupportedTokens";
import { fetchPriceFromCoingecko } from "~~/services/web3/PriceService";
import SwapTransaction from "./SwapTransaction";
import { useTransactionStorage } from "~~/hooks/useTransactionStorage";

const TransactionStatusSingle = ({
  transaction,
  status,
}: {
  transaction: Transaction;
  status: string;
}) => {
  const { data: supportedTokens, isLoading } = useSupportedTokens();

  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokenUri, setTokenUri] = useState("");
  const [addressBookAddress, setAddressBookAddress] = useState<null | {
    name: string;
  }>(null);

  const [fromTokenPrice, setFromTokenPrice] = useState(0);
  const [toTokenPrice, setToTokenPrice] = useState(0);
  const [fromTokenUri, setFromTokenUri] = useState("");
  const [toTokenUri, setToTokenUri] = useState("");

  // get token price
  const handleInitSend = async () => {
    const tokenPrice = await fetchPriceFromCoingecko(
      transaction?.fromToken?.symbol,
    );

    const amount = ethers.formatEther(transaction?.toAmount || "0");
    const price = tokenPrice * parseFloat(amount);
    setTokenPrice(price);

    // get token uri
    const tokenUri = supportedTokens?.content?.find(
      (token) => token?.address === transaction?.fromToken?.address,
    )?.logoUri;
    setTokenUri(tokenUri || "");

    // check if address is in address book
    const addressBook = await getAddressBook();

    const addressBookAddress = addressBook?.find(
      (address: any) =>
        getChecksumAddress(address.address) ===
        getChecksumAddress(transaction?.receiver!),
    );
    // Don't set empty string, keep it as null if not found
    setAddressBookAddress(addressBookAddress || null);
  };

  const handleInitSwap = async () => {
    setFromTokenPrice(transaction?.fromAmountUSD || 0);
    setToTokenPrice(transaction?.toAmountUSD || 0);

    // get token uri
    const fromTokenUri = supportedTokens?.content?.find(
      (token) => token?.address === transaction?.fromToken?.address,
    )?.logoUri;
    setFromTokenUri(fromTokenUri || "");

    const toTokenUri = supportedTokens?.content?.find(
      (token) => token?.address === transaction?.toToken?.address,
    )?.logoUri;
    setToTokenUri(toTokenUri || "");

    // check if address is in address book
    const addressBook = await getAddressBook();

    const addressBookAddress = addressBook?.find(
      (address: any) =>
        getChecksumAddress(address.address) ===
        getChecksumAddress(transaction?.receiver!),
    );
    // Don't set empty string, keep it as null if not found
    setAddressBookAddress(addressBookAddress || null);
  };

  const getAddressBook = async () => {
    const addressBook = localStorage.getItem("addressBook");
    return JSON.parse(addressBook || "[]");
  };

  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  useEffect(() => {
    if (transaction?.steps[0]?.entrypoint == "transfer") {
      handleInitSend();
    } else {
      handleInitSwap();
    }
  }, [isLoading]);
  return (
    <div className="bg-[#2D2D2D] rounded-xl p-2 max-w-[352px]">
      {transaction?.steps[1]?.entrypoint == "multi_route_swap" && (
        <div className="flex items-center gap-2 bg-[#232323] rounded-md p-2 h-[68px]">
          <div className="p-1.5 rounded-md bg-[#F8F8F80D]">
            <Image
              src={"/ai-assistant/swap.svg"}
              alt="icon"
              width={20}
              height={20}
            />
          </div>
          <div className="flex items-center gap-1">
            <img
              src={fromTokenUri}
              alt="icon"
              width={18}
              height={18}
              className="rounded-full"
            />
            <p className="text-lg font-medium">
              {ethers.formatEther(transaction?.fromAmount || "0")}
            </p>
          </div>
          <Image
            src={"/arrow-narrow-up.png"}
            alt="icon"
            width={20}
            height={20}
            className="rotate-90"
          />
          <div className="flex items-center gap-1">
            <img src={toTokenUri} alt="icon" width={18} height={18} />
            <p className="text-lg font-medium">
              {ethers.formatEther(transaction?.toAmount || "0")}
            </p>
          </div>
        </div>
      )}
      {/* <div className="flex items-center gap-1">
        <div className="bg-[#65656526] h-[1px] w-full"></div>
        <p className="text-[13px] text-[#4F4F4F] font-medium">And</p>
        <div className="bg-[#65656526] h-[1px] w-full"></div>
      </div> */}
      {transaction?.steps[0]?.entrypoint == "transfer" && (
        <div className="flex items-center gap-2 bg-[#232323] rounded-md p-2 h-[68px]">
          <div className="p-1.5 rounded-md bg-[#F8F8F80D]">
            <Image
              src={"/arrow-narrow-up.png"}
              alt="icon"
              width={20}
              height={20}
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Image src={"/btc.png"} alt="icon" width={18} height={18} />
              <p className="text-lg font-medium">
                {ethers.formatEther(transaction?.toAmount || "0")}
              </p>
              <p className="text-sm text-[#C0C0C0] font-medium">
                ~${tokenPrice}
              </p>
            </div>
            <p className="text-[15px] font-medium">
              To{" "}
              <span className="text-[#D56AFF] underline">
                {addressBookAddress?.name ||
                  truncateAddress(transaction.receiver || "")}
              </span>
            </p>
          </div>
        </div>
      )}
      <button className="h-[41px] bg-[#D5CECED6] w-full mt-2 rounded-lg text-sm text-[#292929] font-medium">
        {status}
      </button>
    </div>
  );
};

export const TransactionInfoSingle = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const { account } = useAccount();
  const [status, setStatus] = useState("");
  const { addTransaction } = useTransactionStorage();

  const handleOnConfirm = async () => {
    try {
      if (!account) return toast.error("Please connect your wallet");
      await account?.execute(transaction?.steps);
      setStatus("Signed");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToBatch = async () => {
    try {
      // For single transactions
      addTransaction({
        meta: {
          amount: parseFloat(ethers.formatEther(transaction.toAmount || "0")),
          token: {
            symbol: transaction.fromToken.symbol,
            logo: "", // You'll need to get this from supportedTokens
            name: transaction.fromToken.symbol,
            address: transaction.fromToken.address,
          },
          recipient: {
            name: "", // You might want to get this from addressBook
            address: transaction.receiver || "",
          },
        },
        callData: transaction.steps[0],
      });

      toast.success("Added to batch");
    } catch (error) {
      console.error("Failed to add to batch:", error);
      toast.error("Failed to add to batch. Please try again.");
    }
  };

  if (status) {
    return (
      <TransactionStatusSingle transaction={transaction} status={status} />
    );
  }

  return (
    <div className="bg-[#2D2D2D] rounded-xl p-2 max-w-[352px]">
      {transaction.steps?.map((step, index) => (
        <div key={index} className="rounded-md">
          <div className="flex flex-col gap-1">
            {/* -----transaction---- */}
            {step?.entrypoint == "multi_route_swap" && (
              <SwapTransaction step={step} transaction={transaction} />
            )}

            {/* -----send to------ */}
            {step?.entrypoint == "transfer" && (
              <SendTokenTransaction step={step} transaction={transaction} />
            )}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleAddToBatch}
          className="text-[#292929] text-sm bg-white rounded-lg h-[41px] w-full"
        >
          Add To Batch
        </button>
        <button
          onClick={handleOnConfirm}
          className="text-white text-sm button-bg rounded-lg h-[41px] w-full"
        >
          Confirm & Sign
        </button>
      </div>
    </div>
  );
};

type SingleTransactionStatus = {
  type: string;
  amount: string;
  price: number;
  tokenUri: string;
  addressBookAddress: { name: string } | null;
  receiver: string;
};

type BatchTransactionStatus = {
  type: string;
  fromAmount: string | undefined;
  toAmount: string | undefined;
  fromAmountUSD: number | undefined;
  toAmountUSD: number | undefined;
  fromTokenUri: string | undefined;
  toTokenUri: string | undefined;
};
const TransactionStatusBatch = ({
  transaction,
  status,
}: {
  transaction: Transaction;
  status: string;
}) => {
  const { data: supportedTokens, isLoading, isSuccess } = useSupportedTokens();
  const [transactionStatus, setTransactionStatus] = useState<
    (SingleTransactionStatus | BatchTransactionStatus)[]
  >([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // get token price
  const handleInitSend = async (subTransaction: Transaction) => {
    const tokenPrice = await fetchPriceFromCoingecko(
      subTransaction?.fromToken?.symbol,
    );

    const amount = ethers.formatEther(subTransaction?.toAmount || "0");
    const price = tokenPrice * parseFloat(amount);

    // get token uri
    const tokenUri =
      supportedTokens?.content?.find(
        (token) => token?.address === subTransaction?.fromToken?.address,
      )?.logoUri || "";

    // check if address is in address book
    const addressBook = await getAddressBook();

    const addressBookAddress = addressBook?.find(
      (address: any) =>
        getChecksumAddress(address.address) ===
        getChecksumAddress(subTransaction?.receiver!),
    );

    return {
      type: "transfer",
      amount,
      price,
      tokenUri,
      addressBookAddress,
      receiver: subTransaction?.receiver || "",
    };
  };

  const handleInitSwap = async (subTransaction: Transaction) => {
    // get token uri
    const fromTokenUri = supportedTokens?.content?.find(
      (token) => token?.address === subTransaction?.fromToken?.address,
    )?.logoUri;

    const toTokenUri = supportedTokens?.content?.find(
      (token) => token?.address === subTransaction?.toToken?.address,
    )?.logoUri;

    return {
      type: "swap",
      fromAmount: subTransaction?.fromAmount,
      toAmount: subTransaction?.toAmount,
      fromAmountUSD: subTransaction?.fromAmountUSD,
      toAmountUSD: subTransaction?.toAmountUSD,
      fromTokenUri,
      toTokenUri,
    };
  };

  const handleInit = async () => {
    let txs: any = [];
    const subTransactions = transaction?.subTransactions || [];
    for (const subTransaction of subTransactions) {
      let txStatus;
      if (subTransaction?.steps[0]?.entrypoint == "transfer") {
        txStatus = await handleInitSend(subTransaction);
      } else if (subTransaction?.steps[1]?.entrypoint == "multi_route_swap") {
        txStatus = await handleInitSwap(subTransaction);
      }
      txs.push(txStatus);
    }
    setTransactionStatus(txs);
    setIsInitialized(true);
  };

  const getAddressBook = async () => {
    const addressBook = localStorage.getItem("addressBook");
    return JSON.parse(addressBook || "[]");
  };

  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  useEffect(() => {
    handleInit();
  }, []);

  return (
    <div className="bg-[#2D2D2D] rounded-xl p-2 max-w-[352px]">
      {transactionStatus?.map((txStatus, index) => {
        if (txStatus.type === "swap") {
          return (
            <div key={index}>
              <div className="flex items-center gap-2 bg-[#232323] rounded-md p-2 h-[68px]">
                <div className="p-1.5 rounded-md bg-[#F8F8F80D]">
                  <Image
                    src={"/ai-assistant/swap.svg"}
                    alt="icon"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src={(txStatus as BatchTransactionStatus).fromTokenUri}
                    alt="icon"
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
                  <p className="text-lg font-medium">
                    {ethers.formatEther(
                      (txStatus as BatchTransactionStatus).fromAmount || "0",
                    )}
                  </p>
                </div>
                <Image
                  src={"/arrow-narrow-up.png"}
                  alt="icon"
                  width={20}
                  height={20}
                  className="rotate-90"
                />
                <div className="flex items-center gap-1">
                  <img
                    src={(txStatus as BatchTransactionStatus).toTokenUri}
                    alt="icon"
                    width={18}
                    height={18}
                  />
                  <p className="text-lg font-medium">
                    {ethers.formatEther(
                      (txStatus as BatchTransactionStatus).toAmount || "0",
                    )}
                  </p>
                </div>
              </div>
              {index < transactionStatus.length - 1 && (
                <div className="flex items-center gap-1 my-2">
                  <div className="bg-[#65656526] h-[1px] w-full"></div>
                  <p className="text-[13px] text-[#4F4F4F] font-medium">Then</p>
                  <div className="bg-[#65656526] h-[1px] w-full"></div>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div key={index}>
              <div className="flex items-center gap-2 bg-[#232323] rounded-md p-2 h-[68px]">
                <div className="p-1.5 rounded-md bg-[#F8F8F80D]">
                  <Image
                    src={"/arrow-narrow-up.png"}
                    alt="icon"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <img
                      src={(txStatus as SingleTransactionStatus).tokenUri}
                      alt="icon"
                      width={18}
                      height={18}
                    />
                    <p className="text-lg font-medium">
                      {(txStatus as SingleTransactionStatus).amount}
                    </p>
                    <p className="text-sm text-[#C0C0C0] font-medium">
                      ~${(txStatus as SingleTransactionStatus).price}
                    </p>
                  </div>
                  <p className="text-[15px] font-medium">
                    To{" "}
                    <span className="text-[#D56AFF] underline">
                      {(txStatus as SingleTransactionStatus).addressBookAddress
                        ?.name ||
                        truncateAddress(
                          (txStatus as SingleTransactionStatus)
                            .addressBookAddress == null
                            ? (txStatus as SingleTransactionStatus).receiver
                            : (txStatus as SingleTransactionStatus)
                                ?.addressBookAddress?.name || "",
                        )}
                    </span>
                  </p>
                </div>
              </div>
              {index < transactionStatus.length - 1 && (
                <div className="flex items-center gap-1 my-2">
                  <div className="bg-[#65656526] h-[1px] w-full"></div>
                  <p className="text-[13px] text-[#4F4F4F] font-medium">Then</p>
                  <div className="bg-[#65656526] h-[1px] w-full"></div>
                </div>
              )}
            </div>
          );
        }
      })}
      <button className="h-[41px] bg-[#D5CECED6] w-full mt-2 rounded-lg text-sm text-[#292929] font-medium">
        {status}
      </button>
    </div>
  );
};
export const TransactionInfoBatch = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const { account } = useAccount();
  const [status, setStatus] = useState("");
  const { addTransaction } = useTransactionStorage();

  const handleOnConfirm = async () => {
    try {
      if (!account) return toast.error("Please connect your wallet");
      await account?.execute(transaction?.steps);
      setStatus("Signed");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToBatch = async () => {
    try {
      // For batch transactions, add each sub-transaction
      transaction.subTransactions?.forEach((subTx) => {
        addTransaction({
          meta: {
            amount: parseFloat(ethers.formatEther(subTx.toAmount || "0")),
            token: {
              symbol: subTx.fromToken.symbol,
              logo: "", // You'll need to get this from supportedTokens
              name: subTx.fromToken.symbol,
              address: subTx.fromToken.address,
            },
            recipient: {
              name: "", // You might want to get this from addressBook
              address: subTx.receiver || "",
            },
          },
          callData: subTx.steps[0],
        });
      });

      toast.success("Added to batch");
    } catch (error) {
      console.error("Failed to add to batch:", error);
      toast.error("Failed to add to batch. Please try again.");
    }
  };

  if (status) {
    return <TransactionStatusBatch transaction={transaction} status={status} />;
  }

  return (
    <div className="bg-[#2D2D2D] rounded-xl p-2 max-w-[352px]">
      <div>
        {transaction?.subTransactions?.map((transaction, index) => (
          <div key={index} className="rounded-md">
            {transaction.steps.map((step, index) => (
              <div key={index} className="flex flex-col gap-1">
                {/* -----transaction---- */}
                {step?.entrypoint == "multi_route_swap" && (
                  <SwapTransaction step={step} transaction={transaction} />
                )}
                <div className="flex items-center gap-1">
                  <div className="bg-[#65656526] h-[1px] w-full"></div>
                  <p className="text-[13px] text-[#4F4F4F] font-medium">Then</p>
                  <div className="bg-[#65656526] h-[1px] w-full"></div>
                </div>
                {/* -----send to------ */}
                {step?.entrypoint == "transfer" && (
                  <SendTokenTransaction step={step} transaction={transaction} />
                )}

                {/* -----then---- */}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleAddToBatch}
          className="text-[#292929] text-sm bg-white rounded-lg h-[41px] w-full"
        >
          Add To Batch
        </button>
        <button
          onClick={handleOnConfirm}
          className="text-white text-sm button-bg rounded-lg h-[41px] w-full"
        >
          Confirm & Sign
        </button>
      </div>
    </div>
  );
};
