"use client";

import { TableCaption } from "@/components/ui/table";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useState, useRef } from "react";
import type { UserERPNextProject } from "@/@types/service/project";
import { useEstimateProject, useEstimateProjectStatus } from "@/hooks/fetch/project";
import { SWRResponse } from "swr";
import { Table, TableBody, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/resource/text-shimmer";

interface Props {
  projectSwr: SWRResponse<UserERPNextProject>;
  project: UserERPNextProject;
}

export default function ProjectEstimator({ projectSwr, project }: Props) {
  const [lastGeneratedEstimate, setLastGeneratedEstimate] = useState("");
  const [showThinkingUI, setShowThinkingUI] = useState(false);
  const prevStatusRef = useRef<boolean | undefined>(undefined);

  const { markdown, isLoading, startEstimate } = useEstimateProject(project.project_name);
  const status = useEstimateProjectStatus(project.project_name, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (status.data && !markdown) {
      setShowThinkingUI(true);
    } else if (!status.data && prevStatusRef.current === true) {
      setShowThinkingUI(false);
    }

    status.mutate();
    projectSwr.mutate();

    prevStatusRef.current = status.data;
  }, [status.data, markdown, isLoading, project.project_name]);

  useEffect(() => {
    setLastGeneratedEstimate(markdown);

    if (markdown) {
      setShowThinkingUI(false);
    }

    if (!isLoading) {
      setShowThinkingUI(false);
      status.mutate();
      projectSwr.mutate();
    }
  }, [markdown, isLoading]);

  const handleStartEstimate = async () => {
    setShowThinkingUI(true);
    setLastGeneratedEstimate("");
    startEstimate();
  };

  // 현재 표시할 견적 결정
  const currentEstimate = showThinkingUI ? "" : lastGeneratedEstimate || project.custom_ai_estimate;

  const hasExistingEstimate = Boolean(project.custom_ai_estimate || lastGeneratedEstimate);
  const showEstimateContent = Boolean(currentEstimate);
  const showPricingTable = showEstimateContent && !isLoading;

  const getButtonText = () => {
    if (showThinkingUI && !markdown) return "견적 작성중이에요";
    if (showThinkingUI && markdown) return "견적 생성중이에요";
    if (!hasExistingEstimate) return "AI 견적 작성하기";
    return "견적 다시 작성하기";
  };

  return (
    <div className="w-full max-w-full flex flex-col space-y-5 pb-6">
      <div className="w-full flex justify-between items-center pb-3">
        <h2 className="text-2xl font-bold">AI 견적</h2>
        <Button
          onClick={handleStartEstimate}
          disabled={isLoading || showThinkingUI}
          className="flex items-center space-x-2 text-white text-sm font-medium bg-black hover:bg-zinc-700 disabled:bg-zinc-500 transition-colors rounded-md duration-200 h-8 md:h-9 px-3"
        >
          <BreathingSparkles size={18} />
          <p>{getButtonText()}</p>
        </Button>
      </div>

      {/* Thinking UI */}
      {showThinkingUI && (
        <TextShimmer className="text-sm relativ">견적서를 생성하는 중입니다. 1분 정도 걸릴 수 있으니 견적서가 준비되면 다시 확인해 주세요 • • •</TextShimmer>
      )}

      {/* 견적 내용 표시 */}
      {showEstimateContent && (
        <MarkdownPreview loading={isLoading && !showThinkingUI} className="!prose-sm mb-12">
          {currentEstimate}
        </MarkdownPreview>
      )}

      {/* 가격 테이블 */}
      {showPricingTable && (
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
                <TableCell className="w-3/5 text-right">{(projectSwr.data?.estimated_costing ?? 0).toLocaleString()} 원</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-2/5 font-medium bg-muted">공급가액</TableCell>
                <TableCell className="w-3/5 text-right">{(projectSwr.data?.estimated_costing ?? 0).toLocaleString()} 원</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-2/5 font-medium bg-muted">VAT 10%</TableCell>
                <TableCell className="w-3/5 text-right">{Math.round((projectSwr.data?.estimated_costing ?? 0) * 0.1).toLocaleString()} 원</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="w-2/5 bg-black text-white">Total</TableCell>
                <TableCell className="w-3/5 text-right bg-black text-white">
                  {Math.round((projectSwr.data?.estimated_costing ?? 0) * 1.1).toLocaleString()} 원
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className="col-span-1 py-2 pr-2 text-xs font-semibold text-muted-foreground block md:hidden">
            <div className="text-base font-bold text-foreground mb-1">참고사항</div>
            AI 견적은 부정확하거나 잘못된 부분이 있을 수 있습니다. AI 견적은 실제 견적과 상이할 수 있으며, Fellows는 AI 견적 기능을 통해 생기는 어떤 책임도
            부담하지 않습니다.
          </div>
        </div>
      )}
    </div>
  );
}
