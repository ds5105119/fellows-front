"use client";

import { usePathname } from "next/navigation";
import { MailIcon, PlusCircleIcon } from "lucide-react";
import DynamicLucideIcon from "../resource/dynamiclucideicon";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 h-10 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <PlusCircleIcon />
              <span>도입 문의하기</span>
            </SidebarMenuButton>
            <Button size="icon" className="h-10 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0" variant="outline">
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title} className="data-[slot=sidebar-menu-button]:!h-10" isActive={pathname.startsWith(item.url)}>
                  {item.icon && <DynamicLucideIcon name={item.icon} className="!size-5" />}
                  <span className="font-medium text-sm">{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
