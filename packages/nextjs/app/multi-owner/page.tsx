/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeaderActions } from "~~/components/HeaderActions";
import { Routes } from "~~/utils/Routes";
import TransactionButtons from "~~/components/transactions/TransactionButtons";
import TransactionTable from "../transaction/_components/TransactionTable";
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useAccount } from "~~/hooks/useAccount";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { getArgsAsStringInputFromForm } from "../debug/_components/contract/utilsContract";
import {
  CairoCustomEnum,
  Contract,
  getChecksumAddress,
  hash,
  num,
  RpcProvider,
} from "starknet";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { universalErc20Abi, universalStrkAddress } from "~~/utils/Constants";
import { v } from "@starknet-react/core/dist/index-Bhba1Jqa";

type Transaction = {
  id: number;
  type: "Receive" | "Send" | "Swap";
  amount: number;
  token: string;
  toAmount?: number;
  toToken?: string;
  date: string;
};

type Asset = {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  percentage: number;
  icon: string;
};

const transactions: Transaction[] = [
  {
    id: 1,
    type: "Receive",
    amount: 12000,
    token: "USDT",
    date: "25/11/2024, 07:15",
  },
  {
    id: 2,
    type: "Send",
    amount: 7159,
    token: "USDT",
    date: "22/11/2024, 23:59",
  },
  {
    id: 3,
    type: "Swap",
    amount: 12067,
    token: "USDT",
    toAmount: 0.15272,
    toToken: "BTC",
    date: "15/11/2024, 16:30",
  },
  {
    id: 4,
    type: "Receive",
    amount: 12000,
    token: "USDT",
    date: "10/11/2024, 14:20",
  },
  {
    id: 5,
    type: "Send",
    amount: 4159,
    token: "USD",
    date: "05/11/2024, 09:45",
  },
];

const assets: Asset[] = [
  {
    symbol: "USDT",
    name: "Tether",
    amount: 4098.01,
    value: 30.89,
    percentage: 79,
    icon: "/usdt.svg", // You'll need to add these icons to your public folder
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.019268,
    value: 1135.96,
    percentage: 20,
    icon: "/usdt.svg",
  },
  {
    symbol: "MTH",
    name: "Monetha",
    amount: 100.01,
    value: 30.89,
    percentage: 1,
    icon: "/usdt.svg",
  },
];

const MultiOwner = () => {
  const router = useRouter();
  const [connectedAccountMultisig, setConnectedAccountMultisig] = useState<
    {
      signers: string[];
      threshold: number;
      moa_address: string;
    }[]
  >([]);

  // factory deploying account
  const { address, account } = useAccount();
  const { sendAsync: deployMultisig } = useScaffoldWriteContract({
    contractName: "MultisigFactory",
    functionName: "deploy_multisig",
    args: [
      [
        "0x064b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691",
        "0x078662e7352d062084b0010068b99288486c2d8b914f6e2a55ce945f8792c8b1",
      ],
      2,
      [
        // this is how to specify module
        // {
        // module_type: new CairoCustomEnum({ Whitelist: "()" }),
        // module_address:
        //   "0x0000000000000000000000000000000000000000000000000000000000000000",
        // is_active: true,
        // },
      ],
      num.toHex(Date.now()),
    ],
  });
  const { data: multisigAbi } = useDeployedContractInfo("Multisig");

  // getting deployed multisig contract
  const { data: deployedMultisig } = useScaffoldEventHistory({
    contractName: "MultisigFactory",
    eventName: "contracts::interfaces::IMultisigFactory::MultisigCreated",
    fromBlock: 0n,
    watch: true,
  });

  // filter out connected address multisig
  const handleFilterDeployedMultisig = () => {
    if (!address) return;
    const processedDeployMultisigEvents = deployedMultisig?.map((multisig) => ({
      signers: multisig.args?.signers.map((signer: any) =>
        getChecksumAddress(num.toHex(signer))
      ),
      threshold: multisig.args?.threshold,
      moa_address: num.toHex(multisig.args?.moa_address || ""),
    }));

    // now filter out the connected address multisig
    const filteredDeployedMultisig = processedDeployMultisigEvents?.filter(
      (multisig) => multisig.signers.includes(getChecksumAddress(address!))
    );

    setConnectedAccountMultisig(filteredDeployedMultisig);
  };

  // propose transaction
  const handleProposeTransaction = async () => {
    // get the multisig address

    const multisigAddress = connectedAccountMultisig[0].moa_address;
    console.log(multisigAddress);
    // construct multisig contract instance
    const multisigContract = new Contract(multisigAbi?.abi!, multisigAddress);
    // const transferContract = new Contract(
    //   universalErc20Abi,
    //   universalStrkAddress
    // );
    // const transferCalldata = transferContract.populate("transfer", [
    //   "0x0135353f55784cb5f1c1c7d2ec3f5d4dab42eff301834a9d8588550ae7a33ed4",
    //   10000n,
    // ]);

    const proposedTransactionCalldata = multisigContract?.populate(
      "propose_transaction",
      [
        [
          {
            to: universalStrkAddress,
            selector: hash.getSelectorFromName("transfer"),
            calldata: [
              "0x0135353f55784cb5f1c1c7d2ec3f5d4dab42eff301834a9d8588550ae7a33ed4",
              10000n,
            ],
          },
        ],
      ]
    );

    console.log(proposedTransactionCalldata);

    try {
      const tx = await account?.execute(proposedTransactionCalldata);
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPendingTransactions = async () => {
    const multisigAddress = connectedAccountMultisig[0].moa_address;
    const provider = new RpcProvider({
      nodeUrl: `http://127.0.0.1:5050`,
    });
    const blockNumber = (await provider.getBlockLatestAccepted()).block_number;

    const events = await provider.getEvents({
      chunk_size: 100,
      keys: [[hash.getSelectorFromName("TransactionProposed")]],
      address: multisigAddress,
      from_block: { block_number: Number(0) },
      to_block: { block_number: blockNumber },
    });
    console.log(events);
    return events;
  };

  const handleIsSigned = async () => {
    const provider = new RpcProvider({
      nodeUrl: `http://127.0.0.1:5050`,
    });
    const multisigAddress = connectedAccountMultisig[0].moa_address;
    console.log(multisigAddress);
    // construct multisig contract instance
    const multisigContract = new Contract(
      multisigAbi?.abi!,
      multisigAddress,
      provider
    );
    const isSigned = await multisigContract.is_signed(address, 1);
    console.log(isSigned);
  };

  const handleSignTransaction = async () => {
    const multisigAddress = connectedAccountMultisig[0].moa_address;
    // get first proposed transaction and his calldata
    const proposedTransaction = (await handleGetPendingTransactions())?.events
      .keys;
    console.log(proposedTransaction);
    const multisigContract = new Contract(multisigAbi?.abi!, multisigAddress);
    const signTransactionCalldata = multisigContract?.populate(
      "sign_transaction",
      [
        1n,
        [
          {
            to: universalStrkAddress,
            selector: hash.getSelectorFromName("transfer"),
            calldata: [
              "0x0135353f55784cb5f1c1c7d2ec3f5d4dab42eff301834a9d8588550ae7a33ed4",
              10000n,
            ],
          },
        ],
      ]
    );
    console.log(signTransactionCalldata);
    try {
      const tx = await account?.execute(signTransactionCalldata);
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFilterDeployedMultisig();
  }, [deployedMultisig]);

  const handleCreateAccount = async () => {
    try {
      const tx = await deployMultisig();
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8 min-h-screen relative">
      {/* Header Section */}
      <HeaderActions />
      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <h1 className="text-5xl font-semibold gradient-text mt-5 mb-2">
            CREATE NEW ACCOUNT
          </h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-xl flex flex-col gap-5">
          <div className="border border-[#0b0b0b] p-6 bg-black rounded-xl flex flex-col">
            <div className="flex flex-col border-b-gray-800 border-b-2 pb-4">
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold gradient-text">
                  Basic Setup
                </h2>
              </div>
              <p className="text-gray-600">
                Set the signer and how many need to confirm to execute a valid
                transaction
              </p>
            </div>
            <div className="flex flex-col mt-5 gap-1">
              <h2 className="text-lg">Account Name</h2>
              <input
                type="text"
                placeholder="account name"
                className="flex-1 px-4 py-2 text-white bg-gray-700 rounded-lg"
              />
            </div>
          </div>

          <div className="border border-[#0b0b0b] p-6 bg-black rounded-xl flex flex-col">
            <div className="flex flex-col border-b-gray-800 border-b-2 pb-4">
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                <h2 className="text-xl font-semibold gradient-text">
                  Signers & Confirmation
                </h2>
              </div>
              <p className="text-gray-600">
                Set the signer and how many need to confirm to execute a valid
                transaction
              </p>
            </div>

            <div className="flex flex-col border-b-gray-800 border-b-2 pb-4 mt-5 gap-3">
              <div className="flex w-full justify-between items-center">
                <h2 className="text-lg">Signers</h2>
                <button className="bg-gray-600 p-2 rounded">Add Signer</button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="w-1/4 px-4 py-2 text-white bg-gray-700 rounded-l-lg border-r border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="flex-1 px-4 py-2 text-white bg-gray-700 rounded-r-lg"
                  />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="w-1/4 px-4 py-2 text-white bg-gray-700 rounded-l-lg border-r border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="flex-1 px-4 py-2 text-white bg-gray-700 rounded-r-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between border-b-gray-800 border-b-2 pb-4 mt-5">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                  <h2 className="text-xl font-semibold gradient-text">
                    Threshold
                  </h2>
                </div>
                <p className="text-gray-600">
                  Any transaction requires the confirmation of:
                </p>
              </div>
              <div className="join">
                <button className="join-item btn">-</button>
                <input
                  type="number"
                  className="join-item btn w-16"
                  defaultValue={2}
                  min={1}
                  max={10}
                />
                <button className="join-item btn">+</button>
              </div>
            </div>

            <div className="flex flex-col border-b-gray-800 border-b-2 pb-4 mt-5">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                  <h2 className="text-xl font-semibold gradient-text">
                    Module setup
                  </h2>
                </div>
                <p className="text-gray-600">Description</p>
              </div>
              <div className="flex mt-5 gap-4">
                <div className="flex gap-1 items-center">
                  <input
                    className="checkbox checkbox-secondary checkbox-sm rounded"
                    type="checkbox"
                  />
                  <p>ERC 20</p>
                </div>
                <div className="flex gap-1 items-center">
                  <input
                    className="checkbox checkbox-secondary checkbox-sm rounded"
                    type="checkbox"
                  />
                  <p>ERC 721</p>
                </div>
                <div className="flex gap-1 items-center text-gray-800">
                  <input
                    className="checkbox disabled checkbox-secondary checkbox-sm rounded"
                    disabled={true}
                    type="checkbox"
                  />
                  <p>Auto MEME trading (locked)</p>
                </div>
                <div className="flex gap-1 items-center text-gray-800">
                  <input
                    disabled={true}
                    className="checkbox disabled checkbox-secondary checkbox-sm rounded"
                    type="checkbox"
                  />
                  <p>Auto Investing (locked)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="bg-white rounded-xl text-black/80 flex flex-col justify-between">
          <div className="min-w-full">
            <div className="rounded-tr rounded-tl bg-white px-3 py-4">
              <div className="flex flex-col border-b-gray-300 border-b-2 pb-2">
                <h3 className="text-3xl font-semibold text-[#B248DD]">
                  Account Preivew
                </h3>
                <span className="text-black/60 text-base">
                  Check the information below
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <CheckBadgeIcon className="h-5 w-5" />
                  <p className="m-0">Basic setup</p>
                </div>
                <ArrowRightIcon className="h-3 w-3 text-gray-400" />
                <div className="flex items-center gap-1">
                  <CheckBadgeIcon className="h-5 w-5" />
                  <p className="m-0">Signer & confirmations</p>
                </div>
              </div>
            </div>
            {/* Assets Tabs */}
            <div className="flex flex-col space-y-4 px-3 py-4">
              <div className="flex flex-col">
                <p className="m-0 p-0">Account information</p>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between w-full bg-gray-200 rounded p-2">
                    <p className="text-black/60">Wallet Address</p>
                    <p className="font-semibold">0x123...321</p>
                  </div>
                  <div className="flex justify-between w-full bg-gray-200 rounded p-2">
                    <p className="text-black/60">Account Name</p>
                    <p className="font-semibold">Jupeng</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <p className="m-0 p-0">Signers</p>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between w-full bg-gray-200 rounded p-2">
                    <p className="text-black/60">Carlos</p>
                    <p className="font-semibold">0x153...321</p>
                  </div>
                  <div className="flex justify-between w-full bg-gray-200 rounded p-2">
                    <p className="text-black/60">Shiv</p>
                    <p className="font-semibold">0x164...321</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 py-4 w-full">
            <button
              onClick={handleIsSigned}
              type="submit"
              className="px-4 py-2 w-full text-white button-bg rounded-lg flex justify-center items-center gap-2"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiOwner;
