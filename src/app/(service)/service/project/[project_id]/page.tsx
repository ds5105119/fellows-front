import { auth } from "@/auth";
import { Session } from "next-auth";
import { Metadata } from "next";
import { ProjectSchema, ProjectSchemaType } from "@/@types/service/project";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import ProjectEstimator from "@/components/section/service/project/estimator/projectestimator";

export const metadata: Metadata = {
  title: "프로젝트",
  description: "프로젝트를 확인하세요.",
};

export const getProject = async ({ project_id, session }: { project_id: string; session: Session }): Promise<ProjectSchemaType> => {
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
    const parsedData = ProjectSchema.parse(responseData);

    return parsedData;
  } catch (error) {
    throw error;
  }
};

export default async function Page({ params }: { params: Promise<{ project_id: string }> }) {
  const project_id = (await params).project_id;
  const session = await auth();
  if (!session) return;

  const project = await getProject({ project_id, session });

  return (
    <div className="h-full grid grid-cols-4 md:grid-cols-12 pt-10 gap-5">
      <div className="min-h-[40rem] col-span-full p-8 md:col-span-7 md:col-start-1 gap-5 border rounded-2xl flex flex-col space-y-6">
        <div className="flex justify-between">
          <div className="flex flex-col space-y-3">
            <h1 className="text-3xl font-bold">{project.project_info.project_name}</h1>
            <div className="flex justify-start items-center space-x-2.5 text-muted-foreground">
              <div>{project.status}</div>
              <div className="w-0 h-2.5 outline-[0.25px] outline-muted-foreground"></div>
              <div>{project.project_info.platforms}</div>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-3">
          <div className="flex justify-start items-center space-x-2.5 text-muted-foreground">
            <div>{project.status}</div>
            <div className="w-0 h-2.5 outline-[0.25px] outline-muted-foreground"></div>
            <div>{project.project_info.platforms}</div>
          </div>
        </div>
        <Separator className="my-4" />

        <div>{project.project_info.project_summary}</div>
      </div>

      <div
        className={cn(
          "min-h-[40rem] col-span-full p-1 md:col-span-5 gap-5 border rounded-2xl",
          (project.ai_estimate && project.ai_estimate.length > 0) ?? "bg-neutral-100"
        )}
      >
        <ProjectEstimator project={project} session={session} />
      </div>
    </div>
  );
}
