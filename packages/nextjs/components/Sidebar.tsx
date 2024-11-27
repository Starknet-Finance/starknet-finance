import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MENU_ITEM = [
  {
    groupMenu: {
      name: "Actions",
      listMenu: [
        {
          icon: "/overview.svg",
          title: "Overview",
          active: true,
          isComingSoon: false,
          path: "/overview",
        },
        {
          icon: "/address-book-icon.svg",
          title: "Address Book",
          active: false,
          isComingSoon: false,
          path: "/address-book",
        },
        {
          icon: "/mutil-owner-icon.svg",
          title: "Multi Owner",
          active: false,
          isComingSoon: true,
        },
        {
          icon: "/ai-assistant-icon.svg",
          title: "AI Assistant",
          active: false,
          isComingSoon: false,
          path: "/ai-assistant",
        },
        {
          icon: "/stake-icon.svg",
          title: "Stake",
          active: false,
          isComingSoon: true,
        },
      ],
    },
  },
  {
    groupMenu: {
      name: "Actions",
      listMenu: [
        {
          icon: "/transaction-icon.svg",
          title: "Transaction",
          active: false,
          isComingSoon: false,
          subMenu: [
            {
              title: "Send",
              active: false,
              path: "/send",
            },
            {
              title: "Receive",
              active: false,
            },
            {
              title: "Swap",
              active: false,
            },
          ],
        },
        {
          icon: "/batch-icon.svg",
          title: "Batch",
          active: false,
          isComingSoon: false,
          path: "/transaction-batch",
        },
      ],
    },
  },
];

const Actions = ({ name, icon }: { name: string; icon: string }) => {
  return (
    <div className="flex items-center justify-between px-2.5 py-3 bg-[#2C2C2C]">
      <span className="text-white text-[15px] ">{name}</span>
      <Image src={icon} width={15} height={15} alt="icon" />
    </div>
  );
};

interface MenuItem {
  icon: string;
  title: string;
  active: boolean;
  isComingSoon?: boolean;
  path?: string;
  subMenu?: {
    title: string;
    active: boolean;
    path?: string;
  }[];
}

interface GroupMenu {
  name: string;
  listMenu: MenuItem[];
}

interface MenuGroup {
  groupMenu: GroupMenu;
}

export default function Sidebar() {
  const router = useRouter();

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menuTitle: string) => {
    setOpenSubmenu(openSubmenu === menuTitle ? null : menuTitle);
  };

  const handleNavigation = (path: string | undefined, hasSubMenu: boolean) => {
    if (path && !hasSubMenu) {
      router.push(path);
    }
  };

  return (
    <div className="h-full dashboard w-full flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Image src={"/logo-app.svg"} alt="logo" width={20} height={30} />
          <div className="starknet-finace-text">
            <span>starknet </span>
            <span className="text-white">finance</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        {MENU_ITEM.map((item: MenuGroup, index) => (
          <div key={index}>
            <span className="text-[#9BA1B0] text-[15px]">
              {item.groupMenu.name}
            </span>
            <div className="flex flex-col gap-1 mt-1.5">
              {item.groupMenu.listMenu.map((menu: MenuItem) => (
                <div key={menu.title} className="flex flex-col">
                  <div
                    onClick={() => {
                      if (menu.subMenu) {
                        toggleSubmenu(menu.title);
                      } else {
                        handleNavigation(menu.path, !!menu.subMenu);
                      }
                    }}
                    className={`cursor-pointer flex items-center justify-between py-3 px-3.5 rounded-lg ${
                      menu.active
                        ? "bg-[#252525] text-white font-semibold"
                        : "text-[#9BA1B0]"
                    }`}
                  >
                    <div className="flex gap-2.5">
                      <Image
                        src={menu.icon}
                        width={24}
                        height={24}
                        alt="icon"
                      />
                      <span className="text-[15px]">{menu.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {menu.subMenu && (
                        <Image
                          src="/arrow-down.svg"
                          width={16}
                          height={16}
                          alt="arrow"
                          className={`transform transition-transform duration-200 ${
                            openSubmenu === menu.title ? "rotate-180" : ""
                          }`}
                        />
                      )}
                      {menu.isComingSoon && (
                        <p className="comingsoon">Coming Soon</p>
                      )}
                    </div>
                  </div>
                  {menu.subMenu && openSubmenu === menu.title && (
                    <div className="ml-8 flex flex-col gap-1 mt-1">
                      {menu.subMenu.map((subItem) => (
                        <div
                          onClick={() => handleNavigation(subItem.path, false)}
                          key={subItem.title}
                          className={`cursor-pointer py-2 px-3 rounded-lg hover:bg-[#252525] ${
                            subItem.active
                              ? "text-white font-semibold"
                              : "text-[#9BA1B0]"
                          }`}
                        >
                          {subItem.title}
                        </div>
                      ))}
                    </div>
                  )}
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
