import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { NavGroup } from "@/components/sidebar/nav-group";
import { NavDocuments } from "@/components/sidebar/nav-documents";
import { NavUser } from "@/components/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { headerData } from "@/components/resource/header";

export async function AppSidebar() {
  const session = await auth();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="px-6 md:px-0 md:pt-3">
        <SidebarMenu>
          <SidebarMenuItem className="md:px-3">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 data-[slot=sidebar-menu-button]:!py-6 group-data-[collapsible=icon]:-ml-1"
            >
              <Link href="/">
                <Image src="/fellows/logo-img.svg" width={20} height={20} alt="image logo" />
                <Image src="/fellows/logo-text.svg" width={70} height={20} alt="text logo" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-4 md:p-0">
        <NavGroup items={headerData.navMain} name="메인 메뉴" />
        <NavDocuments items={headerData.documents} />
        <NavGroup items={headerData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="px-6 md:px-2 md:pb-3 group-data-[collapsible=icon]:ml-2">
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
