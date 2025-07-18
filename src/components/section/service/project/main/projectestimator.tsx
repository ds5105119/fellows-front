"use client";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useState } from "react";
import type { UserERPNextProject } from "@/@types/service/project";
import { useEstimateProject } from "@/hooks/fetch/project";
import { mutate } from "swr";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  project: UserERPNextProject;
}

export default function ProjectEstimator({ project }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  // 마지막 생성된 견적을 캐시하는 상태 추가
  const [lastGeneratedEstimate, setLastGeneratedEstimate] = useState("");

  const { markdown, isLoading, startEstimate } = useEstimateProject(project.project_name, "");

  // 스트림 완료 시 API 데이터 갱신
  useEffect(() => {
    if (!isLoading && isGenerating && markdown) {
      // 마지막 생성된 견적을 저장
      setLastGeneratedEstimate(markdown);

      const timer = setTimeout(() => {
        mutate(`/api/service/project/${project.project_name}`);
        setIsGenerating(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isGenerating, markdown, project.project_name]);

  const handleStartEstimate = () => {
    setIsGenerating(true);
    startEstimate();
  };

  // 현재 표시할 견적 내용 결정 (개선된 로직)
  const currentEstimate = (() => {
    if (isGenerating) {
      return markdown; // 스트림 중에는 실시간 markdown
    }

    // 스트림 완료 후에는 서버 데이터 우선, 없으면 마지막 생성된 견적 사용
    return project.custom_ai_estimate || lastGeneratedEstimate || "";
  })();

  // 현재 상태 결정
  const hasExistingEstimate = Boolean(project.custom_ai_estimate || lastGeneratedEstimate);
  const isThinking = isGenerating && !markdown;
  const showEstimateContent = Boolean(currentEstimate);
  const showPricingTable = showEstimateContent && !isLoading;

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isGenerating && !markdown) return "견적 작성중이에요";
    if (isGenerating && markdown) return "견적 생성중이에요";
    if (!hasExistingEstimate && !currentEstimate) return "AI 견적 작성하기";
    return "견적 다시 작성하기";
  };

  return (
    <div className="w-full max-w-full flex flex-col space-y-5 pb-6">
      <div className="w-full flex justify-between items-center pb-3">
        <h2 className="text-2xl font-bold">AI 견적</h2>
        <Button
          onClick={handleStartEstimate}
          disabled={isLoading || isGenerating}
          className="flex items-center space-x-2 text-white text-sm font-medium bg-black hover:bg-zinc-700 disabled:bg-zinc-500 transition-colors rounded-md duration-200 h-8 md:h-9 px-3"
        >
          <BreathingSparkles size={18} />
          <p>{getButtonText()}</p>
        </Button>
      </div>

      {/* 생각중 상태 */}
      {isThinking && (
        <div className="flex items-center space-x-1.5">
          <span className="text-sm text-muted-foreground">견적서를 생성하는 중입니다. 1분 정도 걸릴 수 있으니 견적서가 준비되면 다시 확인해 주세요.</span>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-[3px] h-[3px] bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* 견적 내용 표시 */}
      {showEstimateContent && (
        <MarkdownPreview loading={isGenerating} className="!prose-sm mb-12">
          {currentEstimate}
        </MarkdownPreview>
      )}

      {/* 가격 테이블 */}
      {showPricingTable && (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2">
            <hr className="border-black col-span-full" />
            <div className="col-span-1 py-2 pr-2 text-xs font-semibold text-muted-foreground hidden md:block">
              <div className="text-base font-bold text-foreground mb-1">참고사항</div>
              AI 견적은 부정확하거나 잘못된 부분이 있을 수 있습니다. AI 견적은 실제 견적과 상이할 수 있으며, Fellows는 AI 견적 기능을 통해 생기는 어떤 책임도
              부담하지 않습니다.
            </div>
            <Table className="col-span-1 md:pl-2 order-1">
              <TableCaption className="sr-only">견적 결제 표</TableCaption>
              <TableBody>
                <TableRow>
                  <TableCell className="w-2/5 font-medium bg-muted">총 합계</TableCell>
                  <TableCell className="w-3/5 text-right">{(project.estimated_costing ?? 0).toLocaleString()} 원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-2/5 font-medium bg-muted">공급가액</TableCell>
                  <TableCell className="w-3/5 text-right">{(project.estimated_costing ?? 0).toLocaleString()} 원</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-2/5 font-medium bg-muted">VAT 10%</TableCell>
                  <TableCell className="w-3/5 text-right">{((project.estimated_costing ?? 0) * 0.1).toLocaleString()} 원</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="w-2/5 bg-black text-white">Total</TableCell>
                  <TableCell className="w-3/5 text-right bg-black text-white">{((project.estimated_costing ?? 0) * 1.1).toLocaleString()} 원</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="col-span-1 py-2 pr-2 text-xs font-semibold text-muted-foreground block md:hidden">
              <div className="text-base font-bold text-foreground mb-1">참고사항</div>
              AI 견적은 부정확하거나 잘못된 부분이 있을 수 있습니다. AI 견적은 실제 견적과 상이할 수 있으며, Fellows는 AI 견적 기능을 통해 생기는 어떤 책임도
              부담하지 않습니다.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
