import { useRef, useState } from "react";
import GenericModal from "../scaffold-stark/CustomConnectButton/GenericModal";
import Image from "next/image";
import { CloseIcon } from "../Icons/CloseIcon";
import Divider from "../Divider";
import { useGlobalState } from "~~/services/store/store";

const ManageAccountModal = ({ moaList }: { moaList: any }) => {
  const { setActiveMOA } = useGlobalState();
  const modalRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.checked = false;
    }
  };

  const handleSelectMOA = (moa: any) => {
    setActiveMOA(moa);
    handleClose();
  };

  const toggleSettings = (key: string) => {
    setShowSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
    <div>
      <label htmlFor={`manage-account-modal`}>Manage your account</label>

      <input
        ref={modalRef}
        type="checkbox"
        id={`manage-account-modal`}
        className="modal-toggle"
      />
      <GenericModal
        modalId={`manage-account-modal`}
        className="bg-[#1C1C1C] rounded-xl py-5 px-4 w-[662px]"
      >
        <div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">Manage your account</p>
            <div
              className="p-1.5 rounded-full cursor-pointer bg-[#2F2F2F]"
              onClick={handleClose}
            >
              <CloseIcon />
            </div>
          </div>
          <p className="text-sm text-[#747474] mt-3">
            You can create more than 1 account
          </p>
          <Divider className="my-4 bg-[#3D3D3D]" />
          <div className="flex justify-between items-center">
            <p>Your Accounts</p>
            <button className="bg-[#2F2F2F] rounded-md py-1.5 px-3">
              Create New Account
            </button>
          </div>
        </div>
        <div className="h-[350px] overflow-y-auto">
          {moaList.map((itemMoa: any, moaIndex: any) =>
            itemMoa?.signers?.map((itemSigner: any, signerIndex: any) => (
              <div
                className="flex items-baseline justify-between px-2.5 py-3"
                key={`${moaIndex}-${signerIndex}`}
              >
                <div
                  className="flex items-center gap-1.5"
                  onClick={handleSelectMOA}
                >
                  <div className="w-9 h-9 rounded-full bg-[#D56AFF]"></div>
                  <div>
                    <p className="text-[#D56AFF] font-medium">Jupeng</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium">
                        {itemSigner?.slice(0, 6) +
                          "..." +
                          itemSigner?.slice(-4)}
                      </p>
                      <Image
                        src={"/copy-icon.svg"}
                        alt="icon"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src={"/dot-menu.svg"}
                    alt="icon"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                    onClick={() => toggleSettings(`${moaIndex}-${signerIndex}`)}
                  />
                  {showSettings[`${moaIndex}-${signerIndex}`] && (
                    <div className="bg-[#2E2E2E] p-2 rounded-xl min-w-[165px] absolute right-0 z-40">
                      <p className="text-[#747474]">Setting</p>
                      <p className="bg-[#4A4A4A] rounded-md px-3 py-2 cursor-pointer my-1">
                        Rename
                      </p>
                      <p className="bg-[#4A4A4A] rounded-md px-3 py-2 cursor-pointer">
                        Remove Account
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <Divider className="bg-[#3D3D3D] my-5" />
        <div className="flex justify-between items-center">
          <p>Export or Import your data</p>
          <div className="flex gap-2">
            <div className="bg-[#6161613B] py-1.5 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer">
              <Image
                src={"/up.svg"}
                alt="icon"
                width={12}
                height={12}
                className="rotate-180"
              />
              <p>Import</p>
            </div>
            <div className="bg-[#6161613B] py-1.5 px-4 rounded-lg flex items-center gap-1.5  cursor-pointer">
              <Image src={"/up.svg"} alt="icon" width={12} height={12} />
              <p>Export</p>
            </div>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default ManageAccountModal;
