"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";

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
          <Command>
            <CommandList>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      setSelectedStatus(statuses.find((item) => item.value === value) || null);
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
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-fit">
          {selectedStatus ? <>{selectedStatus.label}</> : <>{placeholder}</>}
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          </DrawerHeader>
        </VisuallyHidden>
        <div className="p-2 pb-0 gap-3">
          <Command>
            <CommandList>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      setSelectedStatus(statuses.find((item) => item.value === value) || null);
                      setOpen(false);
                      if (callback) callback(status.value);
                    }}
                  >
                    <p className="text-base font-medium">{status.label}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
