"use client";
import { useState, useRef, useEffect } from "react";
import type { UserERPNextProject } from "@/@types/service/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, PenIcon, XIcon, Download, FileText } from "lucide-react";
import type { Session } from "next-auth";
import type { SWRResponse } from "swr";
import { updateContracts, useContracts } from "@/hooks/fetch/contract";
import dayjs from "@/lib/dayjs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { UserERPNextContract } from "@/@types/service/contract";
import parse from "html-react-parser";
import Link from "next/link";
import SelectLogo from "@/components/resource/selectlogo";
import SignatureCanvas from "react-signature-canvas";
import Image from "next/image";

export function ContractList({ projectSwr, session }: { projectSwr: SWRResponse<UserERPNextProject>; session: Session }) {
  const { data: project } = projectSwr;
  const project_id = project?.project_name ?? "";
  const { data: contractsSwr, isLoading } = useContracts({ project_id });
  const contracts = contractsSwr?.flatMap((page) => page.items) ?? [];
  const [contract, setContract] = useState<UserERPNextContract | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [sign, setSign] = useState<string>("");

  const sigCanvas = useRef<SignatureCanvas | null>(null);

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

  useEffect(() => {
    setSign(contract?.custom_customer_sign ?? "");
  }, [contract]);

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
                }}
                asChild
              >
                <Link href={`/service/project/${project_id}/payment/contract/${contract.name}`}>결제하기</Link>
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
          <div className="h-44 flex flex-col justify-center space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#e6eaff] via-[#dae6ff] to-[#e6eaff] px-8 mb-1 text-sm select-none">
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
            <div className="text-sm font-medium text-muted-foreground">프로젝트 계약이 진행되면 이곳에서 계약을 처리할 수 있어요.</div>
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
            <div className="p-5 md:p-8 flex flex-col gap-5">
              <div className="flex flex-col">
                <SelectLogo />
                <div className="text-2xl md:text-4xl font-extrabold mt-2">{contract?.custom_name}</div>
                <div className="mt-3">
                  <span className="text-sm font-bold">계약번호. </span>
                  <span className="text-sm font-medium">{contract?.name}</span>
                </div>
                <div className="mt-1">
                  <span className="text-sm font-bold">계약상태. </span>
                  <span className="text-sm font-medium">
                    {contract?.status === "Unsigned" ? "서명 전" : contract?.status === "Inactive" ? "처리 전" : "진행 중"}
                  </span>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 w-full md:justify-between mb-1 md:mb-0">
                <div className="relative flex md:w-1/2 flex-col space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">공급자</div>
                  <div className="text-base font-bold text-black">Fellows</div>
                  <div className="text-xs font-semibold text-muted-foreground">회사명: IIH</div>
                  <div className="text-xs font-semibold text-muted-foreground">주소: 서울특별시 강남구 역삼동 123-456</div>
                  <div className="text-xs font-semibold text-muted-foreground">대표자: 김동현</div>
                </div>
                <hr className="block md:hidden border-gray-200" />
                <div className="flex md:w-1/2 flex-col space-y-2 mt-1 md:mt-0">
                  <div className="text-xs font-semibold text-muted-foreground">수신자</div>
                  <div className="text-base font-bold text-black">{session.user.name}</div>
                  <div className="text-xs font-semibold text-muted-foreground">이메일: {session.user.email}</div>
                  <div className="text-xs font-semibold text-muted-foreground">
                    주소: {session.user.address.street_address + " " + session.user.address.sub_locality}
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* 통합 테이블 */}
              {contract && (
                <table className="w-full border-collapse border border-gray-300 text-sm" style={{ tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                  </colgroup>
                  <tbody>
                    {/* 계약 주요 사항 - 2칸 (1/4, 3/4) */}
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        계약명
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        {contract?.custom_name || "프로젝트 개발"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        계약 기간
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        {contract?.start_date && contract?.end_date
                          ? `${dayjs(contract.start_date).format("YYYY년 M월 D일")} - ${dayjs(contract.end_date).format("YYYY년 M월 D일")}`
                          : "미정"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        하자보수기간
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        {contract?.custom_maintenance_start_date && contract?.custom_maintenance_end_date
                          ? `${dayjs(contract.custom_maintenance_start_date).format("YYYY년 M월 D일")} - ${dayjs(contract.custom_maintenance_end_date).format(
                              "YYYY년 M월 D일"
                            )}`
                          : "본 계약이 종료된 날부터 영업일 기준 10일"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        개발 비용
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        {contract?.custom_fee ? `${formatCurrency(contract.custom_fee)} (부가세별도)` : "미정"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        하자보수 비용
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        월 {contract.custom_maintenance ? `${formatCurrency(contract.custom_maintenance)} (부가세별도)` : "미정"}
                      </td>
                    </tr>

                    {/* 계약 대금 지급방법 헤더 - 4칸 (각각 25%) */}
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                        구분
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                        금액 (부가세별도)
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                        비율
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                        지급 조건
                      </td>
                    </tr>
                    {(() => {
                      const payments = calculatePayments(contract);
                      return (
                        <>
                          <tr>
                            <td className="border border-gray-200 px-4 py-1.5 text-center font-medium" colSpan={2}>
                              개발 계약 선금
                            </td>
                            <td className="border border-gray-200 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                              {formatCurrency(payments.downPaymentAmount)}
                            </td>
                            <td className="border border-gray-200 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                              {payments.downPaymentRate}%
                            </td>
                            <td className="border border-gray-200 px-4 py-1.5 text-center" colSpan={2}>
                              {contract.start_date ? dayjs(contract.start_date).format("YYYY년 M월 D일") : "계약 체결일"}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-200 px-4 py-1.5 text-center font-medium" colSpan={2}>
                              개발 계약 잔금
                            </td>
                            <td className="border border-gray-200 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                              {formatCurrency(payments.balanceAmount)}
                            </td>
                            <td className="border border-gray-200 px-4 py-1.5 text-center font-semibold" colSpan={2}>
                              {payments.balanceRate}%
                            </td>
                            <td className="border border-gray-200 px-4 py-1.5 text-center" colSpan={2}>
                              {contract.end_date ? dayjs(contract.end_date).format("YYYY년 M월 D일") : "프로젝트 완료일"}
                            </td>
                          </tr>
                        </>
                      );
                    })()}

                    {/* 기타 조건 - 2칸 (1/4, 3/4) */}
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        지체상금
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        1/1000 (단, 상호 사전 합의하여 변경할 수 있다.)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        계약이행보증금
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        해당없음
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        계약이행보증보험
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        해당없음
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        입금계좌
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5" colSpan={6}>
                        전자 결제를 사용해주세요.
                      </td>
                    </tr>

                    {/* 특약사항 - 1칸 (전체 너비) */}
                    <tr>
                      <td className="border border-gray-200 px-4 py-1.5 bg-gray-50 font-semibold text-center" colSpan={2}>
                        특약사항
                      </td>
                      <td className="border border-gray-200 px-4 py-1.5 text-gray-500" colSpan={6}>
                        {contract?.contract_terms ? <>{parse(contract?.contract_terms)}</> : "별도 특약사항 없음"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              <hr className="border-gray-200" />

              <div className="flex flex-col space-y-3">
                <div className="text-xs font-semibold text-muted-foreground">
                  <div className="text-base font-bold text-foreground mb-1">제1조 (목적)</div>본 계약은 수신자가 제시한 과업지시서를 공급자가 원활히 수행되도록
                  제반 사항을 규정하는데 그 목적이 있다.
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  <div className="text-base font-bold text-foreground mb-1">제2조 (사업수행)</div>
                  공급자는 본 용역을 별첨의 과업지시서에 따라 위의 계약금액 한도 내에서 수행한다.
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  <div className="text-base font-bold text-foreground mb-1">제3조 (대금 지불)</div>① 수신자는 공급자의 청구에 의하여 계약서의 내용과 같이
                  공급자가 부담키로 한 사업비를 지급한다. 다만, 제7조에 따라 계약이 해약되었을 경우에는 이를 변경할 수 있다.
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  <div className="text-base font-bold text-foreground mb-1">제4조 (계약의 변경)</div>① 공급자와 수신자는 상호 동의 없이 본 계약서 제1조에 의한
                  과업지시서의 내용 및 기타 계약사항을 변경하지 못한다.
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  <div className="text-base font-bold text-foreground mb-1">제5조 (기간연장 및 지체상금)</div>① 공급자가 본 계약서에서 정한 기간 내에 용역을
                  완수하기 어려울 경우, 계약 종료 10일전까지 사유서를 첨부하여 수신자에게 제출하고 계약기간 연장을 요청할 수 있으며, 수신자는 사업수행에 지장이
                  없는 범위 내에서 계약기간의 연장을 승인하여야 한다.
                  <br />② 수신자가 계약기간 연장을 승인하지 아니하는 경우에는 수신자는 지체일수 1일에 대하여 계약금액의 1000분의 1에 해당하는 지체상금을
                  제3조에서 정한 대금에서 공제하고 이를 초과하는 지체상금은 공제되지 아니한다. 다만, 천재지변 기타 이에 준하는 불가항력적인 경우 및 공급자의
                  책임 없는 사유로 인하여 지연된 경우에는 지체상금의 일부 또는 전부를 면제할 수 있다.
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  <div className="text-base font-bold text-foreground mb-1">제6조 (계약의 해약)</div>
                  ①수신자는 다음 각 항의 경우에는 본 계약을 해약할 수 있다. 1. 공급자가 계약조항을 위배했을 때 2. 공급자의 태만으로 소정의 기일 내에 용역을
                  완성할 가망이 없다고 판단되었을 때 3. 수신자의 특별한 사유로 이 용역의 전부 또는 일부를 취소하여야 할 사유가 발생하였을 때.
                  <br />② 공급자는 해약된 날로부터 10일 이내에 기수령한 금액을 을에게 반환하여야 한다. 단, 제 1항 제3호의 사유로 해약될 경우에 공급자는 해약된
                  날로부터 10일 이내에 정산서 및 작업물을 제출한 뒤 소모된 대금을 제외한 부분에 대해서만 정산한다.
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  <div className="text-base font-bold text-foreground mb-1">제7조 (용역결과의 귀속)</div>이 용역의 결과물은 수신자의 소유로 하며, 용역완료와
                  동시에 수신자에게 제출하여야 한다.
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  <div className="text-base font-bold text-foreground mb-1">참고사항</div>
                  {contract?.custom_name} 와(과) 공급자 Fellows는 붙임에 의하여 위에 대한 계약을 체결하고 신의에 따라 성실히 계약상의 의무를 이행할 것을
                  확약하며 본 계약을 증명하기 위해 계약서 2부를 작성 기명 날인하여 {contract?.custom_name} 와(과) 공급자가 각각 1부씩 보관한다.
                </div>
              </div>

              <div className="flex w-full justify-end text-sm font-bold">{dayjs(contract?.modified).format("LL")}</div>

              <div className="w-full flex flex-col mt-5 space-y-6">
                <div className="text-sm font-bold">
                  <span className="font-normal">공급자</span>&nbsp;&nbsp;&nbsp;&nbsp;IIH, Fellows℠&nbsp;&nbsp;&nbsp;&nbsp;대표 김 동
                  현&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="relative font-medium text-muted-foreground">
                    (인)
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                      <Image
                        src="/fellows/stamp.png"
                        alt="Fellows Stamp"
                        width={50}
                        height={50}
                        className="shrink-0"
                        unoptimized
                        style={{ maxWidth: "none" }}
                      />
                    </div>
                  </span>
                </div>

                <div className="text-sm font-bold">
                  <span className="font-normal">수신자</span>&nbsp;&nbsp;&nbsp;&nbsp;{session.user.name}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="relative font-medium text-muted-foreground">
                    (서명)
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                      {sign && <Image src={sign} alt="Fellows Stamp" width={100} height={100} className="shrink-0" unoptimized style={{ maxWidth: "none" }} />}
                    </div>
                  </span>
                </div>
              </div>

              <div className="w-fuil flex flex-col items-center space-y-2 mt-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-blue-500 hover:bg-blue-400 w-1/2 rounded-sm text-background flex items-center justify-center text-sm py-2 font-medium">
                      {sign ? "다시 서명하기" : "서명하기"}
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    showCloseButton={false}
                    className="drop-shadow-white/10 drop-shadow-2xl p-0 overflow-y-auto scrollbar-hide focus-visible:ring-0"
                  >
                    <DialogHeader className="sr-only">
                      <DialogTitle className="sr-only">기능 선택 창</DialogTitle>
                      <DialogDescription className="sr-only" />
                    </DialogHeader>
                    <div className="flex flex-col w-full">
                      <div className="border-b px-4 py-2 flex justify-between items-center">
                        <div className="text-sm font-bold">서명 입력하기</div>
                        <DialogClose asChild>
                          <Button variant="ghost" size="icon">
                            <XIcon />
                          </Button>
                        </DialogClose>
                      </div>
                      <div className="w-full flex flex-col space-y-3 relative px-6 py-4 md:px-12 md:py-8">
                        <div className="relative w-full">
                          <SignatureCanvas
                            ref={sigCanvas}
                            canvasProps={{
                              className: "signature-canvas rounded-sm border-2 border-zinc-300 w-full h-44 md:h-56 border-dashed bg-zinc-200/50",
                            }}
                            clearOnResize={false}
                            velocityFilterWeight={1}
                            maxWidth={3.5}
                            onBegin={() => {
                              setIsSigned(true);
                            }}
                          />
                          {!isSigned && (
                            <div className="absolute inset-0 -z-10 flex items-center justify-center text-sm text-zinc-500">
                              <span>서명을 입력하세요.</span>
                            </div>
                          )}
                        </div>
                        <div className="w-full flex justify-end">
                          <button
                            className="bg-zinc-100 border-[1.5px] border-zinc-300 hover:bg-zinc-200 rounded-full w-fit text-muted-foreground flex items-center justify-center text-sm py-1 px-3 font-medium"
                            onClick={() => {
                              sigCanvas.current?.clear();
                              setIsSigned(false);
                            }}
                          >
                            전체 지우기
                          </button>
                        </div>
                        <div className="w-full flex justify-center mt-4">
                          <DialogClose asChild>
                            <button
                              disabled={!isSigned}
                              className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 rounded-sm w-fit text-background flex items-center justify-center text-sm py-2 px-4 font-medium"
                              onClick={async () => {
                                if (isSigned && contract) {
                                  setSign(sigCanvas.current?.toDataURL() ?? "");
                                  await updateContracts(contract.name, { is_signed: true, custom_customer_sign: sigCanvas.current?.toDataURL() ?? "" });
                                  sigCanvas.current?.clear();
                                  setIsSigned(false);
                                }
                              }}
                            >
                              서명하기
                            </button>
                          </DialogClose>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <SheetDescription className="sr-only" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
