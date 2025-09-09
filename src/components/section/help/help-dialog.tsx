"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function HelpDialog({
  src = "/help",
  open,
  onOpenChange,
  children,
  asChild = false,
}: {
  src?: string;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  children?: ReactNode;
  asChild?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [progress, setProgress] = useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild={asChild}>{children}</DialogTrigger>}
      <DialogContent
        data-lenis-prevent
        className="bg-white !w-full md:!w-[calc(100%-2rem)] !max-w-7xl !top-full !translate-y-[-100%] md:!top-1/2 md:!translate-y-[-50%] h-[calc(100%-2.5rem)] md:h-[85%] !rounded-b-none !rounded-t-2xl md:!rounded-2xl !overflow-y-auto !border-0 !shadow-3xl p-0"
        overlayClassName="backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="text-xl font-bold">Fellows SaaS 프로젝트 만들기 가이드</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground" />
        </DialogHeader>
        <div className="h-full w-full flex flex-col">
          <div className="sticky top-0 w-full px-3 py-3 font-bold grid grid-cols-2 items-center z-50 border-b">
            <div className="h-full flex items-center justify-start pl-2">Fellows 도움말</div>
            <div className="h-full flex items-center justify-end">
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
                  <XIcon className="size-5" strokeWidth={3} />
                </Button>
              </DialogClose>
            </div>
          </div>

          <div className="grow">
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
              <iframe
                ref={iframeRef}
                src={src}
                title="새 프로젝트 생성하기"
                loading="eager"
                allowFullScreen
                allow="clipboard-write"
                style={{ width: "100%", height: "100%", colorScheme: "light" }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
