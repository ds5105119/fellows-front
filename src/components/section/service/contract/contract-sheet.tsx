"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { XIcon, Download } from "lucide-react";
import type { Session } from "next-auth";
import { updateContracts } from "@/hooks/fetch/contract";
import dayjs from "@/lib/dayjs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { UserERPNextContract } from "@/@types/service/contract";
import parse from "html-react-parser";
import SelectLogo from "@/components/resource/selectlogo";
import SignatureCanvas from "react-signature-canvas";
import Image from "next/image";
import generatePDF, { Margin } from "react-to-pdf";
import { cn } from "@/lib/utils";
import { useProjectCustomer } from "@/hooks/fetch/project";
import { toast } from "sonner";

interface ContractSheetProps {
  contract: UserERPNextContract | undefined;
  session: Session;
  setOpenSheet: (open: boolean) => void;
}

export function ContractSheet({ contract, session, setOpenSheet }: ContractSheetProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [sign, setSign] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [signDialogOpen, setSignDialogOpen] = useState<boolean>(false);

  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const customerSwr = useProjectCustomer(contract?.document_name ?? null);
  const customer = customerSwr.data;

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
    return new Intl.NumberFormat().format(amount) + "원";
  };

  const downloadPDF = useCallback(() => {
    generatePDF(targetRef, {
      method: "save",
      filename: `${contract?.custom_name} - ${dayjs(contract?.modified).format("YYYY-MM-DD")}`,
      resolution: 5,
      page: { margin: Margin.MEDIUM },
    });
  }, [contract?.custom_name, contract?.modified]);

  const handleSignature = async () => {
    if (isSigned && contract && sigCanvas.current) {
      setIsSaving(true);
      try {
        const signatureData = sigCanvas.current.toDataURL();
        setSign(signatureData);

        await updateContracts(contract.name, {
          is_signed: true,
          signee_company: signatureData,
          signed_on: dayjs().utc().format("YYYY-MM-DD HH:mm:ss"),
        });

        setSignDialogOpen(false);
        sigCanvas.current.clear();
        setIsSigned(false);
      } catch {
        toast.message("사인을 저장하는데 실패했습니다.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  useEffect(() => {
    setSign(contract?.signee_company ?? "");
  }, [contract]);

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* 헤더 */}
      <div className="sticky top-0 shrink-0 flex flex-row-reverse md:flex-row items-center justify-between h-16 border-b border-gray-200 px-4 bg-background z-20">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-semibold rounded-sm border-gray-200 shadow-none bg-transparent" onClick={() => downloadPDF()}>
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

      {/* ... existing code for contract content ... */}
      <div className="p-5 md:p-8 flex flex-col gap-5" ref={targetRef} data-pdf-target>
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
              {contract?.docstatus === 0
                ? contract?.is_signed
                  ? "결제 대기"
                  : "사인 전"
                : contract?.docstatus === 1 && contract?.is_signed
                ? "진행 중"
                : contract?.docstatus === 2
                ? "취소됨"
                : "취소됨"}
            </span>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 w-full md:justify-between mb-1 md:mb-0">
            <div className="relative flex md:w-1/2 flex-col space-y-2">
              <div className="text-xs font-semibold text-muted-foreground">공급자</div>
              <div className="text-base font-bold text-black">Fellows</div>
              <div className="text-xs font-semibold text-muted-foreground">회사명: IIH</div>
              <div className="text-xs font-semibold text-muted-foreground">주소: 서울시 강남구 영동대로 602, 6층</div>
              <div className="text-xs font-semibold text-muted-foreground">대표자: 김동현</div>
            </div>
            <hr className="block md:hidden border-gray-200" />
            <div className="flex md:w-1/2 flex-col space-y-2 mt-1 md:mt-0">
              <div className="text-xs font-semibold text-muted-foreground">수신자</div>
              <div className="text-base font-bold text-black">{customer?.name}</div>
              <div className="text-xs font-semibold text-muted-foreground">이메일: {customer?.email}</div>
              <div className="text-xs font-semibold text-muted-foreground">전화번호: {customer?.phoneNumber ?? "전화번호 등록이 필요합니다."}</div>
              <div className="text-xs font-semibold text-muted-foreground">
                주소: {customer?.street && customer?.sub_locality ? customer?.street + " " + customer?.sub_locality : "주소 등록이 필요합니다."}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="w-full flex">
            <div className="flex flex-col w-1/2 space-y-2">
              <div className="text-sm font-semibold">계약 시작일</div>
              <div className="text-base font-bold">{contract?.start_date ? dayjs(contract.start_date).format("YYYY년 M월 D일") : "미정"}</div>
            </div>
            <div className="flex flex-col w-1/2 space-y-2">
              <div className="text-sm font-semibold">계약 종료일</div>
              <div className="text-base font-bold">{contract?.end_date ? dayjs(contract.end_date).format("YYYY년 M월 D일") : "미정"}</div>
            </div>
          </div>

          {contract?.custom_subscribe == false && (
            <>
              <div className="w-full flex">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-semibold">총 개발 비용</div>
                  <div className="text-base font-bold">
                    {contract?.custom_fee ? `${formatCurrency(contract.custom_fee)} ` : "미정"}
                    {contract?.custom_fee && (
                      <span className="text-sm font-medium text-muted-foreground">{`(부가세 포함 ${formatCurrency(contract.custom_fee * 1.1)})`}</span>
                    )}
                  </div>
                </div>
              </div>

              {(() => {
                const payments = calculatePayments(contract);

                return (
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 w-full md:justify-between mb-1 md:mb-0">
                    <div className="flex flex-col md:w-1/2 space-y-2">
                      <div className="text-sm font-semibold">개발 계약 선금</div>
                      <div className="text-base font-bold">
                        {formatCurrency(payments.downPaymentAmount)}{" "}
                        <span className="text-sm font-medium text-muted-foreground">{`(부가세 포함 ${formatCurrency(payments.downPaymentAmount * 1.1)}, ${
                          payments.downPaymentRate
                        }%)`}</span>
                      </div>
                      <div className="text-base font-bold">{contract.start_date ? dayjs(contract.start_date).format("YYYY년 M월 D일") : "계약 체결일"}</div>
                    </div>
                    <div className="flex flex-col md:w-1/2 space-y-2">
                      <div className="text-sm font-semibold">개발 계약 잔금</div>
                      <div className="text-base font-bold">
                        {formatCurrency(payments.balanceAmount)}{" "}
                        <span className="text-sm font-medium text-muted-foreground">{`(부가세 포함 ${formatCurrency(payments.balanceAmount * 1.1)} ${
                          payments.balanceRate
                        }%)`}</span>
                      </div>
                      <div className="text-base font-bold">{contract.end_date ? dayjs(contract.end_date).format("YYYY년 M월 D일") : "프로젝트 완료일"}</div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {contract?.custom_subscribe == true && (
            <div className="w-full flex">
              <div className="flex flex-col space-y-2">
                <div className="text-sm font-semibold">하자보수 비용</div>
                <div className="text-base font-bold">
                  월 {contract.custom_maintenance ? `${formatCurrency(contract.custom_maintenance)} (부가세별도)` : "미정"}
                </div>
              </div>
            </div>
          )}

          <div className="w-full flex">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-semibold">지체상금</div>
              <div className="text-base font-bold">1/1000 (단, 상호 사전 합의하여 변경할 수 있다.)</div>
            </div>
          </div>

          <div className="w-full flex">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-semibold">계약이행보증금</div>
              <div className="text-base font-bold">해당없음</div>
            </div>
          </div>

          <div className="w-full flex">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-semibold">계약이행보증보험</div>
              <div className="text-base font-bold">해당없음</div>
            </div>
          </div>

          <div className="w-full flex">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-semibold">특약사항</div>
              <div className="text-base font-bold"> {contract?.contract_terms ? <>{parse(contract?.contract_terms)}</> : "별도 특약사항 없음"}</div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="flex flex-col space-y-3">
          <div className="text-xs font-semibold text-muted-foreground">
            <div className="text-base font-bold text-foreground mb-1">제1조 (목적)</div>본 계약은 수신자가 제시한 과업지시서를 공급자가 원활히 수행되도록 제반
            사항을 규정하는데 그 목적이 있다.
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            <div className="text-base font-bold text-foreground mb-1">제2조 (사업수행)</div>
            공급자는 본 용역을 별첨의 과업지시서에 따라 위의 계약금액 한도 내에서 수행한다.
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            <div className="text-base font-bold text-foreground mb-1">제3조 (대금 지불)</div>① 수신자는 공급자의 청구에 의하여 계약서의 내용과 같이 공급자가
            부담키로 한 사업비를 지급한다. 다만, 제7조에 따라 계약이 해약되었을 경우에는 이를 변경할 수 있다.
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            <div className="text-base font-bold text-foreground mb-1">제4조 (계약의 변경)</div>① 공급자와 수신자는 상호 동의 없이 본 계약서 제1조에 의한
            과업지시서의 내용 및 기타 계약사항을 변경하지 못한다.
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            <div className="text-base font-bold text-foreground mb-1">제5조 (기간연장 및 지체상금)</div>① 공급자가 본 계약서에서 정한 기간 내에 용역을 완수하기
            어려울 경우, 계약 종료 10일전까지 사유서를 첨부하여 수신자에게 제출하고 계약기간 연장을 요청할 수 있으며, 수신자는 사업수행에 지장이 없는 범위
            내에서 계약기간의 연장을 승인하여야 한다.
            <br />② 수신자가 계약기간 연장을 승인하지 아니하는 경우에는 수신자는 지체일수 1일에 대하여 계약금액의 1000분의 1에 해당하는 지체상금을 제3조에서
            정한 대금에서 공제하고 이를 초과하는 지체상금은 공제되지 아니한다. 다만, 천재지변 기타 이에 준하는 불가항력적인 경우 및 공급자의 책임 없는 사유로
            인하여 지연된 경우에는 지체상금의 일부 또는 전부를 면제할 수 있다.
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            <div className="text-base font-bold text-foreground mb-1">제6조 (계약의 해약)</div>
            ①수신자는 다음 각 항의 경우에는 본 계약을 해약할 수 있다. 1. 공급자가 계약조항을 위배했을 때 2. 공급자의 태만으로 소정의 기일 내에 용역을 완성할
            가망이 없다고 판단되었을 때 3. 수신자의 특별한 사유로 이 용역의 전부 또는 일부를 취소하여야 할 사유가 발생하였을 때.
            <br />② 공급자는 해약된 날로부터 10일 이내에 기수령한 금액을 을에게 반환하여야 한다. 단, 제 1항 제3호의 사유로 해약될 경우에 공급자는 해약된
            날로부터 10일 이내에 정산서 및 작업물을 제출한 뒤 소모된 대금을 제외한 부분에 대해서만 정산한다.
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            <div className="text-base font-bold text-foreground mb-1">제7조 (용역결과의 귀속)</div>이 용역의 결과물은 수신자의 소유로 하며, 용역완료와 동시에
            수신자에게 제출하여야 한다.
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            <div className="text-base font-bold text-foreground mb-1">참고사항</div>
            {customer?.name} 와(과) 공급자 Fellows는 붙임에 의하여 위에 대한 계약을 체결하고 신의에 따라 성실히 계약상의 의무를 이행할 것을 확약하며 본 계약을
            증명하기 위해 계약서 2부를 작성 기명 날인하여 {customer?.name} 와(과) 공급자가 각각 1부씩 보관한다.
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
                <Image src="/fellows/stamp.png" alt="Fellows Stamp" width={50} height={50} className="shrink-0" unoptimized style={{ maxWidth: "none" }} />
              </div>
            </span>
          </div>

          <div className="text-sm font-bold">
            <span className="font-normal">수신자</span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.name}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="relative font-medium text-muted-foreground">
              (서명)
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                {sign && (
                  <Image
                    src={sign || "/placeholder.svg"}
                    alt="Fellows Stamp"
                    width={100}
                    height={100}
                    className="shrink-0"
                    unoptimized
                    style={{ maxWidth: "none" }}
                  />
                )}
              </div>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full sticky bottom-0 z-20 px-5 sm:px-8">
        <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />

        <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
          {contract?.docstatus === 0 && customer?.email == session.user.email && (
            <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
              <DialogTrigger asChild>
                {contract.is_signed ? (
                  <Button className={cn("flex-1 w-1/2 h-[3.5rem] rounded-2xl text-base md:text-lg font-semibold")} type="button" variant="secondary">
                    다시 서명하기
                  </Button>
                ) : (
                  <Button className={cn("flex-1 w-1/2 h-[3.5rem] rounded-2xl text-base md:text-lg font-semibold")} type="button">
                    서명하기
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="drop-shadow-white/10 drop-shadow-2xl p-0 overflow-y-auto scrollbar-hide focus-visible:ring-0">
                <DialogHeader className="sr-only">
                  <DialogTitle className="sr-only">기능 선택 창</DialogTitle>
                  <DialogDescription className="sr-only" />
                </DialogHeader>
                <div className="flex flex-col w-full">
                  <div className="border-b px-4 py-2 flex justify-between items-center">
                    <div className="text-sm font-bold">서명 입력하기</div>
                    <Button variant="ghost" size="icon" onClick={() => setSignDialogOpen(false)} disabled={isSaving}>
                      <XIcon />
                    </Button>
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
                        className="bg-zinc-100 border-[1.5px] border-zinc-300 hover:bg-zinc-200 rounded-full w-fit text-muted-foreground flex items-center justify-center text-sm py-1 px-3 font-medium disabled:opacity-50"
                        disabled={isSaving}
                        onClick={() => {
                          sigCanvas.current?.clear();
                          setIsSigned(false);
                        }}
                      >
                        전체 지우기
                      </button>
                    </div>
                    <div className="w-full flex justify-center mt-4">
                      <button
                        disabled={!isSigned || isSaving}
                        className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 rounded-sm w-fit text-background flex items-center justify-center text-sm py-2 px-4 font-medium min-w-[80px]"
                        onClick={handleSignature}
                      >
                        {isSaving ? "서명 중..." : "서명하기"}
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {contract?.docstatus === 0 && contract.is_signed && customer?.email == session.user.email && (
            <Button type="button" className="flex-1 w-1/2 h-[3.5rem] rounded-2xl text-base md:text-lg font-semibold">
              결제하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
