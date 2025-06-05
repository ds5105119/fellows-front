"use client";

import DynamicFcIcon from "@/components/resource/dynamicfcicon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavGroup({
  name,
  items,
  ...props
}: {
  name?: string;
  items: {
    title: string;
    url: string;
    icon?: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      {name && <SidebarGroupLabel>{name}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            <Collapsible key={item.title} asChild defaultOpen={pathname.startsWith(item.url)} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className="[&>svg]:size-5 hover:text-primary data-[active=true]:text-primary">
                    {item.icon && (
                      <DynamicFcIcon
                        name={item.icon}
                        className={cn("group-data-[collapsible=icon]:-ml-0.5", pathname.startsWith(item.url) && "text-blue-500")}
                      />
                    )}
                    <span className="font-medium text-sm">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton isActive={pathname.startsWith(item.url)} className="hover:text-primary data-[active=true]:text-primary" asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="[&>svg]:size-5 hover:text-primary data-[active=true]:text-primary"
                isActive={pathname.startsWith(item.url)}
                asChild
              >
                <Link href={item.url}>
                  {item.icon && <DynamicFcIcon name={item.icon} className="group-data-[collapsible=icon]:-ml-0.5" />}
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
