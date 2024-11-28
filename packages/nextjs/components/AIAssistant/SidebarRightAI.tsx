"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { useAIAssistantState } from "~~/services/store/assistant";
import { format } from "timeago.js";

export default function SidebarRightAI() {
  const { chatState, switchChat, createNewChat } = useAIAssistantState();

  return (
    <div className="bg-[#1C1C1C] rounded-lg p-3.5 h-full min-h-screen">
      <div className="text-[22px] font-bold uppercase flex items-center gap-1 mb-10">
        <p className="text-[#D56AFF]">ai chat</p>
        <p>history</p>
      </div>
      <div className="button-bg cursor-pointer flex items-center justify-center w-full gap-2  rounded-lg mb-4">
        <PlusIcon height={24} width={24} />
        <button onClick={createNewChat} className="py-4">
          Start New Chat
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {chatState.chatHistories.map((chat, index) => (
          <div key={chat.id} onClick={() => switchChat(chat.id)}>
            <p className="capitalize text-[#9BA1B0] text-[15px] mb-1">
              {format(chat.updatedAt)}
            </p>
            {/* {item.date.listChats.map((chat, chatIndex) => ( */}
            <p
              // key={chatIndex}
              className="cursor-pointer text-[15px] text-[#9BA1B0] rounded-lg hover:bg-[#252525] hover:text-white px-3.5 py-3 truncate mb-1"
            >
              {/* {chat} */}
              {chat.title}
            </p>
            {/* ))} */}
          </div>
        ))}
      </div>
    </div>
  );
}
