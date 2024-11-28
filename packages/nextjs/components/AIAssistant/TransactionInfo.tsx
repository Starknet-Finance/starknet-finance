import Image from "next/image";
import { useState } from "react";

const TransactionStatus = ({ status }: { status: string }) => {
  return (
    <div className="bg-[#2D2D2D] rounded-xl p-2 max-w-[352px]">
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
          <Image src={"/usdt.svg"} alt="icon" width={18} height={18} />
          <p className="text-lg font-medium">100</p>
        </div>
        <Image
          src={"/arrow-narrow-up.png"}
          alt="icon"
          width={20}
          height={20}
          className="rotate-90"
        />
        <div className="flex items-center gap-1">
          <Image src={"/btc.png"} alt="icon" width={18} height={18} />
          <p className="text-lg font-medium">0.15272</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-[#65656526] h-[1px] w-full"></div>
        <p className="text-[13px] text-[#4F4F4F] font-medium">And</p>
        <div className="bg-[#65656526] h-[1px] w-full"></div>
      </div>
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
            <p className="text-lg font-medium">100</p>
            <p className="text-sm text-[#C0C0C0] font-medium">~$325</p>
          </div>
          <p className="text-[15px] font-medium">
            To <span className="text-[#D56AFF] underline">Carlos</span>
          </p>
        </div>
      </div>
      <button className="h-[41px] bg-[#D5CECED6] w-full mt-2 rounded-lg text-sm text-[#292929] font-medium">
        {status}
      </button>
    </div>
  );
};

export const TransactionInfo = () => {
  const [status, setStatus] = useState("");

  if (status) {
    return <TransactionStatus status={status} />;
  }

  return (
    <div className="bg-[#2D2D2D] rounded-xl p-2 max-w-[352px]">
      <div className="rounded-md">
        <div className="flex flex-col gap-1">
          {/* -----transaction---- */}
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
              <Image src={"/usdt.svg"} alt="icon" width={32} height={32} />
              <p className="font-medium text-lg">100</p>
              <p className="text-[#C0C0C0] text-[14px] font-medium ml-1">
                ~$99.98
              </p>
            </div>
            <div className="bg-[#65656526] h-[1px] w-full"></div>
            <div className="flex items-center gap-1 px-3 py-5">
              <Image src={"/btc.png"} alt="icon" width={32} height={32} />
              <p className="font-medium text-lg">0.512</p>
              <p className="text-[#C0C0C0] text-[14px] font-medium ml-1">
                ~$99.98
              </p>
            </div>
          </div>

          {/* -----then---- */}
          <div className="flex items-center gap-1">
            <div className="bg-[#65656526] h-[1px] w-full"></div>
            <p className="text-[13px] text-[#4F4F4F] font-medium">Then</p>
            <div className="bg-[#65656526] h-[1px] w-full"></div>
          </div>

          {/* -----send to------ */}
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
              <Image src={"/usdt.svg"} alt="icon" width={32} height={32} />
              <p className="font-medium text-lg">100</p>
              <p className="text-[#C0C0C0] text-[14px] font-medium ml-1">
                ~$99.98
              </p>
            </div>
            <div className="bg-[#65656526] h-[1px] w-full"></div>
            <div className="flex items-center gap-3 px-3 py-5">
              <Image src={"/btc.png"} alt="icon" width={32} height={32} />
              <div className="flex items-end justify-between w-full">
                <div>
                  <p className="font-medium text-lg">Carlos</p>
                  <p className="text-[#C0C0C0] text-[14px] font-medium truncate">
                    0xd325hbt5bhyb3b4y5h3612c5
                  </p>
                </div>
                <Image
                  src={"/copy-icon.svg"}
                  alt="icon"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => setStatus("Canceled")}
          className="text-[#292929] text-sm bg-white rounded-lg h-[41px] w-full"
        >
          Cancel
        </button>
        <button
          onClick={() => setStatus("Signed")}
          className="text-white text-sm button-bg rounded-lg h-[41px] w-full"
        >
          Confirm & Sign
        </button>
      </div>
    </div>
  );
};
