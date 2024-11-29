import { useRef, useState } from "react";
import GenericModal from "../scaffold-stark/CustomConnectButton/GenericModal";
import { PlusIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { CloseIcon } from "../Icons/CloseIcon";

const CreateNewAddressModal = () => {
  const modalRef = useRef<HTMLInputElement>(null);
  const [showError, setShowError] = useState(false);

  const handleSave = () => {
    setShowError(true);
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
        <div className="bg-[#2D2F35] rounded-full p-2 cursor-pointer absolute right-2 top-2">
          <Image src="/close-icon.svg" alt="icon" width={14} height={14} />
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
        {showError && (
          <p className="font-medium text-[#FF4C4C] text-center py-2 px-3 w-full bg-[#FF484833] rounded-lg">
            This name is existed
          </p>
        )}
        <div>
          <p className="mb-0.5">Address</p>
          <input
            className="bg-[#2D2D2D] rounded-md px-3 py-2.5 w-full"
            placeholder="Enter address"
          />
        </div>
        <div>
          <p className="mb-0.5">Remember Name</p>
          {showError ? (
            <div className="font-medium text-[#FF4C4C] border border-[#FF4C4C] py-2 px-3 w-full bg-[#FF484833] rounded-lg flex items-center justify-between">
              <p>Namm</p>
              <CloseIcon
                width={24}
                height={24}
                color="#FF4C4C"
                className="cursor-pointer"
                onClick={() => setShowError(false)}
              />
            </div>
          ) : (
            <input
              className="bg-[#2D2D2D] rounded-md px-3 py-2.5 w-full"
              placeholder="Enter name"
            />
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
