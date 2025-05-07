import Image from "next/image";
import { Metadata } from "next";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BlurFade } from "@/components/magicui/blur-fade";

export const metadata: Metadata = {
  title: "회원가입 | 복지 정책 서비스",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-12 mt-10 gap-6">
      <BlurFade className="grid grid-cols-4 md:grid-cols-10 col-span-full p-8 md:col-span-10 md:col-start-2 gap-6 border rounded-3xl">
        <div className="col-span-full flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Fellows 시작하기</h2>
          <p className="text-sm text-muted-foreground">이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.</p>
        </div>

        <div className="grid col-span-full grid-cols-4 md:grid-cols-10 gap-6">
          <div className="col-span-full md:col-span-5 flex flex-1 flex-col p-6 gap-2 bg-neutral-50 rounded-2xl">
            <h2 className="text-2xl font-bold">Fellows 시작하기</h2>
            <p className="text-sm text-muted-foreground">이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.</p>
          </div>

          <div className="col-span-full md:col-span-5 flex flex-1 flex-col gap-5">
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

      <BlurFade className="col-span-full p-8 md:col-span-7 md:col-start-2 flex flex-col gap-6 border rounded-3xl">
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

      <BlurFade className="col-span-full p-8 md:col-span-3 md:col-start-9 flex flex-col gap-6 border rounded-3xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <p className="text-sm text-muted-foreground">이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.</p>
        </div>
      </BlurFade>
    </div>
  );
}
