"use client";
import { useState } from "react";
import type { UserERPNextProject } from "@/@types/service/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, PenIcon, XIcon, Download, FileText } from "lucide-react";
import type { Session } from "next-auth";
import type { SWRResponse } from "swr";
import { useContracts } from "@/hooks/fetch/contract";
import dayjs from "@/lib/dayjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { UserERPNextContract } from "@/@types/service/contract";
import parse from "html-react-parser";

export function ContractList({ projectSwr }: { projectSwr: SWRResponse<UserERPNextProject>; session: Session }) {
  const { data: project } = projectSwr;
  const project_id = project?.project_name ?? "";
  const { data: contractsSwr, isLoading } = useContracts({ project_id });
  const contracts = contractsSwr?.flatMap((page) => page.items) ?? [];
  const [contract, setContract] = useState<UserERPNextContract | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState(false);

  // 계약금 계산 함수
  const calculatePayments = (contract: UserERPNextContract) => {
    const totalFee = contract.custom_fee || 0;
    const downPaymentRate = contract.custom_down_payment || 0;
    const balanceRate = contract.custom_balance || 0;

    const downPaymentAmount = Math.round(totalFee * (downPaymentRate / 100));
    const balanceAmount = Math.round(totalFee * (balanceRate / 100));

    return {
      totalFee,
      downPaymentRate,
      balanceRate,
      downPaymentAmount,
      balanceAmount,
    };
  };

  // 금액 포맷팅 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount) + "원";
  };

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-6">
      <div className="text-sm font-bold">계약서: {contracts.length}건</div>
      <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 mb-1 text-sm">
        <Info className="!size-4" />
        <p>프로젝트 계약서를 한 곳에서 관리할 수 있어요.</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="space-y-2">
        {contracts.map((contract) => (
          <div
            key={contract.name}
            className="flex flex-col space-y-2 p-3 rounded-sm border hover:bg-zinc-100 transition-colors duration-200 cursor-pointer w-full"
            onClick={() => {
              setContract(contract);
              setOpenSheet(true);
            }}
          >
            <p className="text-sm font-bold">
              <span className="font-medium text-muted-foreground">계약명:&nbsp;</span>
              {contract.custom_name || "계약서"}
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <PenIcon className="!size-3.5 inline-block mr-1" />
              <p className="text-xs font-medium text-muted-foreground">{dayjs(contract.modified).format("LL")}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button
                variant="default"
                size="sm"
                className="text-xs font-semibold h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  // DOCS 버튼의 동작 구현
                  console.log("DOCS 버튼 클릭");
                }}
              >
                결제하기
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold h-7 bg-transparent hover:bg-zinc-200"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  // DOCS 버튼의 동작 구현
                  console.log("DOCS 버튼 클릭");
                }}
              >
                <FileText className="w-3 h-3 mr-1" />
                DOCS
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold h-7 bg-transparent hover:bg-zinc-200"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  // PDF 다운로드 동작 구현
                  console.log("PDF 버튼 클릭");
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        ))}
      </section>

      {contracts.length === 0 && (
        <div className="flex flex-col w-full">
          <div className="h-44 flex flex-col justify-center space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#e6ffed] via-[#daffe5] to-[#e6ffec] px-8 mb-1 text-sm select-none">
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-1.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-2.png" alt="@leerob" />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/teams-avatar-3.png" alt="@evilrabbit" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <Avatar className="size-11">
                <AvatarImage src="/" alt="@evilrabbit" />
                <AvatarFallback>· · ·</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
            <div className="text-base font-semibold">계약서 관리</div>
            <div className="text-sm font-medium text-muted-foreground">프로젝트 계약서를 생성하고 관리할 수 있습니다.</div>
          </div>
        </div>
      )}

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger className="sr-only" />
        <SheetContent side="left" className="w-full h-full sm:max-w-full md:w-[45%] md:min-w-[728px] [&>button:first-of-type]:hidden gap-0">
          <SheetHeader className="sr-only">
            <SheetTitle>계약서</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
            {/* 헤더 */}
            <div className="sticky top-0 shrink-0 flex flex-row-reverse md:flex-row items-center justify-between h-16 border-b border-gray-200 px-4 bg-background z-20">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent">
                  <Download className="w-4 h-4 mr-1" />
                  내보내기
                </Button>
              </div>
              <div className="flex flex-row-reverse md:flex-row items-center gap-3">
                <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 border-0 focus-visible:ring-0" onClick={() => setOpenSheet(false)}>
                  <XIcon className="!size-5" />
                </Button>
              </div>
            </div>

            {/* 계약서 내용 */}
            <div className="p-6 md:p-8 space-y-6">
              {/* 제목 */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">프로젝트 개발 계약서</h1>
                <p className="text-sm text-gray-600">계약번호: {contract?.name}</p>
              </div>

              {/* 통합 테이블 */}
              {contract && (
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <tbody>
                    {/* 계약 주요 사항 */}
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-100 font-bold text-center" colSpan={4}>
                        계약 주요 사항
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center w-1/4">계약명</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        {contract?.custom_name || "프로젝트 개발"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">계약 기간</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        {contract?.start_date && contract?.end_date
                          ? `${dayjs(contract.start_date).format("YYYY년 M월 D일")} - ${dayjs(contract.end_date).format("YYYY년 M월 D일")}`
                          : "미정"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">하자보수기간</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        {contract?.custom_maintenance_start_date && contract?.custom_maintenance_end_date
                          ? `${dayjs(contract.custom_maintenance_start_date).format("YYYY년 M월 D일")} - ${dayjs(contract.custom_maintenance_end_date).format(
                              "YYYY년 M월 D일"
                            )}`
                          : "본 계약이 종료된 날부터 영업일 기준 10일"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">개발 비용</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        {contract?.custom_fee ? `${formatCurrency(contract.custom_fee)} (부가세별도)` : "미정"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">하자보수 비용</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        {contract.custom_maintenance ? `${formatCurrency(contract.custom_maintenance)} (부가세별도)` : "미정"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">총 계약금액</td>
                      <td className="border border-gray-300 px-4 py-1.5 font-semibold text-red-600" colSpan={3}>
                        {contract?.custom_fee && contract.custom_maintenance
                          ? `${formatCurrency(contract.custom_fee + contract.custom_maintenance)} (부가세별도)`
                          : "미정"}
                      </td>
                    </tr>

                    {/* 계약 대금 지급방법 */}
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-100 font-bold text-center" colSpan={4}>
                        계약 대금 지급방법
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">구분</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">금액 (부가세별도)</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">비율</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">지급 조건</td>
                    </tr>
                    {(() => {
                      const payments = calculatePayments(contract);
                      return (
                        <>
                          <tr>
                            <td className="border border-gray-300 px-4 py-1.5 text-center font-medium">개발 계약 선금</td>
                            <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">{formatCurrency(payments.downPaymentAmount)}</td>
                            <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">{payments.downPaymentRate}%</td>
                            <td className="border border-gray-300 px-4 py-1.5 text-center">
                              {contract.start_date ? dayjs(contract.start_date).format("YYYY년 M월 D일") : "계약 체결일"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-1.5 text-center font-medium">개발 계약 잔금</td>
                            <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">{formatCurrency(payments.balanceAmount)}</td>
                            <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">{payments.balanceRate}%</td>
                            <td className="border border-gray-300 px-4 py-1.5 text-center">
                              {contract.end_date ? dayjs(contract.end_date).format("YYYY년 M월 D일") : "프로젝트 완료일"}
                            </td>
                          </tr>
                        </>
                      );
                    })()}

                    {/* 기타 조건 */}
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-100 font-bold text-center" colSpan={4}>
                        기타 조건
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">지체상금</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        1/1000 (단, 상호 사전 합의하여 변경할 수 있다.)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">계약이행보증금</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        해당없음
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">계약이행보증보험</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        해당없음
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-50 font-semibold text-center">입금계좌</td>
                      <td className="border border-gray-300 px-4 py-1.5" colSpan={3}>
                        전자 결제를 사용해주세요.
                      </td>
                    </tr>

                    {/* 통지연락처 */}
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-100 font-bold text-center" colSpan={4}>
                        통지연락처
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold"></td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold">펠로우즈 (갑)</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                        계약자 (을)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold bg-gray-50">이메일</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center">sales@iihus.com</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center" colSpan={2}>
                        sales@iihus.com
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold bg-gray-50">담당자</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center">김동현</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center" colSpan={2}>
                        계약자
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold bg-gray-50">전화번호</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center">010-1234-5678</td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center" colSpan={2}>
                        010-1234-5678
                      </td>
                    </tr>

                    {/* 특약사항 */}
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-100 font-bold text-center" colSpan={4}>
                        특약사항
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 text-gray-500" colSpan={4}>
                        {contract?.contract_terms ? <>{parse(contract?.contract_terms)}</> : "별도 특약사항 없음"}
                      </td>
                    </tr>

                    {/* 서명란 */}
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 bg-gray-100 font-bold text-center" colSpan={4}>
                        서명란
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                        갑 (발주방)
                      </td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                        을 (수주방)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5 text-center" colSpan={2}></td>
                      <td className="border border-gray-300 px-4 py-1.5 text-center" colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* 계약 상태 */}
              {contract?.status && (
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    계약 상태: <span className="font-semibold">{contract.status}</span>
                  </p>
                  {contract.is_signed === 1 && <p className="text-sm text-green-700 mt-1">✓ 서명 완료</p>}
                </div>
              )}
            </div>
          </div>
          <SheetDescription className="sr-only" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
