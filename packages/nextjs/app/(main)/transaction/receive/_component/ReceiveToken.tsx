/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import React from "react";

const Divider = () => <div className="w-full h-[1px] bg-[#65656526] my-5" />;

const ReceiveToken = () => {
  return (
    <div className="h-full mx-auto bg-[#161616] p-6 text-white rounded-lg flex flex-col">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Image
            src="/arrow-narrow-up.png"
            alt="swap direction"
            className="-mt-2"
            width={22}
            height={22}
          />
          <h1 className="text-xl font-bold gradient-text uppercase">
            add funds to your account
          </h1>
        </div>
        <p className="text-[#FFFFFF80] text-sm">
          Lorem Ipsum has been the industry's standard
        </p>
      </div>

      <Divider />
      <div className="flex flex-col items-center">
        <div className="relative mb-3 mt-5">
          <Image
            src={"/topleft-border.svg"}
            alt="icon"
            width={24}
            height={24}
            className="absolute -top-4 left-0"
          />
          <Image
            src={"/topright-border.svg"}
            alt="icon"
            width={24}
            height={24}
            className="absolute -top-4 right-0"
          />
          <Image
            src={"/botleft-border.svg"}
            alt="icon"
            width={24}
            height={24}
            className="absolute bottom-4 -left-1"
          />
          <Image
            src={"/botright-border.svg"}
            alt="icon"
            width={24}
            height={24}
            className="absolute bottom-4 -right-1"
          />
          <div className="qrcode w-[200px] z-10 h-[100px] absolute bottom-[20px]"></div>
          <Image
            src={"/qrcode.svg"}
            alt="qrcode"
            width={200}
            height={200}
            className="relative z-50"
          />
        </div>
        <div className="bg-[#E8C2FF] p-1 rounded-lg flex items-center gap-2 w-fit">
          <p className="bg-[#D56AFF] rounded-lg px-3 py-1.5">
            eth:0xB99...adc7
          </p>
          <div className="flex items-center justify-center cursor-pointer p-2 bg-white rounded-lg w-fit">
            <Image src={"/copy-code.svg"} alt="icon" width={14} height={14} />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <ul className="font-medium">Notice:</ul>
        <div className="text-sm text-[#93989F] ml-3 flex flex-col gap-1">
          <li>
            This is the address of your Account. Deposit funds by scanning the
            QR code or copying the address below.
          </li>
          <li>
            Only send ETH and tokens (e.g. ERC20, ERC721) to this address.
          </li>
        </div>
      </div>
      <div className="mt-4">
        <button className="bg-[#474747] py-3 px-5 rounded-lg font-medium w-full">
          Save Image
        </button>
      </div>
    </div>
  );
};

export default ReceiveToken;
