import Image from "next/image";
import { CustomConnectButton } from "./scaffold-stark/CustomConnectButton";

export const HeaderActions = () => {
  return (
    <div className="absolute right-6 top-6 flex gap-2 items-center">
      <CustomConnectButton />
      <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#2D2F35] cursor-pointer">
        <Image src={"/noti-icon.svg"} alt="icon" width={20} height={20} />
      </div>
    </div>
  );
};
