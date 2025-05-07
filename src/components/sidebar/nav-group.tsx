"use client";

import DynamicLucideIcon from "@/components/resource/dynamiclucideicon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function NavGroup({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} className="[&>svg]:size-5" isActive={pathname.startsWith(item.url)} asChild>
                <Link href={item.url}>
                  {item.icon && <DynamicLucideIcon name={item.icon} className="group-data-[collapsible=icon]:-ml-0.5" />}
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
