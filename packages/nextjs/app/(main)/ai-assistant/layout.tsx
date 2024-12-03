import React from "react";
import FormMessage from "~~/components/AIAssistant/FormMessage";
import SidebarRightAI from "~~/components/AIAssistant/SidebarRightAI";

export default function AIAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-10 gap-1 bg-[#000] h-screen">
      <div className="col-span-8 bg flex flex-col gap-5">
        <div className="flex-1 pb-[50px]">{children}</div>
        <div className="w-full">
          <FormMessage />
        </div>
      </div>
      <div className="col-span-2">
        <SidebarRightAI />
      </div>
    </section>
  );
}
