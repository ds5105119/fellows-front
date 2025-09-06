"use client";

import { useMemo } from "react";
import { useProjectOverView } from "@/hooks/fetch/project";
import { cn } from "@/lib/utils";
import { useContracts } from "@/hooks/fetch/contract";
import dayjs from "@/lib/dayjs";
import { useUsers } from "@/hooks/fetch/user";
import { Session } from "next-auth";
import { FileCheck } from "lucide-react";

export function ContractOverview({ session }: { session: Session }) {
  const projectOverviewSwr = useProjectOverView();
  const contractsSwr = useContracts({ docstatus: 0 }, { initialSize: 5 });

  const projects = useMemo(() => projectOverviewSwr.data?.items ?? [], [projectOverviewSwr.data]);
  const contracts = useMemo(
    () => contractsSwr.data?.flatMap((page) => page.items).filter((contract) => contract.party_name === session.sub) ?? [],
    [contractsSwr.data]
  );

  const partyNames = useMemo(() => contracts.map((c) => c.party_name).filter((name): name is string => Boolean(name)), [contracts]);
  const uniquePartyNames = useMemo(() => Array.from(new Set(partyNames)), [partyNames]);
  const customersSwr = useUsers(uniquePartyNames);

  const customers = useMemo(
    () => partyNames.map((name) => (customersSwr.data ?? [])[uniquePartyNames.indexOf(name)]),
    [partyNames, uniquePartyNames, customersSwr.data]
  );
  return (
    <div className="w-full md:h-fit flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
      <div className="w-full h-fit md:h-full flex flex-col">
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
                프로젝트
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                계약자
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
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {contracts.map((contract, idx) => (
              <tr
                key={contract.name}
                className="hover:bg-gray-100/80 transition-colors even:bg-gray-100/40 cursor-pointer"
                onClick={() => console.log(contract)}
              >
                <td className="px-5 py-3 text-gray-900 font-medium">{contract.custom_name || "계약서"}</td>
                <td className="px-5 text-gray-700 text-xs font-medium">
                  <div
                    className={cn(
                      "flex items-center justify-center px-1.5 py-0.5 rounded-sm border h-fit w-fit",
                      contract.docstatus === 0
                        ? contract.is_signed
                          ? "bg-blue-50 border-blue-300 text-blue-500"
                          : "bg-zinc-50 border-zinc-300 text-zinc-500"
                        : contract.docstatus === 1 && contract.is_signed
                        ? "bg-emerald-50 border-emerald-300 text-emerald-500"
                        : contract.docstatus === 2
                        ? "bg-red-50 border-red-300 text-red-500"
                        : "bg-red-50 border-red-300 text-red-500"
                    )}
                  >
                    {contract.docstatus === 0
                      ? contract.is_signed
                        ? "결제 대기"
                        : "사인 전"
                      : contract.docstatus === 1 && contract.is_signed
                      ? "진행 중"
                      : contract.docstatus === 2
                      ? "취소됨"
                      : "취소됨"}
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {projects.find((project) => project.project_name == contract.document_name)?.custom_project_title ?? "프로젝트를 찾을 수 없음"}
                </td>
                <td className="px-5 py-3 text-gray-700">{customers[idx]?.name}</td>
                <td className="px-5 py-3 text-gray-700">{!contract.custom_subscribe ? `회차 정산형` : `정기 결제형`}</td>
                <td className="px-5 py-3 text-gray-700">
                  {!contract.custom_subscribe ? `${contract.custom_fee?.toLocaleString()} 원` : `${contract.custom_maintenance?.toLocaleString()}원 / 월`}
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {dayjs(contract.start_date).format("YYYY.MM.DD")} {contract.end_date && dayjs(contract.end_date).format("~ YYYY.MM.DD")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contracts.length === 0 && (
          <div className="flex flex-col w-full pt-2">
            <div className="h-44 flex flex-col justify-center space-y-4 items-center w-full rounded-lg bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-50 px-8 mb-1 text-sm select-none">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm">
                <FileCheck className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-gray-700">결제해야 하는 계약서가 없습니다</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
