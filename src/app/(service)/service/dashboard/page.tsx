import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { auth, signIn } from "@/auth";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckIcon } from "lucide-react";
import { Session } from "next-auth";
import { projectsPaginatedResponseSchema, UserERPNextProject } from "@/@types/service/project";
import { ConfettiButton } from "@/components/magicui/confetti";
import { ProjectOverviewChart } from "@/components/section/service/dashboard/projectoverview";
import { TaskOverviewChart } from "@/components/section/service/dashboard/taskoverview";
import FAQ from "@/components/section/service/dashboard/faq";

interface OnboardingProps {
  hasProject: boolean;
  hasInquery: boolean;
  project?: UserERPNextProject;
}

const getOnboarding = async ({ session }: { session: Session }): Promise<OnboardingProps> => {
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}`;

  try {
    const projectResponse = await fetch(`${url}?size=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!projectResponse.ok) {
      const errorData = await projectResponse.json();
      throw new Error(errorData.message || `HTTP error! status: ${projectResponse.status}`);
    }

    const projectResponseResponseData = await projectResponse.json();
    const projectResponseParsedData = projectsPaginatedResponseSchema.parse(projectResponseResponseData);
    const hasProject = projectResponseParsedData.items.length > 0;

    const inQueryResponse = await fetch(`${url}?size=1&status=process`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!inQueryResponse.ok) {
      const errorData = await inQueryResponse.json();
      throw new Error(errorData.message || `HTTP error! status: ${inQueryResponse.status}`);
    }

    const inQueryResponseResponseData = await inQueryResponse.json();
    const inQueryResponseParsedData = projectsPaginatedResponseSchema.parse(inQueryResponseResponseData);
    const hasInQuery = inQueryResponseParsedData.items.length > 0;

    return { hasProject: hasProject, hasInquery: hasInQuery, project: inQueryResponseParsedData.items[0] };
  } catch (error) {
    throw error;
  }
};

export default async function Page() {
  const session = await auth();
  if (!session) return signIn("keycloak", { redirectTo: "/service/dashboard" });

  const { hasProject, hasInquery, project } = await getOnboarding({ session });
  const url = project ? `/service/project/${project.project_name}/detail` : "/service/project";

  const cookie = await cookies();
  const secondOnboardingIsDone = cookie.get("onboarding_2_done")?.value == "true";

  return (
    <div className="grid grid-cols-4 md:grid-cols-12 md:py-16 md:gap-6 bg-muted">
      <div className="grid grid-cols-4 md:grid-cols-10 col-span-full px-6 py-12 md:p-8 md:col-span-10 md:col-start-2 gap-6 bg-white md:rounded-3xl">
        <div className="col-span-full flex flex-col gap-2">
          <h2 className="text-2xl font-bold">🚀 5분만에 시작하는 Fellows</h2>
          <p className="text-sm text-muted-foreground">단 두 단계로 손쉽게 프로젝트 외주를 시작하고 확인할 수 있어요.</p>
        </div>

        <div className="grid col-span-full grid-cols-4 md:grid-cols-10 gap-6">
          <div className="col-span-full h-fit md:col-span-5 flex flex-col bg-neutral-50 rounded-2xl overflow-hidden">
            {hasProject ? (
              <div className="flex space-x-3.5 w-full p-6 bg-blue-50">
                <CheckIcon className="mt-[3px] shrink-0 bg-blue-400 rounded-full text-white !size-5 p-1" strokeWidth={3} />
                <div className="flex flex-col space-y-1">
                  <div className="text-base font-bold">프로젝트 생성 완료!</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Fellows에서는 프로젝트를 등록하면 외주 프로젝트의 인보이스를 확인하고, 프로젝트의 진행 상황을 관찰할 수 있어요.
                  </div>
                  <div className="mt-3">
                    <ConfettiButton className="h-8 rounded-md gap-1.5 px-3">축하받기 🥳</ConfettiButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3.5 w-full p-6 hover:backdrop-brightness-95 transition-all duration-200">
                <div className="mt-[3px] shrink-0 flex items-center justify-center rounded-full size-5 bg-blue-400 text-white text-xs font-bold">1</div>
                <div className="flex flex-col space-y-1">
                  <div className="text-base font-bold">프로젝트 생성하기</div>
                  <div className="text-sm font-medium text-muted-foreground">우선 Fellows와 작업하고 싶은 웹 및 앱 프로제트를 등록해 주세요.</div>
                  <Button size="sm" className="w-fit mt-3" asChild>
                    <Link href="/service/project/new">
                      생성하기 <ArrowUpRight />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            <hr className="border-gray-200" />

            {secondOnboardingIsDone ? (
              <div className="flex space-x-3.5 w-full p-6 bg-blue-50">
                <CheckIcon className="mt-[3px] shrink-0 bg-blue-400 rounded-full text-white !size-5 p-1" strokeWidth={3} />
                <div className="flex flex-col space-y-1">
                  <div className="text-base font-bold">진행 상태 확인 완료!</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Fellows에서 프로젝트의 실시간 진행 상황, 문의하기, AI 견적서 확인 등 다양한 기능을 사용해보세요. SaaS방식으로 프로젝트를 쉽게 시작할 수
                    있어요.
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <ConfettiButton className="h-8 rounded-md gap-1.5 px-3">축하받기 🥳</ConfettiButton>
                    <Button size="sm" className="w-fit" asChild>
                      <Link href="/service/project">
                        프로젝트 보러가기 <ArrowUpRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3.5 w-full p-6 hover:backdrop-brightness-95 transition-all duration-200">
                <div className="mt-[3px] shrink-0 flex items-center justify-center rounded-full size-5 bg-blue-400 text-white text-xs font-bold">3</div>
                <div className="flex flex-col space-y-1">
                  <div className="text-base font-bold">프로젝트 상태 확인하기</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Fellows에게 맡긴 프로젝트의 상태와 인보이스를 추적해보세요. 새로운 문의가 생긴 경우 티켓을 밠급하여 문의할 수 있어요.
                  </div>
                  <Button size="sm" className="w-fit mt-3" asChild>
                    <Link href={url}>
                      확인하기 <ArrowUpRight />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            <hr className="border-gray-200" />

            {hasInquery ? (
              <div className="flex space-x-3.5 w-full p-6 bg-blue-50">
                <CheckIcon className="mt-[3px] shrink-0 bg-blue-400 rounded-full text-white !size-5 p-1" strokeWidth={3} />
                <div className="flex flex-col space-y-1">
                  <div className="text-base font-bold">프로젝트 문의 완료!</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    문의해주신 프로젝트를 Fellows에서 꼼꼼하게 읽어보고 최종 견적서를 보내드릴께요.
                  </div>
                  <div className="mt-3">
                    <ConfettiButton className="h-8 rounded-md gap-1.5 px-3">축하받기 🥳</ConfettiButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3.5 w-full p-6 hover:backdrop-brightness-95 transition-all duration-200">
                <div className="mt-[3px] shrink-0 flex items-center justify-center rounded-full size-5 bg-blue-400 text-white text-xs font-bold">2</div>
                <div className="flex flex-col space-y-1">
                  <div className="text-base font-bold">견적 상담받기</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Fellows에 견적을 문의해보세요. 정확한 견적가와 일정을 알려드릴께요. 필요하다면 매니저와의 상담을 예약할 수도 있어요.
                  </div>
                  <Button size="sm" className="w-fit mt-3" asChild>
                    <Link href="/service/project">
                      문의하기 <ArrowUpRight />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex col-span-full md:col-span-5 flex-1 flex-col gap-5">
            <div className="w-full">
              <AspectRatio ratio={16 / 8}>
                <Image src="/funnel.png" alt="Image" className="rounded-md object-cover" fill priority />
              </AspectRatio>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">비즈니스의 시작은 펠로우즈에서</h3>
              <p className="text-sm font-medium text-muted-foreground whitespace-pre-wrap">
                {
                  "펠로우즈에서 웹 및 앱 사이트를 쉽고 스마트하게 빌드해보세요.\n프로젝트, 지원 사업, 웹 및 앱 제작, 유지 보수, 개발팀 구독, AI 견적까지 더 합리적인 비용으로 귀사 비즈니스의 성장을 지원합니다."
                }
              </p>
              <p className="text-sm font-bold text-muted-foreground whitespace-pre-wrap">{"견적부터 웹 및 앱 제작까지 한 번에 펠로우즈에서 해결하세요."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-full md:col-span-10 md:col-start-2 px-6 py-12 md:p-8 gap-6 bg-white md:rounded-3xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">작업 현황</h2>
          <p className="text-sm text-muted-foreground">기간 작업양을 확인해보세요.</p>
        </div>

        <TaskOverviewChart />
      </div>

      <div className="col-span-full p-8 md:col-span-7 md:col-start-2 flex flex-col gap-6 bg-white md:rounded-3xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <p className="text-sm text-muted-foreground">자주 묻는 질문을 확인해보세요.</p>
        </div>

        <FAQ />
      </div>

      <div className="col-span-full p-8 md:col-span-3 md:col-start-9 flex flex-col gap-3 bg-white md:rounded-3xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">프로젝트 진행 현황</h2>
        </div>

        <div className="mx-auto">
          <ProjectOverviewChart />
        </div>
      </div>
    </div>
  );
}
