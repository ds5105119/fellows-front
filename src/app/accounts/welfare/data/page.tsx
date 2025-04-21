import { auth } from "@/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserData } from "@/hooks/account/api/userdata";
import MobileDetailHeader from "@/components/header/mobiledetailheader";
import UserDataEditForm from "@/components/form/userdataeditform";

export default async function Page() {
  const session = await auth();
  if (!session) return "로그인이 필요합니다.";

  const userData = await getUserData({ session });

  return (
    <div className="h-full">
      <div className="p-4 space-y-3">
        안녕하세요 {session?.user && session.user.name} 님
        <Tabs defaultValue="primary" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="primary">기본 정보</TabsTrigger>
            <TabsTrigger value="secondary">추가 정보</TabsTrigger>
          </TabsList>
          <TabsContent value="primary">
            <UserDataEditForm data={userData} />
          </TabsContent>
          <TabsContent value="secondary">
            <div className="grid w-full items-center gap-1.5 p-1">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
