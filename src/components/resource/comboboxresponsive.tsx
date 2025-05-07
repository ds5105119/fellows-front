"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ChevronDown, ChevronUp } from "lucide-react";

const Drawer = dynamic(() => import("@/components/ui/drawer").then((mod) => mod.Drawer), { ssr: false });
const DrawerContent = dynamic(() => import("@/components/ui/drawer").then((mod) => mod.DrawerContent), { ssr: false });
const DrawerTrigger = dynamic(() => import("@/components/ui/drawer").then((mod) => mod.DrawerTrigger), { ssr: false });

type Status = {
  value: string;
  label: string;
};

interface ComboBoxResponsiveProps {
  placeholder?: string;
  initial?: string;
  statuses: Array<{ value: string; label: string }>;
  callback?: (value: string) => void;
}

interface StatusListProps {
  statuses: Array<{ value: string; label: string }>;
  setOpen: (open: boolean) => void;
  setSelectedStatus: (selectedStatus: Status | null) => void;
  callback?: (value: string) => void;
}

export default function ComboBoxResponsive({ placeholder, initial, statuses, callback }: ComboBoxResponsiveProps) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useSidebar();
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  useEffect(() => {
    setSelectedStatus(statuses.find((priority) => priority.value === initial) || null);
  }, [initial, statuses]);

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="w-fit">
            {selectedStatus ? <>{selectedStatus.label}</> : <>{placeholder}</>}
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList statuses={statuses} setOpen={setOpen} setSelectedStatus={setSelectedStatus} callback={callback} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.label}</> : <>{placeholder}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <VisuallyHidden>
          <DialogTitle>상태 선택</DialogTitle>
        </VisuallyHidden>

        <div className="mt-4 border-t">
          <StatusList statuses={statuses} setOpen={setOpen} setSelectedStatus={setSelectedStatus} callback={() => callback} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({ statuses, setOpen, setSelectedStatus, callback }: StatusListProps) {
  return (
    <Command>
      <CommandList>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(statuses.find((priority) => priority.value === value) || null);
                setOpen(false);
                if (callback) callback(status.value);
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
