import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn("group relative w-auto cursor-pointer overflow-hidden rounded-full bg-black pl-4.5 pr-4.5 text-center font-semibold", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-white transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-background">{children}</span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-20 items-center justify-center gap-1 text-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-3.5 group-hover:opacity-100">
        <span>{children}</span>
        <ChevronRight className="size-4" />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
