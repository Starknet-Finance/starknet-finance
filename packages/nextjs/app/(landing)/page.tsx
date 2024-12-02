import Image from "next/image";
import "./landing.css";
import PlatForm from "~~/components/Landinpage/Sections/Platform";
import KeyFeature from "~~/components/Landinpage/Sections/KeyFeature";
import HowItWork from "~~/components/Landinpage/Sections/HowItWork";
import AvaiableNow from "~~/components/Landinpage/Sections/AvaiableNow";
import Technical from "~~/components/Landinpage/Sections/Technical";
import Managing from "~~/components/Landinpage/Sections/Managing";
import Footer from "~~/components/Landinpage/Sections/Footer";
import Polygon from "~~/components/Landinpage/Polygon";

export default function HomePage() {
  return (
    <div>
      <div className="pt-10 fixed left-1/2 transform -translate-x-1/2 max-w-[1200px] w-full mx-auto z-40">
        <div className="header flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Image src={"/logo-dark.svg"} alt="logo" width={22} height={30} />
            <div>
              <span className="starknet-finance text-[#D56AFF]">starknet </span>
              <span className="starknet-finance">finance</span>
            </div>
          </div>
          <button className="bg-btn text-white font-medium px-5 py-3 rounded-xl">
            Launch App
          </button>
        </div>
      </div>

      <div className="space-y-10">
        <PlatForm />
        <KeyFeature />
        <HowItWork />
        <Polygon />
        <AvaiableNow />
        <Technical />
        <Managing />
      </div>
      <Footer />
    </div>
  );
}
