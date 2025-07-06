"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { BellIcon, CreditCardIcon, LogOutIcon, MoreVerticalIcon, UserCircleIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

interface NavUserProps {
  session: Session | null;
}

export function NavUser({ session }: NavUserProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileOpen(true);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:-ml-2">
                  <AvatarImage src={session?.user.image ?? ""} alt={session?.user?.id} />
                  <AvatarFallback className="rounded-lg">{session?.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{session?.user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{session?.user.email}</span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div
                  className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer hover:bg-accent rounded-md transition-colors"
                  onClick={handleProfileClick}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.id} />
                    <AvatarFallback className="rounded-lg">{session?.user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{session?.user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{session?.user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/service/settings/profile")}>
                  <UserCircleIcon />
                  계정
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  결제 정보
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon />
                  알림
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ redirectTo: "/" })}>
                <LogOutIcon />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      {/* Profile Picture Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-0 bg-white border-none" showCloseButton={false}>
          <DialogHeader className="absolute top-3 left-4 right-4 z-10">
            <div className="flex items-center justify-between h-full">
              <DialogTitle className="text-blak text-lg font-medium h-fit">프로필 카드</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileOpen(false)}
                className="text-black hover:bg-black/20 flex items-center justify-center"
              >
                <X />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-8 pt-16">
            <div className="relative">
              <Avatar className="size-64 sm:size-80 border-1 border-white/20">
                <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name || "프로필"} className="object-cover" />
                <AvatarFallback className="text-4xl text-white">{session?.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-6 text-center space-y-2">
              <h3 className="text-black text-xl font-bold">{session?.user?.name}</h3>
              <p className="text-black/70 text-sm">{session?.user?.email}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isProfileOpen && (
        <SmoothCursor
          springConfig={{
            damping: 100,
            stiffness: 1000,
            mass: 1.0,
            restDelta: 0.001,
          }}
        />
      )}
    </>
  );
}
