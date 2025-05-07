import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { NavGroup } from "@/components/sidebar/nav-group";
import { NavDocuments } from "@/components/sidebar/nav-documents";
import { NavUser } from "@/components/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

// Menu items.
export const data = {
  navMain: [
    {
      title: "대시보드",
      url: "/service/dashboard",
      icon: "LayoutDashboardIcon",
    },
    {
      title: "프로젝트",
      url: "/service/project",
      icon: "ListIcon",
    },
    {
      title: "조달사업",
      url: "#",
      icon: "BarChartIcon",
    },
    {
      title: "지원사업",
      url: "/service/welfare",
      icon: "FolderIcon",
    },
    {
      title: "구독",
      url: "#",
      icon: "UsersIcon",
    },
  ],
  navSecondary: [
    {
      title: "설정",
      url: "#",
      icon: "SettingsIcon",
    },
    {
      title: "고객센터",
      url: "#",
      icon: "HelpCircleIcon",
    },
  ],
  documents: [
    {
      name: "데이터 라이브러리",
      url: "#",
      icon: "DatabaseIcon",
    },
    {
      name: "리포트",
      url: "#",
      icon: "ClipboardListIcon",
    },
    {
      name: "개발 상황",
      url: "#",
      icon: "FileIcon",
    },
  ],
};

export async function AppSidebar() {
  const session = await auth();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="px-6 md:p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 data-[slot=sidebar-menu-button]:!py-6">
              <Link href="/">
                <Image src="/fellows/logo-img.svg" width={20} height={20} alt="image logo" />
                <span className="text-base font-semibold">{session?.user?.email}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-4 md:p-0">
        <NavGroup items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavGroup items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="px-6 md:p-0 group-data-[collapsible=icon]:ml-2">
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
