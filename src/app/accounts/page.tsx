import { Avatar } from "@/components/ui/avatar";
import { auth, signIn, signOut } from "@/auth";
import { Heart, NotebookPen, ScrollText, FileSearch } from "lucide-react";
import MenuCard from "@/components/card/menucard";
import MenuCardButton from "@/components/button/menucardbutton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default async function Page() {
  const session = await auth();

  return (
    <div className="h-full bg-muted p-4 space-y-3">
      <MenuCard text="나의 정보">
        <MenuCardButton href="/accounts/welfare/data" icon={NotebookPen} text="내 가구 정보" />
        <MenuCardButton href="/settings/likes" icon={Heart} text="관심목록" />
      </MenuCard>
      <MenuCard text="전체 서비스">
        <MenuCardButton href="/explore/welfare" icon={ScrollText} text="맞춤 복지 찾기" />
        <MenuCardButton href="/settings/likes" icon={FileSearch} text="국가 예산 확인하기" />
      </MenuCard>
      <MenuCard text="나의 정보">
        <MenuCardButton href="/accounts/welfare/data" icon={NotebookPen} text="내 가구 정보" />
        <MenuCardButton href="/settings/likes" icon={Heart} text="관심목록" />
      </MenuCard>
      <MenuCard text="계정">
        {session?.user ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <MenuCardButton text="로그아웃" className="text-blue-400" showChevron={false} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 로그아웃하시겠어요?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <AlertDialogAction type="submit" className="w-full">
                    로그아웃
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("keycloak", { redirectTo: "/" });
            }}
          >
            <MenuCardButton text="로그인" className="text-blue-400" type="submit" showChevron={false} />
          </form>
        )}
        {session?.user && <MenuCardButton href="/settings/likes" text="회원탈퇴" className="text-destructive" showChevron={false} />}
      </MenuCard>
    </div>
  );
}
