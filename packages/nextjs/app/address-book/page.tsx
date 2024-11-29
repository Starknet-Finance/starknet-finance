"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PlusIcon } from "@radix-ui/react-icons";
import { HeaderActions } from "~~/components/HeaderActions";
import CreateNewAddressModal from "~~/components/Modals/CreateNewAddressModal";
import RemoveAddressModal from "~~/components/Modals/RemoveAddressModal";
import { Address } from "~~/components/scaffold-stark";

interface ItemRowProps {
  id: number;
  name: string;
  address: string;
  onRemove: () => void;
  onEdit: (name: string, address: string) => void;
  onCopy: () => void;
}

const ItemRow = ({ name, address, onRemove, onEdit }: ItemRowProps) => {
  return (
    <div className="flex items-center gap-4 py-2.5">
      <p className="font-medium text-[#D56AFF] text-[15px] min-w-[152px] truncate">
        {name}
      </p>
      <div className="flex items-center gap-2 flex-1">
        <Address address={address as `0x${string}`} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <RemoveAddressModal addressName={name} onRemove={onRemove} />
          <div
            className="bg-[#FFFFFF21] p-[5px] rounded-[7px] w-fit cursor-pointer"
            onClick={() => onEdit(name, address)}
          >
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

interface AddressEntry {
  id: number;
  name: string;
  address: string;
  timestamp: number;
}

const AddressBook = () => {
  const [addresses, setAddresses] = useState<AddressEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedAddresses = localStorage.getItem("addressBook");
        if (savedAddresses) {
          const parsedAddresses = JSON.parse(savedAddresses);
          if (Array.isArray(parsedAddresses)) {
            return parsedAddresses;
          }
        }
      } catch (error) {
        console.error("Error loading addresses from localStorage:", error);
      }
    }
    return [];
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("addressBook", JSON.stringify(addresses));
    } catch (error) {
      console.error("Error saving addresses to localStorage:", error);
    }
  }, [addresses]);

  const handleAddAddress = (name: string, address: string) => {
    const newEntry: AddressEntry = {
      id: Date.now(),
      name,
      address,
      timestamp: Date.now(),
    };
    setAddresses((prev) => [...prev, newEntry]);
  };

  const handleRemoveAddress = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleEditAddress = (id: number, name: string, address: string) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, name, address } : addr)),
    );
  };

  const filteredAddresses = addresses.filter(
    (addr) =>
      addr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const exportAddresses = () => {
    const dataStr = JSON.stringify(addresses, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `address-book-${new Date().toISOString()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importAddresses = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedAddresses = JSON.parse(e.target?.result as string);
          setAddresses((prev) => [...prev, ...importedAddresses]);
        } catch (err) {
          console.error("Failed to parse imported file: ", err);
          // Could add error toast here
        }
      };
      reader.readAsText(file);
    }
  };

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
        <CreateNewAddressModal
          onSave={handleAddAddress}
          addresses={addresses}
        />
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ⌘ + K
              </span>
            </div>
          </div>
        </div>
        <div>
          {filteredAddresses.map((item) => (
            <ItemRow
              key={item.id}
              {...item}
              onRemove={() => handleRemoveAddress(item.id)}
              onEdit={(name, address) =>
                handleEditAddress(item.id, name, address)
              }
              onCopy={() => copyToClipboard(item.address)}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="relative">
          <input
            type="file"
            id="import-file"
            className="hidden"
            accept=".json"
            onChange={importAddresses}
          />
          <label
            htmlFor="import-file"
            className="flex items-center gap-1.5 cursor-pointer px-4 py-1.5 bg-[#6161613B] rounded-lg w-fit"
          >
            <PlusIcon width={20} height={20} />
            <p className="font-medium">Import Address</p>
          </label>
        </div>
        <div
          onClick={exportAddresses}
          className="flex items-center gap-1.5 cursor-pointer px-4 py-1.5 bg-[#6161613B] rounded-lg w-fit"
        >
          <PlusIcon width={20} height={20} />
          <p className="font-medium">Export List</p>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
