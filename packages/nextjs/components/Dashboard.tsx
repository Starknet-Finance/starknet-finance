import Image from "next/image";

const MENU_ITEM = [
  {
    groupMenu: {
      name: "Actions",
      listMenu: [
        {
          icon: "/overview.svg",
          title: "Overview",
          active: true,
        },
        {
          icon: "/dashboard-tmp1.svg",
          title: "Address Book",
          active: false,
        },
        {
          icon: "/dashboard-tmp1.svg",
          title: "History",
          active: false,
        },
      ],
    },
  },
  {
    groupMenu: {
      name: "Actions",
      listMenu: [
        {
          icon: "/dashboard-tmp1.svg",
          title: "Send",
          active: false,
        },
        {
          icon: "/dashboard-tmp2.svg",
          title: "Swap",
          active: false,
        },
        {
          icon: "/dashboard-tmp2.svg",
          title: "Batch",
          active: false,
        },
      ],
    },
  },
];

const Actions = ({ name, icon }: { name: string; icon: string }) => {
  return (
    <div className="flex items-center justify-between px-2.5 py-3 bg-[#2C2C2C]">
      <span className="text-white text-[15px] font-semibold">{name}</span>
      <Image src={icon} width={15} height={15} alt="icon" />
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="dashboard flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="bg-[#D56AFF] rounded-full w-[28px] h-[28px]"></div>
          <span className="text-[20px]">LOGO</span>
        </div>
        <span className="px-3 py-2 rounded-lg bg-white text-[13px] font-semibold text-[#292929] w-fit">
          Connect Wallet
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        {MENU_ITEM.map((item, index) => (
          <div key={index}>
            <span className="text-[#9BA1B0] text-[15px]">
              {item.groupMenu.name}
            </span>
            <div className="flex flex-col gap-1 mt-1.5">
              {item.groupMenu.listMenu.map((menu) => (
                <div
                  key={menu.title}
                  className={`cursor-pointer flex items-center gap-2.5 py-3 px-3.5 rounded-lg ${
                    menu.active
                      ? "bg-[#252525] text-white font-semibold"
                      : "text-[#9BA1B0]"
                  }`}
                >
                  <Image src={menu.icon} width={24} height={24} alt="icon" />
                  <span className="text-[15px]">{menu.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="actions">
        <Actions name="What news?" icon="/gif.svg" />
        <div className="bg-[#7C7C7C] opacity-25 h-[1px] w-full"></div>
        <Actions name="Settings" icon="/setting.svg" />
      </div>
    </div>
  );
}
