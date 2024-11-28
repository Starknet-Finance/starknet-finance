"use client";

import React from "react";
import Image from "next/image";
import { PlusIcon } from "@radix-ui/react-icons";
import { HeaderActions } from "~~/components/HeaderActions";
import CreateNewAddressModal from "~~/components/Modals/CreateNewAddressModal";
import RemoveAddressModal from "~~/components/Modals/RemoveAddressModal";

const DATA_ITEM_ROW = [
  {
    id: 1,
    name: "Jupeng",
    address: "eth:0xBB...dc7",
  },
  {
    id: 2,
    name: "Carlos",
    address: "eth:0xBB...dc7",
  },
  {
    id: 3,
    name: "Mehdi109",
    address: "eth:0xBB...dc7",
  },
  {
    id: 4,
    name: "Eliverse25",
    address: "eth:0xBB...dc7",
  },
  {
    id: 5,
    name: "Eliverse25(1)",
    address: "eth:0xBB...dc7",
  },
];

const ItemRow = ({ name, address }: { name: string; address: string }) => {
  return (
    <div className="flex items-center gap-4 py-2.5">
      <p className="font-medium text-[#D56AFF] text-[15px] min-w-[152px] truncate">
        {name}
      </p>
      <div className="flex items-center gap-2 flex-1">
        <div className="w-[24px] h-[24px] rounded-full bg-white"></div>
        <p>{address}</p>
        <Image
          src={"/copy-icon.svg"}
          width={16}
          height={16}
          alt="icon"
          className="cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <RemoveAddressModal />
          <div className="bg-[#FFFFFF21] p-[5px] rounded-[7px] w-fit cursor-pointer">
            <Image src={"/edit-icon.svg"} width={14} height={14} alt="icon" />
          </div>
        </div>
        <p className="font-medium py-1 px-3 bg-[#6161613B] cursor-pointer w-fit rounded-lg">
          Send
        </p>
      </div>
    </div>
  );
};

const AddressBook = () => {
  return (
    <div className="p-8 min-h-screen relative">
      {/* Header Section */}
      <HeaderActions />
      <div className="mb-8 flex items-end justify-between">
        <div className="">
          <h1 className="text-5xl font-semibold mt-5 mb-4 gradient-text uppercase">
            address book
          </h1>
          <p className="text-gray-300">
            Starnket Finance has been audited by top experts in <br />{" "}
            blockchain security.
          </p>
        </div>
        <CreateNewAddressModal />
      </div>

      {/* Main Content Grid */}
      <div className="bg-[#0B0B0B] rounded-xl p-6 max-h-[570px] overflow-y-auto">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span>
                  <Image src="/info.svg" width={24} height={24} alt="icon" />
                </span>
                <h3 className="text-2xl gradient-text font-bold uppercase">
                  Address book
                </h3>
              </div>
              <p className="text-[#FFFFFF80] text-sm mt-1">
                Fastest way to manage addresses
              </p>
            </div>
            <div className="relative w-[30%]">
              <input
                type="text"
                placeholder="Search token"
                className="bg-gray-800/50 rounded-lg px-4 py-4 w-full"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ⌘ + K
              </span>
            </div>
          </div>
        </div>
        <div>
          {DATA_ITEM_ROW.map((item) => (
            <ItemRow key={item.id} {...item} />
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex items-center gap-1.5 cursor-pointer px-4 py-1.5 bg-[#6161613B] rounded-lg w-fit">
          <PlusIcon width={20} height={20} />
          <p className="font-medium">Import Address</p>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer px-4 py-1.5 bg-[#6161613B] rounded-lg w-fit">
          <PlusIcon width={20} height={20} />
          <p className="font-medium">Export List</p>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
