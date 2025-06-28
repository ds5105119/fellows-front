"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
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
  );
}
