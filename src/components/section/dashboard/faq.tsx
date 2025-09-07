"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/motion-primitives/accordion";
import { ChevronRight } from "lucide-react";

export default function FAQ() {
  return (
    <Accordion
      className="flex w-full flex-col"
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      variants={{
        expanded: {
          opacity: 1,
          scale: 1,
        },
        collapsed: {
          opacity: 0,
          scale: 0.7,
        },
      }}
    >
      <AccordionItem value="getting-started" className="py-1">
        <AccordionTrigger className="w-full pt-0.5 pb-1.5 text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
            <div className="ml-2 text-zinc-950 dark:text-zinc-50">Fellows에서 개발하면 좋은 점이 무엇인가요?</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="origin-left">
          <p className="pl-6 pr-2 text-zinc-500 dark:text-zinc-400 text-sm">
            Fellows에서는 높은 수준의 말레이시아 및 인도네시아의 인하우스 개발자가 작업에 투입됩니다. 자체적으로 유닛, 단위 테스트를 통해 최종 납품시 메이저
            이슈 1% 미만, 마이너 이슈 5% 미만의 기준을 충족시키고 있습니다.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="animation-properties" className="py-1">
        <AccordionTrigger className="w-full pt-0.5 pb-1.5 text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
            <div className="ml-2 text-zinc-950 dark:text-zinc-50">개발은 어떻게 의뢰할 수 있나요?</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="origin-left">
          <p className="pl-6 pr-2 text-zinc-500 dark:text-zinc-400 text-sm">
            프로젝트를 만든 뒤 정보를 적고 전달 버튼을 누르면 매니저가 배치됩니다. 이후 최종 견적을 받아볼 수 있으며, 견적을 수락하면 개발팀이 작업을
            시작합니다.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="advanced-features" className="py-1">
        <AccordionTrigger className="w-full pt-0.5 pb-1.5 text-left text-zinc-950 dark:text-zinc-50">
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
            <div className="ml-2 text-zinc-950 dark:text-zinc-50">AI 견적은 무료인가요?</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="origin-left">
          <p className="pl-6 pr-2 text-zinc-500 dark:text-zinc-400 text-sm">
            AI 견적 서비스는 무료입니다. AI견적 결과와 실제 최종 견적 결과는 다를 수 있습니다.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
