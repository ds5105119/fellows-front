"use client";

import { useCallback, useEffect, useRef } from "react";
import type { UserERPNextProject } from "@/@types/service/project";
import { Info, Download, FileCheck, Loader2 } from "lucide-react";
import type { SWRResponse } from "swr";
import { useContracts } from "@/hooks/fetch/contract";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import dayjs from "@/lib/dayjs";
import generatePDF, { Margin } from "react-to-pdf";
import type { UserERPNextContract } from "@/@types/service/contract";
import { useProjectCustomer } from "@/hooks/fetch/project";
import { Session } from "next-auth";

interface ContractListProps {
  projectSwr: SWRResponse<UserERPNextProject>;
  selectedContract?: UserERPNextContract;
  onContractSelect: (contract: UserERPNextContract) => void;
  initialContractName?: string;
  session: Session;
}

export function ContractList({ projectSwr, selectedContract, onContractSelect, initialContractName, session }: ContractListProps) {
  const { data: project } = projectSwr;
  const project_id = project?.project_name ?? "";
  const { data: contractsSwr, isLoading } = useContracts({ project_id });
  const contracts = contractsSwr?.flatMap((page) => page.items) ?? [];
  const hasAutoSelected = useRef(false);
  const customerSwr = useProjectCustomer(project?.project_name ?? null);
  const customer = customerSwr.data;

  useEffect(() => {
    if (initialContractName && contracts.length > 0 && !hasAutoSelected.current && !selectedContract) {
      const foundContract = contracts.find((c) => c.name === initialContractName);
      if (foundContract) {
        onContractSelect(foundContract);
        hasAutoSelected.current = true;
      }
    }
  }, [initialContractName, contracts, selectedContract, onContractSelect]);

  const handleContractClick = useCallback(
    (contract: UserERPNextContract) => {
      onContractSelect(contract);
    },
    [onContractSelect]
  );

  const downloadContractPDF = useCallback(
    (contract: UserERPNextContract) => {
      // 선택된 계약서가 아니면 먼저 선택
      if (!selectedContract || selectedContract.name !== contract.name) {
        onContractSelect(contract);
      }

      // PDF 다운로드 실행
      setTimeout(() => {
        const targetElement = document.querySelector("[data-pdf-target]") as HTMLElement;
        if (targetElement) {
          generatePDF(() => targetElement, {
            method: "save",
            filename: `${contract.custom_name} - ${dayjs(contract.modified).format("YYYY-MM-DD")}`,
            resolution: 5,
            page: { margin: Margin.MEDIUM },
          });
        }
      }, 500);
    },
    [selectedContract, onContractSelect]
  );

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-6">
      <div className="text-sm font-bold">계약서: {contracts.length}건</div>
      <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 mb-1 text-sm">
        <Info className="!size-4" />
        <p>프로젝트 계약서를 한 곳에서 관리할 수 있어요.</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">계약서를 불러오는 중</p>
            </div>
          </div>
        </div>
      )}

      <section className="space-y-3">
        {contracts.map((contract) => (
          <div
            key={contract.name}
            className={cn("group p-4 rounded-md border border-sidebar-border hover:shadow-sm transition-all duration-200 cursor-pointer")}
            onClick={() => handleContractClick(contract)}
          >
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {contract.status === "Unsigned"
                  ? "사인 전"
                  : contract.status === "Active" && contract.docstatus == 1
                  ? "결제 전"
                  : contract.docstatus === 2
                  ? "계약 취소"
                  : "결제 완료"}
              </h3>
              <h3 className="text-sm font-medium text-gray-900 transition-colors pt-2 pb-1">
                {contract.custom_name || "계약서"} - {!contract.custom_subscribe ? `회차 정산형` : `정기 결제형`}
              </h3>
            </div>

            <div className="flex space-x-1.5 pb-3">
              <div className="flex font-bold items-center space-x-1 text-sm">
                {!contract.custom_subscribe ? `${contract.custom_fee?.toLocaleString()} 원` : `${contract.custom_maintenance?.toLocaleString()}원 / 월`}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                {dayjs(contract.start_date).format("YYYY.MM.DD")} {contract.end_date && dayjs(contract.end_date).format("~ YYYY.MM.DD")}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              {contract.status === "Unsigned" && contract.docstatus !== 2 && customer?.email == session.user.email && (
                <Button
                  size="sm"
                  className="text-sm font-bold h-8 px-3 shadow-none bg-blue-400 w-2/3"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  asChild
                >
                  <Link href={`/service/project/${project_id}/contracts/${contract.name}`}>사인하기</Link>
                </Button>
              )}
              {contract.status === "Active" && contract.docstatus == 1 && customer?.email == session.user.email && (
                <Button
                  size="sm"
                  className="text-sm font-bold h-8 px-3 shadow-none bg-emerald-400 hover:bg-emerald-500 w-2/3"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  asChild
                >
                  <Link href={`/service/project/${project_id}/payment/contract/${contract.name}`}>결제하기</Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-bold h-8 px-3 shadow-none bg-transparent grow"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  downloadContractPDF(contract);
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        ))}
      </section>

      {contracts.length === 0 && !isLoading && (
        <div className="flex flex-col w-full">
          <div className="h-44 flex flex-col justify-center space-y-4 items-center w-full rounded-lg bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-50 px-8 mb-1 text-sm select-none">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm">
              <FileCheck className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-gray-700">아직 계약서가 없습니다</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
            <div className="text-base font-semibold">계약서 관리</div>
            <div className="text-sm font-medium text-muted-foreground">프로젝트 계약이 진행되면 이곳에서 계약을 처리할 수 있어요.</div>
          </div>
        </div>
      )}
    </div>
  );
}
