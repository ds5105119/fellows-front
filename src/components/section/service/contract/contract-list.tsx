"use client";
import { useCallback } from "react";
import { Download, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "@/lib/dayjs";
import generatePDF, { Margin } from "react-to-pdf";
import type { UserERPNextContract } from "@/@types/service/contract";
import { SWRInfiniteResponse } from "swr/infinite";

interface ContractListProps {
  contractsSwr: SWRInfiniteResponse<{ items: UserERPNextContract[] }>;
  selectedContract?: UserERPNextContract;
  onContractSelect: (contract: UserERPNextContract) => void;
}

export function ContractList({ contractsSwr, selectedContract, onContractSelect }: ContractListProps) {
  const contracts = contractsSwr.data?.flatMap((page) => page.items) ?? [];
  const isReachedEnd = contractsSwr.data && contractsSwr.data.length > 0 && contractsSwr.data[contractsSwr.data.length - 1].items.length === 0;
  const isLoading =
    !isReachedEnd &&
    (contractsSwr.isLoading || (contractsSwr.data && contractsSwr.size > 0 && typeof contractsSwr.data[contractsSwr.size - 1] === "undefined"));

  const handleContractClick = useCallback(
    (contract: UserERPNextContract) => {
      onContractSelect(contract);
    },
    [onContractSelect]
  );

  const downloadContractPDF = useCallback(
    (contract: UserERPNextContract) => {
      if (!selectedContract || selectedContract.name !== contract.name) {
        onContractSelect(contract);
      }

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
    <div className="grid grid-cols-1 gap-3">
      <div className="text-sm font-bold">계약서: {contracts.length}건</div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-blue-200/60 backdrop-blur supports-[backdrop-filter]:bg-blue-200/60">
            <tr className="border-b border-black/5 text-xs font-semibold tracking-wide text-blue-600 uppercase">
              <th scope="col" className="px-5 py-3 text-left">
                이름
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                계약 상태
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                결제 방식
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                합계
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                일정
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                수정일
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                PDF
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {contracts.map((contract) => (
              <tr
                key={contract.name}
                className="hover:bg-gray-100/80 transition-colors even:bg-gray-100/40 cursor-pointer"
                onClick={() => handleContractClick(contract)}
              >
                <td className="px-5 py-3 text-gray-900 font-medium">{contract.custom_name || "계약서"}</td>
                <td className="px-5 text-gray-700 text-xs font-medium">
                  <div
                    className={cn(
                      "flex items-center justify-center px-1.5 py-0.5 rounded-sm border h-fit w-fit",
                      contract.status === "Unsigned"
                        ? "bg-zinc-50 border-zinc-300 text-zinc-500"
                        : contract.status === "Active" && contract.docstatus == 1
                        ? "bg-emerald-50 border-emerald-300 text-emerald-500"
                        : contract.docstatus === 2
                        ? "bg-red-50 border-red-300 text-red-500"
                        : "bg-blue-50 border-blue-300 text-blue-500"
                    )}
                  >
                    {contract.status === "Unsigned"
                      ? "사인 전"
                      : contract.status === "Active" && contract.docstatus == 1
                      ? "결제 전"
                      : contract.docstatus === 2
                      ? "계약 취소"
                      : "결제 완료"}
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-700">{!contract.custom_subscribe ? `회차 정산형` : `정기 결제형`}</td>
                <td className="px-5 py-3 text-gray-700">
                  {!contract.custom_subscribe ? `${contract.custom_fee?.toLocaleString()} 원` : `${contract.custom_maintenance?.toLocaleString()}원 / 월`}
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {dayjs(contract.start_date).format("YYYY.MM.DD")} {contract.end_date && dayjs(contract.end_date).format("~ YYYY.MM.DD")}
                </td>
                <td className="px-5 py-3 text-gray-700">{dayjs(contract.modified).format("YYYY.MM.DD")}</td>
                <td className="px-5 py-3 text-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold h-6 px-2 shadow-none bg-transparent grow hover:bg-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      downloadContractPDF(contract);
                    }}
                  >
                    <Download className="size-3" />
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
