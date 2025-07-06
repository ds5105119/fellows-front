"use client";

import { useState } from "react";
import type { UserERPNextProject } from "@/@types/service/project";
import { useUsers } from "@/hooks/fetch/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, UserPlus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { inviteProject } from "@/hooks/fetch/project";

// Helper to map level to role and badge color
const getRoleDetails = (level: number) => {
  switch (level) {
    case 0:
      return { name: "소유자", variant: "destructive" as const };
    case 1:
      return { name: "어드민", variant: "secondary" as const };
    case 2:
      return { name: "편집/읽기", variant: "default" as const };
    case 3:
      return { name: "읽기", variant: "outline" as const };
    default:
      return { name: "초대중", variant: "outline" as const };
  }
};

export function TeamsList({ project }: { project: UserERPNextProject }) {
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const teamMembers = project.custom_team || [];
  const userIds = teamMembers.map((user) => user.member);
  const { data: users, isLoading } = useUsers(userIds);

  const handleInvite = async () => {
    if (!email.trim()) return;

    try {
      setIsInviting(true);
      await inviteProject(project.project_name, email.trim());
      setEmail("");
      setIsDialogOpen(false);
      // 성공 메시지나 토스트를 여기에 추가할 수 있습니다
    } catch (error) {
      console.error("초대 실패:", error);
      // 에러 메시지나 토스트를 여기에 추가할 수 있습니다
    } finally {
      setIsInviting(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 px-4 py-6">
        <div className="text-sm font-bold">Team Members</div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-6">
      <div className="text-sm font-bold">멤버: {teamMembers.length}</div>
      <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 mb-1 text-sm">
        <Info className="!size-4" />
        <p>프로젝트에 참여하는 팀 멤버들을 관리하세요.</p>
      </div>

      <section className="space-y-2">
        {teamMembers.length > 0 && users ? (
          users.map((user, idx) => {
            const teamMember = teamMembers[idx];
            if (!teamMember) return null;

            const role = getRoleDetails(teamMember.level);
            const userName = user.name?.[0] || "Unknown User";
            const userPicture = user.picture?.[0];

            return (
              <div key={teamMember.member} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 w-full rounded-sm pl-3 pr-4 py-2 text-sm font-medium">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={userPicture || "/placeholder.svg"} alt={userName} />
                  <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{userName}</p>
                </div>
                <Badge variant={role.variant}>{role.name}</Badge>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="text-base font-semibold">No Team Members Yet</div>
            <div className="text-sm font-medium text-muted-foreground">Invite members to collaborate on this project.</div>
          </div>
        )}
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center justify-center space-x-1.5 mt-1 w-full rounded-sm bg-blue-200 hover:bg-blue-300 text-blue-500 font-bold px-4 py-3 mb-1 text-sm transition-colors duration-200 cursor-pointer">
            <UserPlus className="!size-5" strokeWidth={2} />
            <p>팀원 초대하기</p>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>팀원 초대하기</DialogTitle>
            <DialogDescription>초대하려는 사람의 이메일을 입력하세요.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일 주소</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValidEmail(email) && !isInviting) {
                    handleInvite();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="default" onClick={handleInvite} disabled={!isValidEmail(email) || isInviting}>
              {isInviting ? "초대 중..." : "초대"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                취소
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
