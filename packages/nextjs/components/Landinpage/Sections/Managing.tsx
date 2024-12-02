export default function Managing() {
  return (
    <div className="managing-bg flex flex-col items-center justify-center">
      <div className="content flex flex-col items-center justify-center">
        <p className="text-[46px] font-black text-white text-center leading-[45px]">
          Start Managing <br /> Your Starknet Assets
        </p>
        <div className="flex gap-2 mt-8">
          <button className="w-[305px] h-[45px] flex items-center justify-center rounded-lg text-sm text-white border border-[#A8A8A8]">
            Read Docs
          </button>
          <button className="w-[305px] h-[45px] flex items-center justify-center  bg-btn text-sm text-white font-medium rounded-lg">
            Launch App
          </button>
        </div>
        <div className="w-full h-[1px] bg-[#FFFFFF45] my-10"></div>
        <p className="text-white text-[40px] font-semibold">Get in touch</p>
        <div className="flex gap-2.5 mt-[30px]">
          <button className="get-touch-btn">Partner inquiries</button>
          <button className="get-touch-btn">Integration requests</button>
          <button className="get-touch-btn">Custom solutions</button>
          <button className="get-touch-btn">hello@starknetfinance.xyz</button>
        </div>
      </div>
    </div>
  );
}
