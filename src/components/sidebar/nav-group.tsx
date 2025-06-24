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
  icon?: string;
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

  // Helper function to check if a path matches a navigation item exactly
  const isExactMatch = (pathname: string, navUrl: string): boolean => {
    return pathname === navUrl || pathname === navUrl + "/";
  };

  // Helper function to check if a path is under a parent route (supports deep nesting)
  const isUnderParentRoute = (pathname: string, parentUrl: string, siblingUrls: string[] = []): boolean => {
    // If pathname exactly matches any sibling, it's not under parent
    for (const siblingUrl of siblingUrls) {
      if (isExactMatch(pathname, siblingUrl)) {
        return false;
      }
    }

    // Check if pathname starts with parent URL (supports any depth)
    if (pathname.startsWith(parentUrl + "/") && pathname !== parentUrl && pathname !== parentUrl + "/") {
      return true;
    }

    return false;
  };

  // Helper function to find the best matching nav item
  const findActiveItem = (pathname: string, items: NavItem[]): { activeUrl: string | null; parentTitle: string | null } => {
    let bestMatch: { activeUrl: string | null; parentTitle: string | null } = { activeUrl: null, parentTitle: null };
    let maxSpecificity = 0;

    // Calculate specificity score (longer, more specific URLs get higher scores)
    const getSpecificity = (url: string, isExact: boolean): number => {
      const baseScore = url.split("/").length;
      return isExact ? baseScore * 1000 : baseScore; // Exact matches get much higher priority
    };

    for (const item of items) {
      if (item.items) {
        // Check sub-items first (they are more specific)
        for (const subItem of item.items) {
          if (isExactMatch(pathname, subItem.url)) {
            const specificity = getSpecificity(subItem.url, true);
            if (specificity > maxSpecificity) {
              bestMatch = { activeUrl: subItem.url, parentTitle: item.title };
              maxSpecificity = specificity;
            }
          }
        }

        // Check if pathname is under this parent item
        const siblingUrls = item.items.map((subItem) => subItem.url);
        if (isUnderParentRoute(pathname, item.url, siblingUrls)) {
          const specificity = getSpecificity(item.url, false);
          if (specificity > maxSpecificity) {
            bestMatch = { activeUrl: item.url, parentTitle: item.title };
            maxSpecificity = specificity;
          }
        }

        // Check parent item exact match
        if (isExactMatch(pathname, item.url)) {
          const specificity = getSpecificity(item.url, true);
          if (specificity > maxSpecificity) {
            bestMatch = { activeUrl: item.url, parentTitle: item.title };
            maxSpecificity = specificity;
          }
        }
      } else {
        // For items without sub-items
        if (isExactMatch(pathname, item.url)) {
          const specificity = getSpecificity(item.url, true);
          if (specificity > maxSpecificity) {
            bestMatch = { activeUrl: item.url, parentTitle: null };
            maxSpecificity = specificity;
          }
        } else if (isUnderParentRoute(pathname, item.url)) {
          const specificity = getSpecificity(item.url, false);
          if (specificity > maxSpecificity) {
            bestMatch = { activeUrl: item.url, parentTitle: null };
            maxSpecificity = specificity;
          }
        }
      }
    }

    return bestMatch;
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

  const handleItemClick = (url: string) => {
    setActiveItem(url);
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
                    asChild
                  >
                    <Link href={item.url} onClick={() => handleItemClick(item.url)}>
                      {item.icon && (
                        <DynamicFcIcon
                          name={item.icon}
                          className={cn("group-data-[collapsible=icon]:-ml-0.5 transition-colors duration-200", isParentActive(item) && "text-blue-500")}
                        />
                      )}
                      <span className="font-medium text-sm">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="group-data-[collapsible=icon]:mt-0 mt-1">
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
                            {subItem.icon && (
                              <DynamicFcIcon
                                name={subItem.icon}
                                className={cn("group-data-[collapsible=icon]:-ml-0.5 transition-colors duration-200", isParentActive(item) && "text-blue-500")}
                              />
                            )}
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
