"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { toast } from "sonner";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, PageOrientation } from "docx";
import { SWRResponse } from "swr";
import { UserERPNextProject } from "@/@types/service/project";

export default function ProjectDetailSheetHeader({ onClose, project }: { onClose: () => void; project: SWRResponse<UserERPNextProject> }) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(project.data?.project_name ?? "");
      toast.success("프로젝트 번호가 복사되었습니다.");
    } catch {
      toast.error("프로젝트 번호 복사에 실패했습니다.");
    }
  }, [project.data]);

  const handleDownload = async () => {
    // 1. 동적 데이터 1~10개 생성
    const rows = (project.data?.custom_features ?? []).map((feature, i) => ({
      구분: `구분${i + 1}`,
      메뉴: `메뉴${i + 1}`,
      필요기능: `${feature.feature}`,
      기능설명: `기능 설명 ${i + 1}`,
      참고: `참고${i + 1}`,
      우선순위: `${i + 1}`,
    }));

    // 2. 컬럼 폭 설정 (A4 여백 제외 최대치)
    const columnWidth = [1000, 1000, 1700, 3500, 2000, 800];

    // 3. TableRow 생성
    const tableRows = [
      // Header
      new TableRow({
        children: ["구분", "메뉴", "필요 기능", "기능 설명", "참고", "순위"].map(
          (text, i) =>
            new TableCell({
              width: { size: columnWidth[i], type: WidthType.DXA },
              children: [
                new Paragraph({
                  children: [new TextRun({ text, bold: true, size: 16 })], // 8pt
                }),
              ],
            })
        ),
      }),
      // 데이터
      ...rows.map(
        (row) =>
          new TableRow({
            children: Object.values(row).map(
              (text, i) =>
                new TableCell({
                  width: { size: columnWidth[i], type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: String(text), size: 16 })], // 8pt
                    }),
                  ],
                })
            ),
          })
      ),
    ];

    // 4. DOCX 문서 생성 (여백 좁게)
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5인치 여백
              size: {
                orientation: PageOrientation.PORTRAIT,
              },
            },
          },
          children: [
            new Paragraph({ text: "요구사항 정의서", heading: "Heading1" }),
            new Paragraph({ text: "" }),
            new Table({
              columnWidths: columnWidth,
              rows: tableRows,
            }),
          ],
        },
      ],
    });

    // 5. Blob 생성 후 다운로드
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "요구사항_정의서.docx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sticky top-0 shrink-0 flex items-center justify-between h-16 border-b-1 border-b-sidebar-border px-4 bg-background z-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
          <ArrowLeft className="!size-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
          <LinkIcon className="!size-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent hidden md:flex"
          onClick={handleDownload}
        >
          요구사항 정의서
        </Button>
        <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent">
          이용 가이드
        </Button>
        <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent" asChild>
          <Link href={`/service/project/task?project_id=${project.data?.project_name}`}>작업 현황</Link>
        </Button>
      </div>
    </div>
  );
}
