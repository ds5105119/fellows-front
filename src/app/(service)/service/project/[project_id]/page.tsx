import { auth, signIn } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Session } from "next-auth";
import { ERPNextProjectType, ERPNextProjectZod } from "@/@types/service/erpnext";
import ProjectDetailMain from "@/components/section/service/project/detail/projectdetailmain";
import ProjectEstimator from "@/components/section/service/project/detail/projectestimator";

const getProject = async ({ project_id, session }: { project_id: string; session: Session }): Promise<ERPNextProjectType> => {
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/${project_id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const parsedData = ERPNextProjectZod.parse(responseData);

    return parsedData;
  } catch (error) {
    throw error;
  }
};

export default async function Page({ params }: { params: Promise<{ project_id: string }> }) {
  const project_id = (await params).project_id;
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: `/service/project/${project_id}` });

  const project = await getProject({ project_id, session });

  return (
    <SessionProvider session={session}>
      <div className="w-full h-full flex flex-col px-8 gap-6 mt-12 mb-8">
        <div className="text-3xl md:text-4xl font-bold">{project.custom_project_title}</div>
        <Tabs defaultValue="default" className="w-full h-full">
          <TabsList className="w-96 grid grid-cols-3 mb-3">
            <TabsTrigger value="default">개요</TabsTrigger>
            <TabsTrigger value="edit">이슈</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>
          <TabsContent value="default">
            <div className="h-full grid grid-cols-4 md:grid-cols-12 gap-5">
              <div className="col-span-full flex space-x-2">
                <Input placeholder="검색어를 입력하세요" className="w-80" />
              </div>
              <div className="min-h-[40rem] col-span-full p-8 md:col-span-6 md:col-start-1 border rounded-2xl flex flex-col">
                <ProjectDetailMain project={project} />
              </div>

              <div className="relative min-h-[80rem] col-span-full p-1 md:col-span-6 gap-5 border rounded-2xl">
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                <ProjectEstimator project={project} session={session} />
              </div>
            </div>
          </TabsContent>
          <div className="h-full grid grid-cols-4 md:grid-cols-12 gap-5"></div>
          <TabsContent value="settings">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </SessionProvider>
  );
}
