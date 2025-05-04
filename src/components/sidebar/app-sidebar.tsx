import Image from "next/image";
import Link from "next/link";
import { NavMain } from "@/components/sidebar/nav-main";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

// Menu items.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "대시보드",
      url: "#",
      icon: "LayoutDashboardIcon",
    },
    {
      title: "프로젝트",
      url: "/service/offer/general",
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
  navClouds: [
    {
      title: "Capture",
      icon: "CameraIcon",
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: "FileTextIcon",
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: "FileCodeIcon",
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: "SettingsIcon",
    },
    {
      title: "Get Help",
      url: "#",
      icon: "HelpCircleIcon",
    },
    {
      title: "Search",
      url: "#",
      icon: "SearchIcon",
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: "DatabaseIcon",
    },
    {
      name: "Reports",
      url: "#",
      icon: "ClipboardListIcon",
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: "FileIcon",
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-2.5 data-[slot=sidebar-menu-button]:!py-6">
              <Link href="/">
                <Image src="/fellows/logo.svg" width={121} height={20} alt="text logo" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
