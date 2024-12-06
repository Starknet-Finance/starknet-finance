/* eslint-disable react/no-unescaped-entities */

import { Routes } from "~~/utils/Routes";

const Divider = () => {
  return <div className="bg-[#A4A4A4] h-[1px] w-full my-5"></div>;
};

export default function Technical() {
  return (
    <div className="content pb-[100px]">
      <div className="grid grid-cols-5">
        <div className="col-span-3">
          <p className="subtitle" style={{ textAlign: "left" }}>
            TECHNICAL EDGE
          </p>
          <h2 className="title" style={{ textAlign: "left" }}>
            Using advanced tech <br /> on Starknet.
          </h2>
          <p className="text-[#5D5D5D] text-xl mt-3">Description</p>
          <button
            className="mt-[75px] bg-btn text-xl font-medium text-white border-2 border-[#C4AEFF] px-7 py-3 rounded-xl"
            onClick={() => window.open(Routes.overview)}
          >
            Launch App
          </button>
        </div>
        <div className="col-span-2 mt-16">
          <p className="text-[#1A1A1A] text-2xl font-medium">
            Built on Starknet's Account Abstraction
          </p>
          <Divider />
          <p className="text-[#1A1A1A] text-2xl font-medium">
            Modular architecture for maximum flexibility
          </p>
          <Divider />
          <p className="text-[#1A1A1A] text-2xl font-medium">
            AI-powered operations
          </p>
          <Divider />
          <p className="text-[#1A1A1A] text-2xl font-medium">
            Built by Starknet natives for the community
          </p>
        </div>
      </div>
    </div>
  );
}
