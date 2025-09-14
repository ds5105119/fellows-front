"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { SwitchIndicator } from "@/components/ui/switch-indicator";

export const FeatureItemWithTooltip = ({
  item,
  isChecked,
  isDefault,
  onButtonClick,
}: {
  item: { icon?: string; title: string; description?: string };
  isChecked: boolean;
  isDefault?: boolean;
  onButtonClick: (title: string) => void;
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  return (
    <button
      type="button"
      key={item.title}
      className={cn(
        "flex items-center justify-between not-odd:col-span-1 py-2.5 px-3 rounded-md font-semibold text-sm cursor-pointer text-left",
        isChecked ? "bg-blue-100" : "bg-gray-100"
      )}
      onClick={() => onButtonClick(item.title)}
      onKeyDown={(e) => e.key === "Enter" && onButtonClick(item.title)}
    >
      <div className="pl-1.5 flex items-center gap-[5px]">
        <p className="flex-grow break-words">
          {item.icon} {item.title}
        </p>
        {item.description ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger
                asChild
                onClick={(e) => {
                  e.stopPropagation();
                  setTooltipOpen((prev) => !prev);
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setTooltipOpen(true);
                }}
                onBlur={(e) => {
                  e.stopPropagation();
                  setTooltipOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setTooltipOpen(true);
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  setTooltipOpen(false);
                }}
              >
                <Info strokeWidth={2.3} className="!size-6 text-neutral-400 z-10 rounded-sm p-1 hover:bg-neutral-200 transition-colors duration-200 shrink-0" />
              </TooltipTrigger>
              <TooltipContent onClick={(e) => e.stopPropagation()} side="top" align="center" className="w-fit z-50">
                <p className="text-sm">{item.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="w-6 h-6" />
        )}
      </div>
      {!isDefault && <SwitchIndicator checked={!!isChecked} />}
    </button>
  );
};
