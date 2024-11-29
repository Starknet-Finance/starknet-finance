import { useRef, useState } from "react";
import GenericModal from "../scaffold-stark/CustomConnectButton/GenericModal";
import { PlusIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { getChecksumAddress, validateChecksumAddress } from "starknet";

interface CreateNewAddressModalProps {
  onSave: (name: string, address: string) => void;
  addresses: Array<{ name: string; address: string }>;
}

const CreateNewAddressModal = ({
  onSave,
  addresses,
}: CreateNewAddressModalProps) => {
  const modalRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { name?: string; address?: string } = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (
      addresses.some((a) => a.name.toLowerCase() === name.toLowerCase())
    ) {
      newErrors.name = "This name already exists";
    }

    // Validate address
    if (!address.trim()) {
      newErrors.address = "Address is required";
    } else if (!validateChecksumAddress(getChecksumAddress(address))) {
      newErrors.address = "Invalid address";
    } else if (
      addresses.some((a) => a.address.toLowerCase() === address.toLowerCase())
    ) {
      newErrors.address = "This address already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(name, address);
      setName("");
      setAddress("");
      setErrors({});
      if (modalRef.current) {
        modalRef.current.checked = false;
      }
    }
  };

  const handleCloseModal = () => {
    setName("");
    setAddress("");
    setErrors({});
    if (modalRef.current) {
      modalRef.current.checked = false;
    }
  };

  return (
    <div>
      <label
        htmlFor="create-address-modal"
        className="flex items-center gap-1 create-term-btn"
      >
        <PlusIcon width={20} height={20} />
        <span className="font-medium text-[15px]">Create Entry</span>
      </label>
      <input
        ref={modalRef}
        type="checkbox"
        id="create-address-modal"
        className="modal-toggle"
      />
      <GenericModal
        modalId="create-address-modal"
        className="flex flex-col gap-3 relative px-4 py-5 rounded-xl bg-[#0F0F0F] w-[422px]"
      >
        <div
          className="bg-[#2D2F35] rounded-full p-1 cursor-pointer absolute right-2 top-2"
          onClick={handleCloseModal}
        >
          <Image src="/close-icon.svg" alt="icon" width={24} height={24} />
        </div>
        <div className="mx-auto mt-6">
          <Image
            src="/save-address.svg"
            alt="icon"
            width={80}
            height={80}
            className="cursor-pointer"
          />
        </div>
        <div className="text-center">
          <p className="font-bold text-2xl uppercase">save new address</p>
          <p className="text-[#747474] text-sm mt-2">
            Save a new address to simplify transactions <br /> with other
            addresses
          </p>
        </div>
        <div>
          <p className="mb-0.5">Address</p>
          <input
            className={`bg-[#2D2D2D] rounded-md px-3 py-2.5 w-full ${
              errors.address ? "border border-[#FF4C4C]" : ""
            }`}
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && (
            <p className="text-[#FF4C4C] text-sm mt-1">{errors.address}</p>
          )}
        </div>
        <div>
          <p className="mb-0.5">Remember Name</p>
          <input
            className={`bg-[#2D2D2D] rounded-md px-3 py-2.5 w-full ${
              errors.name ? "border border-[#FF4C4C]" : ""
            }`}
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-[#FF4C4C] text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <button
          className="bg-white text-[#292929] text-[15px] font-semibold h-10 rounded-lg"
          onClick={handleSave}
        >
          Save Address
        </button>
      </GenericModal>
    </div>
  );
};

export default CreateNewAddressModal;
