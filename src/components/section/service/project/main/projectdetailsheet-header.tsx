"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { toast } from "sonner";
import { AlignmentType, VerticalAlign, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, PageOrientation } from "docx";
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
    // 1. 동적 데이터: project.data?.custom_features 사용
    const rows = (project.data?.custom_features ?? []).map((feature, i) => ({
      구분: `구분${i + 1}`,
      메뉴: `메뉴${i + 1}`,
      필요기능: `${feature.feature}`,
      기능설명: `기능 설명 ${i + 1}`,
      참고: `참고${i + 1}`,
      우선순위: `${i + 1}`,
    }));

    // 2. 컬럼 폭 설정
    const columnWidth = [1000, 1000, 1700, 3500, 2000, 800];

    // 3. TableRow 생성 (헤더 가운데, 특정 컬럼 가운데/나머지 왼쪽)
    const headers = ["구분", "메뉴", "필요 기능", "기능 설명", "참고", "순위"];
    const tableRows = [
      // Header row
      new TableRow({
        children: headers.map(
          (text, i) =>
            new TableCell({
              width: { size: columnWidth[i], type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0 },
                  children: [new TextRun({ text, bold: true, size: 16 })], // 8pt
                }),
              ],
            })
        ),
      }),
      // Data rows
      ...rows.map(
        (row) =>
          new TableRow({
            children: Object.values(row).map(
              (text, i) =>
                new TableCell({
                  width: { size: columnWidth[i], type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 100, right: 100 },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: i === 0 || i === 1 || i === 5 ? AlignmentType.CENTER : AlignmentType.LEFT,
                      spacing: { before: 0, after: 0 },
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
              margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5인치
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
