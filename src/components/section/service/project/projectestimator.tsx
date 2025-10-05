"use client";

import { TableCaption, Table, TableBody, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useState, useRef, useMemo } from "react";
import type { UserERPNextProject } from "@/@types/service/project";
import { useEstimateProject, useEstimateProjectStatus } from "@/hooks/fetch/project";
import { SWRResponse } from "swr";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/resource/text-shimmer";

interface Props {
  projectSwr: SWRResponse<UserERPNextProject>;
  project: UserERPNextProject;
  openSheet: boolean;
}

export default function ProjectEstimator({ projectSwr, project, openSheet }: Props) {
  const [lastGeneratedEstimate, setLastGeneratedEstimate] = useState("");
  const [showThinkingUI, setShowThinkingUI] = useState(false);

  const { markdown, isLoading, startEstimate } = useEstimateProject(project.project_name);
  const status = useEstimateProjectStatus(project.project_name, { refreshInterval: 4000 });

  const prevStatus = useRef<boolean | undefined>(undefined);

  // ✅ 통합 상태: 실제 "생각 중" 여부를 명확히 정의
  const isThinking = useMemo(() => {
    // SSE가 살아있다면 그걸 신뢰
    if (isLoading) return true;
    // SSE가 죽었지만 서버가 아직 처리 중이면 status.data를 신뢰
    if (status.data) return true;
    return false;
  }, [isLoading, status.data]);

  // ✅ 상태에 따라 Thinking UI 제어
  useEffect(() => {
    setShowThinkingUI(isThinking);
  }, [isThinking]);

  // ✅ SSE 이벤트가 끝나면 (markdown 도착 시) projectSwr 업데이트
  useEffect(() => {
    if (markdown) {
      setLastGeneratedEstimate(markdown);
      projectSwr.mutate();
      status.mutate(); // 최신 상태 동기화
    }
  }, [markdown]);

  // ✅ 탭 재진입 / status 변경 감지 시 (SSE가 끊긴 경우 포함)
  useEffect(() => {
    if (openSheet && prevStatus.current !== status.data) {
      projectSwr.mutate();
      prevStatus.current = status.data;
    }
  }, [openSheet, status.data]);

  // ✅ 견적 시작 핸들러
  const handleStartEstimate = async () => {
    setShowThinkingUI(true);
    setLastGeneratedEstimate("");
    await startEstimate();
  };

  // ✅ 현재 표시할 견적 결정
  const currentEstimate = showThinkingUI ? "" : lastGeneratedEstimate || project.custom_ai_estimate;

  const hasExistingEstimate = Boolean(project.custom_ai_estimate || lastGeneratedEstimate);
  const showEstimateContent = Boolean(currentEstimate);
  const showPricingTable = showEstimateContent && !isThinking;

  const getButtonText = () => {
    if (isThinking && !markdown) return "견적 작성 중이에요";
    if (isThinking && markdown) return "견적 생성 중이에요";
    if (!hasExistingEstimate) return "AI 견적 작성하기";
    return "견적 다시 작성하기";
  };

  return (
    <div className="w-full max-w-full flex flex-col space-y-5 pb-6">
      <div className="w-full flex justify-between items-center pb-3">
        <h2 className="text-2xl font-bold">AI 견적</h2>
        <Button
          onClick={handleStartEstimate}
          disabled={isThinking}
          className="flex items-center space-x-2 text-white text-sm font-medium bg-black hover:bg-zinc-700 disabled:bg-zinc-500 transition-colors rounded-md duration-200 h-8 md:h-9 px-3"
        >
          <BreathingSparkles size={18} />
          <p>{getButtonText()}</p>
        </Button>
      </div>

      {/* Thinking UI */}
      {showThinkingUI && (
        <TextShimmer className="text-sm">견적서를 생성하는 중입니다. 1분 정도 걸릴 수 있으니 견적서가 준비되면 다시 확인해 주세요 • • •</TextShimmer>
      )}

      {/* 견적 내용 표시 */}
      {showEstimateContent && (
        <MarkdownPreview loading={isThinking && !markdown} className="!prose-sm mb-12">
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
