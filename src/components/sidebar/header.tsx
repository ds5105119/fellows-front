"use client";

import BreadCrumb from "@/components/sidebar/breadcrumb";
import SidebarTrigger from "@/components/sidebar/sidebartrigger";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BellIcon, Menu, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent } from "@/components/ui/morphing-popover";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useId } from "react";
import HeaderAlert from "./header-alert";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const uniqueId = useId();

  return (
    <header className="sticky top-0 z-50 flex h-12 md:h-16 shrink-0 items-center gap-2 border-b border-b-sidebar-border bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="relative flex w-full justify-between items-center gap-2 px-4 md:px-6 md:justify-start">
        <SidebarTrigger className="-ml-1 pl-1.5 hidden md:block" />
        <BreadCrumb />
        <div className="flex items-center grow justify-end">
          <MorphingPopover
            transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
            variants={{
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.8 },
            }}
          >
            <MorphingPopoverTrigger className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5 transition-colors duration-200 focus-visible:ring-0">
              <motion.span layoutId={`popover-label-${uniqueId}`} className="hidden md:block">
                <BellIcon className="!size-6" />
              </motion.span>
            </MorphingPopoverTrigger>
            <MorphingPopoverContent
              style={{ transformOrigin: "top right" }}
              className="absolute top-0 right-0 origin-top-right rounded-xl border border-zinc-950/10 bg-white p-0 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] dark:bg-zinc-700"
            >
              <div className="h-[500px] w-[364px]">
                <HeaderAlert />
              </div>
            </MorphingPopoverContent>
          </MorphingPopover>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex items-center justify-center"
            onClick={() => {
              toggleSidebar();
            }}
          >
            <Menu className="!size-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden flex items-center justify-center">
                <BellIcon className="!size-5.5" />
              </Button>
            </SheetTrigger>

            <SheetContent className="overflow-hidden h-full w-full [&>button:first-of-type]:hidden gap-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus:outline-none focus:border-none">
              <SheetHeader className="sr-only">
                <SheetTitle>프로젝트 상세</SheetTitle>
              </SheetHeader>
              <div className="absolute top-7 -translate-y-1/2 right-4 z-50">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="focus-visible:ring-0">
                    <XIcon className="size-5" strokeWidth={3} />
                  </Button>
                </SheetClose>
              </div>

              <HeaderAlert />
              <SheetDescription className="sr-only" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
