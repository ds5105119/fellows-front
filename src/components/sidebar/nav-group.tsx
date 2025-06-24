"use client";

import type React from "react";

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
import { useState, useEffect } from "react";

interface SubItem {
  title: string;
  url: string;
}

interface NavItem {
  title: string;
  url: string;
  icon?: string;
  items?: SubItem[];
}

interface NavGroupProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  name?: string;
  items: NavItem[];
}

export function NavGroup({ name, items, ...props }: NavGroupProps) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openCollapsibles, setOpenCollapsibles] = useState<Set<string>>(new Set());

  // Helper function to check if a path matches a navigation item
  const isPathMatch = (pathname: string, navUrl: string): boolean => {
    // Exact match (including trailing slash)
    if (pathname === navUrl || pathname === navUrl + "/") {
      return true;
    }
    return false;
  };

  // Helper function to check if a path is under a parent route (for dynamic routes)
  const isUnderParentRoute = (pathname: string, parentUrl: string, siblingUrls: string[] = []): boolean => {
    // If pathname exactly matches any sibling, it's not under parent
    for (const siblingUrl of siblingUrls) {
      if (pathname === siblingUrl || pathname === siblingUrl + "/") {
        return false;
      }
    }

    // Check if pathname starts with parent URL and has additional segments
    if (pathname.startsWith(parentUrl + "/") && pathname !== parentUrl && pathname !== parentUrl + "/") {
      return true;
    }

    return false;
  };

  // Helper function to find the best matching nav item
  const findActiveItem = (pathname: string, items: NavItem[]): { activeUrl: string | null; parentTitle: string | null } => {
    // First, try to find exact matches in sub-items (highest priority)
    for (const item of items) {
      if (item.items) {
        for (const subItem of item.items) {
          if (isPathMatch(pathname, subItem.url)) {
            return { activeUrl: subItem.url, parentTitle: item.title };
          }
        }
      }
    }

    // Then, try to find exact matches in main items
    for (const item of items) {
      if (isPathMatch(pathname, item.url)) {
        return { activeUrl: item.url, parentTitle: item.items ? item.title : null };
      }
    }

    // Finally, check for dynamic routes under parent items
    for (const item of items) {
      if (item.items) {
        const siblingUrls = item.items.map((subItem) => subItem.url);
        if (isUnderParentRoute(pathname, item.url, siblingUrls)) {
          return { activeUrl: item.url, parentTitle: item.title };
        }
      }
    }

    return { activeUrl: null, parentTitle: null };
  };

  // Initialize active item and open collapsibles based on current pathname
  useEffect(() => {
    const { activeUrl, parentTitle } = findActiveItem(pathname, items);

    setActiveItem(activeUrl);

    // Set open collapsibles
    const newOpenCollapsibles = new Set<string>();
    if (parentTitle) {
      newOpenCollapsibles.add(parentTitle);
    }
    setOpenCollapsibles(newOpenCollapsibles);
  }, [pathname, items]);

  // Update the isItemActive function
  const isItemActive = (url: string): boolean => {
    return activeItem === url;
  };

  // Update the isParentActive function
  const isParentActive = (item: NavItem): boolean => {
    // Check if any sub-item is active
    if (item.items) {
      const hasActiveSubItem = item.items.some((subItem) => isItemActive(subItem.url));
      if (hasActiveSubItem) return true;
    }

    // Check if the parent item itself is active
    return isItemActive(item.url);
  };

  const handleItemClick = (url: string, hasSubItems = false) => {
    setActiveItem(url);

    // If the item has sub-items, don't navigate immediately
    if (hasSubItems) {
      return;
    }
  };

  const handleSubItemClick = (url: string) => {
    setActiveItem(url);
  };

  const toggleCollapsible = (itemTitle: string) => {
    setOpenCollapsibles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemTitle)) {
        newSet.delete(itemTitle);
      } else {
        newSet.add(itemTitle);
      }
      return newSet;
    });
  };

  return (
    <SidebarGroup {...props}>
      {name && <SidebarGroupLabel>{name}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            <Collapsible
              key={item.title}
              asChild
              open={openCollapsibles.has(item.title)}
              onOpenChange={() => toggleCollapsible(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isParentActive(item)}
                    className={cn(
                      "[&>svg]:size-5 rounded-[3px] transition-colors duration-200",
                      "hover:text-primary hover:bg-sidebar-accent/50",
                      "data-[active=true]:text-primary data-[active=true]:bg-sidebar-accent"
                    )}
                    onClick={() => handleItemClick(item.url, true)}
                    asChild
                  >
                    <div>
                      {item.icon && (
                        <DynamicFcIcon
                          name={item.icon}
                          className={cn("group-data-[collapsible=icon]:-ml-0.5 transition-colors duration-200", isParentActive(item) && "text-blue-500")}
                        />
                      )}
                      <span className="font-medium text-sm">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1">
                  <SidebarMenuSub className="border-none mr-0 pr-0">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={isItemActive(subItem.url)}
                          className={cn(
                            "rounded-[3px] transition-colors duration-200",
                            "hover:text-primary hover:bg-sidebar-accent/30",
                            "data-[active=true]:text-primary data-[active=true]:bg-sidebar-accent/50"
                          )}
                          asChild
                        >
                          <Link href={subItem.url} onClick={() => handleSubItemClick(subItem.url)}>
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
                className={cn(
                  "[&>svg]:size-5 rounded-[3px] transition-colors duration-200",
                  "hover:text-primary hover:bg-sidebar-accent/50",
                  "data-[active=true]:text-primary data-[active=true]:bg-sidebar-accent/50"
                )}
                isActive={isItemActive(item.url)}
                asChild
              >
                <Link href={item.url} onClick={() => handleItemClick(item.url)}>
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
