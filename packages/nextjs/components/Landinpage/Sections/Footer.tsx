import Image from "next/image";

const LIST_BTN = [
  {
    icon: "x-icon.svg",
    text: "Latest Update",
    url: "",
  },
  {
    icon: "/github-icon.svg",
    text: "Check Code",
    url: "",
  },
  {
    icon: "/disc-icon.svg",
    text: "Community",
    url: "",
  },
];

const ButtonIcon = ({ text, icon }: { text: string; icon: string }) => {
  return (
    <div className="bg-[#404040] rounded-xl p-0.5 flex gap-1 min-w-[138px] items-center cursor-pointer">
      <div className="bg-[#E6E6E6] p-2 rounded-lg">
        <Image src={icon} alt="icon" width={14} height={14} />
      </div>
      <p className="text-[#A5A5A5] text-sm">{text}</p>
    </div>
  );
};

export default function Footer() {
  return (
    <div className="py-5 mt-10">
      <div className="content flex flex-col gap-5">
        <div className="flex items-center justify-center gap-1.5">
          <Image src={"/logo-dark.svg"} alt="logo" width={40} height={50} />
          <div>
            <span className="text-[40px] uppercase font-medium text-[#D56AFF]">
              starknet{" "}
            </span>
            <span className="text-[40px] uppercase font-medium">finance</span>
          </div>
        </div>
        <h2 className="footer-title">All-in-One Finance Platform</h2>
        <div className="h-[1px] bg-[#7D7D7D45] w-full"></div>
        <div className="grid grid-cols-2 gap-[200px] py-8">
          <div className="flex gap-3">
            <p className="footer-subtitle -mt-3">RESOURCES</p>
            <div className="h-[1px] bg-[#7D7D7D45] w-full"></div>
            <ul className="list-inside list-disc w-[200px] -mt-3">
              <li>Docs</li>
              <li>Blogs</li>
              <li>Tutorials</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <p className="footer-subtitle -mt-3">LEGAL</p>
            <div className="h-[1px] bg-[#7D7D7D45] w-full"></div>
            <ul className="list-inside list-disc w-[200px] -mt-3">
              <li>Terms</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>
        <div className="h-[1px] bg-[#7D7D7D45] w-full"></div>
        <div className="w-full flex justify-center relative pt-5">
          <Image
            src={"/landingpage/decor-sendmail.svg"}
            alt="bg"
            width={1000}
            height={1000}
            className="absolute top-1 w-full h-[200px] z-10"
          />
          <div className="bg-[#313131] rounded-[22px] pl-6 pr-3.5 py-3 flex justify-between items-center gap-3 w-[634px] relative z-20">
            <input
              placeholder="Leave email to get latest news"
              className="outline-none border-none px-2 text-white w-full"
              style={{ background: "none" }}
            />
            <button className="bg-white rounded-xl py-4 px-7">Submit</button>
          </div>
        </div>
        <div className="relative z-20 mt-3">
          <div className="flex justify-center items-center gap-1 ">
            {LIST_BTN.map((item) => (
              <ButtonIcon key={item.text} {...item} />
            ))}
          </div>
          <p className="text-[#797979] text-lg text-center mt-2.5">
            Starknet Finance all right reserved
          </p>
        </div>
      </div>
    </div>
  );
}
