"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProjectNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = ["프로젝트", "계약서"] as const;
  const tabMapping: Record<"프로젝트", ""> & Record<"계약서", "contracts"> = { 프로젝트: "", 계약서: "contracts" };

  const handleTabChange = (tab: "프로젝트" | "계약서") => {
    router.push("/service/project/" + tabMapping[tab]);
  };

  const tab = pathname.startsWith("/service/project/contracts") ? "계약서" : pathname.startsWith("/service/project") ? "프로젝트" : "";

  return (
    <div className="sticky w-full top-12 md:top-16 flex items-center justify-between min-h-12 h-12 md:min-h-16 md:h-16 px-6 md:px-6 bg-background z-20 border-b border-b-sidebar-border">
      <div className="flex items-center space-x-5">
        {tabs.map((t, index) => {
          return (
            <button
              key={index}
              onClick={() => handleTabChange(t)}
              className={cn("text-base md:text-xl font-bold", t === tab ? "text-black" : "text-muted-foreground")}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
