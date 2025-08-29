"use client";

import { useState } from "react";
import type { UserERPNextProject } from "@/@types/service/project";
import { useUsers } from "@/hooks/fetch/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EllipsisVertical, Info, Trash2, UserPlus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { inviteProjectGroup, updateProjectGroup } from "@/hooks/fetch/project";
import { Session } from "next-auth";
import { SWRResponse } from "swr";

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

export function TeamsList({ projectSwr, session }: { projectSwr: SWRResponse<UserERPNextProject>; session: Session }) {
  const { data: project, mutate } = projectSwr;

  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const teamMembers = project?.custom_team || [];
  const userIds = teamMembers.map((user) => user.member);
  const { data: users, isLoading } = useUsers(userIds);

  const canEdit =
    project?.custom_team &&
    project?.custom_team.filter((user) => user.member === session.sub) &&
    project?.custom_team.filter((user) => user.member === session.sub)[0].level < 2;

  const handleInvite = async () => {
    if (!email.trim()) return;

    try {
      setIsInviting(true);
      await inviteProjectGroup(project?.project_name || "", email.trim());
      setEmail("");
      setIsDialogOpen(false);
      // 성공 메시지나 토스트를 여기에 추가할 수 있습니다
    } catch (error) {
      console.error("초대 실패:", error);
      // 에러 메시지나 토스트를 여기에 추가할 수 있습니다
    } finally {
      setIsInviting(false);
      mutate();
    }
  };

  const handleDelete = async (sub: string) => {
    updateProjectGroup(
      project?.project_name || "",
      teamMembers.filter((member) => member.member != sub)
    );
    mutate();
  };

  const handleLevelChange = (memberId: string, newLevel: number) => {
    if (!project) return;

    const customerId = project.custom_team.find((member) => member.level === 0)?.member || "";

    // 먼저 변경된 팀 구성원 리스트 생성
    const updatedTeam = project.custom_team.map((member) => {
      if (member.member === memberId) {
        return { ...member, level: Number(newLevel) };
      }
      return member;
    });

    // 권한 제약 로직 적용: customer는 0, 그 외는 최소 1
    const enforcedTeam = updatedTeam.map((member) => {
      // customer는 반드시 level 0
      if (member.member === customerId) {
        return { ...member, level: 0 };
      }

      // customer가 아닌 경우 level이 1 미만이면 강제로 1로 설정
      if (member.level < 1) {
        return { ...member, level: 1 };
      }

      return member;
    });

    updateProjectGroup(project.project_name, enforcedTeam);
    mutate();
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-6">
      <div className="text-sm font-bold">멤버: {teamMembers.length}</div>
      <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 mb-1 text-sm">
        <Info className="!size-4" />
        <p>프로젝트에 참여하는 팀 멤버들을 관리하세요.</p>
      </div>

      {project?.custom_team && project?.custom_team.length >= 5 && (
        <div className="flex items-center space-x-1.5 w-full rounded-sm bg-red-100 px-4 py-2 mb-1 text-sm">
          <Info className="!size-4" />
          <p>무료 플랜에서는 최대 5명의 팀원을 초대할 수 있어요.</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[...Array(projectSwr.data?.custom_team.length ?? 3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="space-y-2">
        {users?.map((user, idx) => {
          const teamMember = teamMembers[idx];
          if (!teamMember) return null;

          const role = getRoleDetails(teamMember.level);
          const userName = session.sub == teamMember.member ? session.user?.name + "(나)" : user.name?.[0] || "Unknown User";
          const userPicture = user.picture?.[0];
          const isAdmin = teamMember.level == 0;

          return canEdit ? (
            <div
              key={teamMember.member}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 w-full rounded-sm pl-3 pr-4 py-2 text-sm font-medium hover:bg-zinc-100 transiton-colors duration-200"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={userPicture || "/placeholder.svg"} alt={userName} className="object-cover" />
                <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{userName}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email || "이메일 없음"}</p>
              </div>
              <div className="flex items-center space-x-1.5">
                <Badge variant={role.variant}>{role.name}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1 hover:bg-zinc-200 transition-colors duration-200 rounded-md">
                    <EllipsisVertical className="!size-5 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>팀원 관리</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={`${teamMember.level}`} onValueChange={(value) => handleLevelChange(teamMember.member, Number(value))}>
                      <DropdownMenuRadioItem value="0">소유자</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="1">관리자</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="2">읽기 및 쓰기</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="3">읽기</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    {!isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center space-x-2 font-medium " asChild>
                          <button onClick={() => handleDelete(teamMember.member)} className="w-full">
                            <Trash2 className="size-4 !text-red-600" />
                            <span className="!text-red-600">삭제</span>
                          </button>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div
              key={teamMember.member}
              className={"grid grid-cols-[auto_1fr_auto] items-center gap-3 w-full rounded-sm pl-3 pr-4 py-2 text-sm font-medium rouinded-sm"}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={userPicture || "/placeholder.svg"} alt={userName} className="object-cover" />
                <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{userName}</p>
              </div>
              <Badge variant={role.variant}>{role.name}</Badge>
            </div>
          );
        })}
      </section>

      {project?.custom_team.length === 1 && (
        <div className="flex flex-col w-full">
          <div className="h-44 flex flex-col justify-center space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#e6ffed] via-[#daffe5] to-[#e6ffec] px-8 mb-1 text-sm select-none">
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-1.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-2.png" alt="@leerob" />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-3.png" alt="@evilrabbit" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/" alt="@evilrabbit" />
                <AvatarFallback>· · ·</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
            <div className="text-base font-semibold">팀원과 함께 작업하기</div>
            <div className="text-sm font-medium text-muted-foreground">팀원과 프로젝트, 작업 현황, 이슈를 공유할 수 있습니다.</div>
          </div>
        </div>
      )}

      {canEdit && project?.custom_team.length < 5 ? (
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
      ) : (
        <button className="flex items-center justify-center space-x-1.5 mt-1 w-full rounded-sm bg-zinc-200 hover:bg-zinc-300 text-zinc-500 font-bold px-4 py-3 mb-1 text-sm transition-colors duration-200 cursor-pointer">
          <p>권한이 부족해요</p>
        </button>
      )}
    </div>
  );
}
