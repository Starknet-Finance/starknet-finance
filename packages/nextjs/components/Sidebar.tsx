import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Routes } from "~~/utils/Routes";
import { OverViewIcon } from "./Icons/OverviewIcon";
import { AddressBookIcon } from "./Icons/AddressBookIcon";
import { MutilOwnerIcon } from "./Icons/MutilOwnerIcon";
import { AiAssistantIcon } from "./Icons/AiAssistantIcon";
import { StakeIcon } from "./Icons/StakeIcon";
import { TransactionIcon } from "./Icons/TransactionIcon";
import { BatchIcon } from "./Icons/BatchIcon";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/solid";

export const MENU_ITEM = [
  {
    groupMenu: {
      name: "Actions",
      listMenu: [
        {
          icon: <OverViewIcon />,
          title: "Overview",
          isComingSoon: false,
          path: Routes.overview,
        },
        {
          icon: <AddressBookIcon />,
          title: "Address Book",
          isComingSoon: false,
          path: Routes.addressBook,
        },
        {
          icon: <MutilOwnerIcon />,
          title: "Multi Owner",
          isComingSoon: true,
        },
        {
          icon: <MutilOwnerIcon />,
          title: "debug",
          path: "/debug",
        },

        {
          icon: <AiAssistantIcon />,
          title: "AI Assistant",
          isComingSoon: false,
          path: Routes.aiAssistant,
        },
        {
          icon: <StakeIcon />,
          title: "Stake",
          isComingSoon: true,
        },
        {
          icon: <GlobeAsiaAustraliaIcon className="h-6 w-6" />,
          title: "Explore Apps",
          path: Routes.explore,
        },
      ],
    },
  },
  {
    groupMenu: {
      name: "Actions",
      listMenu: [
        {
          icon: <TransactionIcon />,
          title: "Transaction",
          isComingSoon: false,
          subMenu: [
            {
              title: "Send",
              path: Routes.transactionSend,
            },
            {
              title: "Receive",
              path: Routes.transactionReceive,
            },
            {
              title: "Swap",
              path: Routes.transactionSwap,
            },
            {
              title: "NFT Send",
              path: "/nft-send",
              isComingSoon: true,
            },
          ],
        },
        {
          icon: <BatchIcon />,
          title: "Batch",
          isComingSoon: false,
          path: Routes.transactionBatch,
        },
      ],
    },
  },
];

interface MenuItem {
  icon: any;
  title: string;
  isComingSoon?: boolean;
  path?: string;
  subMenu?: {
    title: string;
    path?: string;
    isComingSoon?: boolean;
  }[];
}

interface GroupMenu {
  name: string;
  listMenu: MenuItem[];
}

interface MenuGroup {
  groupMenu: GroupMenu;
}

const Actions = ({ name, icon }: { name: string; icon: string }) => {
  return (
    <div className="flex items-center justify-between px-2.5 py-3 bg-[#2C2C2C]">
      <span className="text-white text-[15px] ">{name}</span>
      <Image src={icon} width={15} height={15} alt="icon" />
    </div>
  );
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menuTitle: string) => {
    setOpenSubmenu(openSubmenu === menuTitle ? null : menuTitle);
  };

  const handleNavigation = (path: string | undefined, hasSubMenu: boolean) => {
    if (path && !hasSubMenu) {
      router.push(path);
    }
  };

  const isActive = (menuPath?: string) => {
    if (!menuPath) return false;
    return pathname === menuPath;
  };

  const hasActiveSubMenu = (subMenu?: { path?: string }[]) => {
    if (!subMenu) return false;
    return subMenu.some((item) => isActive(item.path));
  };

  return (
    <div className="h-full dashboard w-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Image src={"/logo-app.svg"} alt="logo" width={20} height={30} />
          <div className="starknet-finace-text">
            <span>starknet </span>
            <span className="text-white">finance</span>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 bg-[#252525] rounded-lg px-5 py-2.5">
          <Image src={"/argentx-icon.svg"} alt="icon" width={24} height={24} />
          <p className="font-medium">0xBB...37e</p>
        </div>
        <div className="bg-[#6565658A] h-[1px] w-full mt-2"></div>
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
                      isActive(menu.path) || hasActiveSubMenu(menu.subMenu)
                        ? "bg-[#252525] text-white font-semibold"
                        : "text-[#9BA1B0]"
                    }`}
                  >
                    <div className="flex gap-2.5">
                      {menu.icon}
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
                          className={`cursor-pointer text-[#9BA1B0] py-2 px-3 rounded-lg hover:bg-[#252525] ${
                            isActive(subItem.path) ? "bg-[#252525]" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {subItem.title}
                            {subItem.isComingSoon && (
                              <p className="comingsoon">Coming Soon</p>
                            )}
                          </div>
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
