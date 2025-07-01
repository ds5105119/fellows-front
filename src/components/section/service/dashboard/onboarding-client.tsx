"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import type { UserERPNextProject } from "@/@types/service/project";
import { ConfettiButton } from "@/components/magicui/confetti";
import { UpdateUserAttributes, UserData } from "@/@types/accounts/userdata";

interface OnboardingClientProps {
  userData: UserData;
  hasProject: boolean;
  hasInquery: boolean;
  project?: UserERPNextProject;
  updateUser: (data: UpdateUserAttributes) => Promise<void>;
}

export function OnboardingClient({ userData, hasProject, hasInquery, project, updateUser }: OnboardingClientProps) {
  const [isExpanded, setIsExpanded] = useState(userData.dashboard_1_open ?? true);
  const url = project ? `/service/project/${project.project_name}` : "/service/project";

  useEffect(() => {
    updateUser({ userData: [JSON.stringify({ ...userData, dashboard_1_open: isExpanded })] });
  }, [updateUser, isExpanded, userData]);

  return (
    <motion.div
      className="grid grid-cols-4 md:grid-cols-10 col-span-full px-6 py-6 md:p-8 md:col-span-10 md:col-start-2 gap-6 bg-white md:rounded-3xl"
      initial={false}
      animate={{
        height: isExpanded ? "auto" : "auto",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <div className="col-span-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{hasProject && hasInquery && userData.dashboard_1_2_end ? "튜토리얼 완료" : " 🚀 5분만에 시작하는 Fellows"}</h2>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  style={{ overflow: "hidden" }}
                >
                  단 두 단계로 손쉽게 프로젝트 외주를 시작하고 확인할 수 있어요.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="shrink-0 ml-4">
            {isExpanded ? (
              <>
                접기 <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                펼치기 <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="grid col-span-full grid-cols-4 md:grid-cols-10 gap-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            style={{ overflow: "hidden" }}
          >
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

              {userData.dashboard_1_2_end ? (
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
                  <div className="mt-[3px] shrink-0 flex items-center justify-center rounded-full size-5 bg-blue-400 text-white text-xs font-bold">2</div>
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
                  <div className="mt-[3px] shrink-0 flex items-center justify-center rounded-full size-5 bg-blue-400 text-white text-xs font-bold">3</div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
