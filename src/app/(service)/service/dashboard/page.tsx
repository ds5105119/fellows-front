import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-12 py-4 md:py-16 gap-6 px-4 md:px-0 bg-muted">
      <BlurFade className="grid grid-cols-4 md:grid-cols-10 col-span-full p-6 md:p-8 md:col-span-10 md:col-start-2 gap-6 bg-white rounded-3xl">
        <div className="col-span-full flex flex-col gap-2">
          <h2 className="text-2xl font-bold">🚀 5분만에 시작하는 Fellows</h2>
          <p className="text-sm text-muted-foreground">단 두 단계로 손쉽게 프로젝트 외주를 시작하고 확인할 수 있어요.</p>
        </div>

        <div className="grid col-span-full grid-cols-4 md:grid-cols-10 gap-6">
          <div className="col-span-full md:col-span-5 flex flex-col bg-neutral-50 rounded-2xl">
            <div className="flex space-x-3.5 w-full p-6">
              <div className="mt-[3px] shrink-0 flex items-center justify-center rounded-full size-5 bg-blue-400 text-white text-xs font-bold">1</div>
              <div className="flex flex-col space-y-1">
                <div className="text-base font-bold">프로젝트 생성하기</div>
                <div className="text-sm font-medium text-muted-foreground">우선 Fellows와 작업하고 싶은 웹 및 앱 프로제트를 등록해 주세요.</div>
                <Button size="sm" className="w-fit mt-3" asChild>
                  <Link href="/service/project/new">
                    프로젝트 생성하기 <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="flex space-x-3.5 w-full p-6">
              <div className="mt-[3px] shrink-0 flex items-center justify-center rounded-full size-5 bg-blue-400 text-white text-xs font-bold">2</div>
              <div className="flex flex-col space-y-1">
                <div className="text-base font-bold">견적 상담받기</div>
                <div className="text-sm font-medium text-muted-foreground">
                  Fellows에 견적을 문의해보세요. 정확한 견적가와 일정을 알려드릴께요. 필요하다면 매니저와의 상담을 예약할 수도 있어요.
                </div>
                <Button size="sm" className="w-fit mt-3" asChild>
                  <Link href="/service/project">
                    견적 문의하기 <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="flex space-x-3.5 w-full p-6">
              <div className="mt-[3px] shrink-0 flex items-center justify-center rounded-full size-5 bg-blue-400 text-white text-xs font-bold">3</div>
              <div className="flex flex-col space-y-1">
                <div className="text-base font-bold">프로젝트 상태 확인하기</div>
                <div className="text-sm font-medium text-muted-foreground">
                  Fellows에게 맡긴 프로젝트의 상태와 인보이스를 추적해보세요. 새로운 문의가 생긴 경우 티켓을 밠급하여 문의할 수 있어요.
                </div>
                <Button size="sm" className="w-fit mt-3" asChild>
                  <Link href="/service/project">
                    진행 상태 확인하기 <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>
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
      </BlurFade>

      <BlurFade className="md:hidden grid grid-cols-4 col-span-full p-8 gap-6 bg-white rounded-3xl">
        <div className="flex col-span-full md:col-span-5 flex-1 flex-col gap-5">
          <div className="w-full">
            <AspectRatio ratio={16 / 8}>
              <Image src="/funnel.png" alt="Image" className="rounded-md object-cover" fill priority />
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">비즈니스의 시작은 펠로우즈에서</h3>
            <p className="text-sm font-medium text-muted-foreground whitespace-pre-wrap">
              {
                "Fellows에서 웹 및 앱 사이트를 쉽고 스마트하게 빌드해보세요.\n프로젝트, 지원 사업, 웹 및 앱 제작, 유지 보수, 개발팀 구독, AI 견적까지 더 합리적인 비용으로 귀사 비즈니스의 성장을 다방면으로 지원합니다."
              }
            </p>
            <p className="text-sm font-bold text-muted-foreground whitespace-pre-wrap">견적부터 웹 및 앱 제작까지 한 번에 Fellows에서 해결하세요.</p>
          </div>
        </div>
      </BlurFade>

      <BlurFade className="col-span-full p-8 md:col-span-7 md:col-start-2 flex flex-col gap-6 bg-white rounded-3xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <p className="text-sm text-muted-foreground">자주 묻는 질문을 확인해보세요.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base font-bold leading-loose">Fellows에서 개발하면 좋은 점이 무엇인가요?</AccordionTrigger>
            <AccordionContent className="whitespace-pre-wrap">
              <p>Fellows에서는 높은 수준의 말레이시아 및 인도네시아의 인하우스 개발자가 작업에 투입됩니다.</p>
              <p>자체적으로 유닛, 단위 테스트를 통해 최종 납품시 메이저 이슈 1% 미만, 마이너 이슈 5% 미만의 기준을 충족시키고 있습니다.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base font-bold leading-loose">개발은 어떻게 의뢰할 수 있나요?</AccordionTrigger>
            <AccordionContent>
              <p>프로젝트를 만든 뒤 정보를 적고 전달 버튼을 누르면 매니저가 배치됩니다.</p>
              <p>이후 최종 견적을 받아볼 수 있으며, 견적을 수락하면 개발팀이 작업을 시작합니다.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base font-bold leading-loose">AI 견적은 무료인가요?</AccordionTrigger>
            <AccordionContent>
              <p>AI 견적 서비스는 무료입니다. AI견적 결과와 실제 최종 견적 결과는 다를 수 있습니다.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </BlurFade>

      <BlurFade className="col-span-full p-8 md:col-span-3 md:col-start-9 flex flex-col gap-6 bg-white rounded-3xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <p className="text-sm text-muted-foreground">이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.</p>
        </div>
      </BlurFade>
    </div>
  );
}
