"use client";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useRef } from "react";
import { ERPNextProject } from "@/@types/service/project";
import { useEstimateProject } from "@/hooks/fetch/project";
import { mutate } from "swr";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
  project: ERPNextProject;
}

export default function ProjectEstimator({ project }: Props) {
  const initialized = useRef(false);
  const { markdown, isLoading, startEstimate } = useEstimateProject(project.project_name, project.custom_ai_estimate || "");

  useEffect(() => {
    if (!initialized.current && !project.custom_ai_estimate) {
      initialized.current = true;
      startEstimate();
    }
  }, [project.custom_ai_estimate, startEstimate]);

  useEffect(() => {
    if (!project.custom_ai_estimate && markdown && !isLoading) {
      mutate(`/api/service/project/${project.project_name}`);
    }
  }, [markdown, isLoading, project]);

  return (
    <div className="w-full max-w-full flex flex-col space-y-5 pb-6">
      <div className="w-full flex justify-between items-center pb-3">
        <h2 className="text-2xl font-bold">AI 견적</h2>
        <button
          onClick={startEstimate}
          disabled={isLoading || !markdown}
          className="flex items-center space-x-2 text-white text-sm font-medium bg-black hover:bg-zinc-700 disabled:bg-zinc-500 transition-colors rounded-md duration-200 h-8 md:h-9 px-3"
        >
          <BreathingSparkles size={18} />
          <p>{!markdown ? "견적 작성중이에요" : isLoading ? "견적 작성중이에요" : "견적 다시 작성하기"}</p>
        </button>
      </div>
      <MarkdownPreview loading={isLoading} className="!prose-sm">
        {markdown}
      </MarkdownPreview>
      {markdown && !isLoading && (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2">
            <hr className="border-black col-span-full" />
            <div className="col-span-1 py-2 pr-2 text-xs font-semibold text-muted-foreground hidden md:block">
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
              AI 견적은 부정확하거나 잘못된 부분이 있을 수 있습니다. AI 견적은 실제 견적과 상이할 수 있으며, Fellows는 AI 견적 기능을 통해 생기는 어떤 책임도
              부담하지 않습니다.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
