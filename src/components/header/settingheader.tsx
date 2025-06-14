"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getSettingsTitle } from "../resource/settings";

export default function SettingHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/settings");
    }
  };

  return (
    <div className="sticky shrink-0 top-0 z-10 flex justify-between items-center bg-background border-b-sidebar-border border h-12 md:hidden px-4">
      <div className="flex size-8 shrink-0 items-center">
        <button onClick={handleBack}>
          <ChevronLeft className="!size-7" />
        </button>
      </div>
      <div className="flex grow shrink-0 items-center justify-center text-base font-bold">{getSettingsTitle(pathname)}</div>
      <div className="flex size-8 shrink-0 items-center" />
    </div>
  );
}
