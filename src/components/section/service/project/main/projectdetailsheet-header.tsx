"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, LinkIcon, Info } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlignmentType,
  VerticalAlign,
  TableLayoutType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  PageOrientation,
  HeightRule,
  LineRuleType,
  HeadingLevel,
  ImageRun,
} from "docx";
import { SWRResponse } from "swr";
import { UserERPNextProject } from "@/@types/service/project";

export default function ProjectDetailSheetHeader({ onClose, project }: { onClose: () => void; project: SWRResponse<UserERPNextProject> }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // --- 쿠키 유틸 ---
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const setCookie = (name: string, value: string, days: number) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  };

  useEffect(() => {
    if (!getCookie("requirement_doc_onboarded")) {
      setShowOnboarding(true);
    }
  }, []);

  const handleDismissOnboarding = () => {
    setCookie("requirement_doc_onboarded", "true", 30);
    setShowOnboarding(false);
  };

  // --- 프로젝트 번호 복사 ---
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(project.data?.project_name ?? "");
      toast.success("프로젝트 번호가 복사되었습니다.");
    } catch {
      toast.error("프로젝트 번호 복사에 실패했습니다.");
    }
  }, [project.data]);

  // --- 이미지 fetch ---
  const fetchImage = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  };

  // --- 요구사항 정의서 다운로드 ---
  const handleDownload = async () => {
    const buffer = await fetchImage("/fellows/logo.png");

    const rows = (project.data?.custom_features ?? []).map((feature, i) => ({
      구분: `구분${i + 1}`,
      메뉴: `메뉴${i + 1}`,
      필요기능: `${feature.feature}`,
      기능설명: `기능 설명 ${i + 1}`,
      참고: `참고${i + 1}`,
      우선순위: `${i + 1}`,
    }));

    const columnWidth = [1000, 1000, 1700, 3500, 2000, 800];

    const headers = ["구분", "메뉴", "필요 기능", "기능 설명", "참고", "순위"];
    const tableRows = [
      new TableRow({
        height: { value: 480, rule: HeightRule.ATLEAST },
        children: headers.map(
          (text, i) =>
            new TableCell({
              width: { size: columnWidth[i], type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: "center",
                  children: [new TextRun({ text, bold: true, size: 18 })],
                }),
              ],
            })
        ),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            height: { value: 280, rule: HeightRule.ATLEAST },
            children: Object.values(row).map(
              (text, i) =>
                new TableCell({
                  width: { size: columnWidth[i], type: WidthType.DXA },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: i === 0 || i === 1 || i === 5 ? AlignmentType.CENTER : AlignmentType.LEFT,
                      spacing: { lineRule: LineRuleType.AUTO },
                      children: [new TextRun({ text: String(text), size: 18 })],
                    }),
                  ],
                })
            ),
          })
      ),
    ];

    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 32,
              bold: true,
              color: "000000",
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 720, right: 720, bottom: 720, left: 720 },
              size: { orientation: PageOrientation.PORTRAIT },
            },
          },
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffer,
                  type: "png",
                  transformation: { width: 181, height: 31 },
                }),
              ],
            }),
            new Paragraph({ children: [new TextRun({ text: "", size: 18 })] }),
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun("요구사항 정의서")],
            }),
            new Paragraph({ children: [new TextRun({ text: "", size: 18 })] }),
            new Table({
              columnWidths: columnWidth,
              rows: tableRows,
              layout: TableLayoutType.FIXED,
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "요구사항_정의서.docx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sticky top-0 shrink-0 flex items-center justify-between h-16 border-b border-b-sidebar-border px-4 bg-background z-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
          <ArrowLeft className="!size-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="hover:bg-blue-500/10 border-0 focus-visible:ring-0">
          <LinkIcon className="!size-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 relative">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent hidden md:flex"
            onClick={handleDownload}
          >
            요구사항 정의서
          </Button>
          {showOnboarding && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 p-4 rounded-md bg-zinc-100 shadow-xl text-sm z-50">
              {/* 꼬리 */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 
                    border-l-8 border-r-8 border-b-8
                    border-transparent border-b-zinc-100"
              ></div>

              <div className="flex gap-2 items-start">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">요구사항 정의서 안내</p>
                  <p className="text-gray-600 mt-1">
                    해당 버튼을 통해 요구사항 정의서를 다운 받을 수 있어요.
                    <br />
                    요구사항 정의서를 작성하고 업로드해주시면 더욱 빠른 개발이 가능해요.
                  </p>

                  <div className="flex justify-end">
                    <Button onClick={handleDismissOnboarding} size="sm">
                      확인
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

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
