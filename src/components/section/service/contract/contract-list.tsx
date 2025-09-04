"use client";
import { useCallback, useMemo } from "react";
import { Download, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "@/lib/dayjs";
import generatePDF, { Margin } from "react-to-pdf";
import type { UserERPNextContract } from "@/@types/service/contract";
import type { SWRInfiniteResponse } from "swr/infinite";
import { useUsers } from "@/hooks/fetch/user";
import { useProjectOverView } from "@/hooks/fetch/project";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { ProjectAdminUserAttributes } from "@/@types/accounts/userdata";
import { OverviewERPNextProject } from "@/@types/service/project";

interface ContractListProps {
  contractsSwr: SWRInfiniteResponse<{ items: UserERPNextContract[] }>;
  selectedContract?: UserERPNextContract;
  onContractSelect: (contract: UserERPNextContract) => void;
}

type Contract = {
  name: string;
  custom_name: string;
  docstatus: number;
  is_signed: boolean;
  custom_subscribe: boolean;
  custom_fee: number;
  custom_maintenance: number;
  modified: Date;
  start_date: string;
  end_date: string;
  customer: ProjectAdminUserAttributes;
  project?: OverviewERPNextProject;
};

const columnHelper = createColumnHelper<Contract>();

export function ContractList({ contractsSwr, selectedContract, onContractSelect }: ContractListProps) {
  const contracts = contractsSwr.data?.flatMap((page) => page.items) ?? [];
  const isReachedEnd = contractsSwr.data && contractsSwr.data.length > 0 && contractsSwr.data[contractsSwr.data.length - 1].items.length === 0;
  const isLoading =
    !isReachedEnd &&
    (contractsSwr.isLoading || (contractsSwr.data && contractsSwr.size > 0 && typeof contractsSwr.data[contractsSwr.size - 1] === "undefined"));

  const partyNames = contracts.map((c) => c.party_name).filter((name): name is string => Boolean(name));
  const uniquePartyNames = Array.from(new Set(partyNames));
  const customersSwr = useUsers(uniquePartyNames);
  const customers = partyNames.map((name) => (customersSwr.data ?? [])[uniquePartyNames.indexOf(name)]);

  const projectOverviewSwr = useProjectOverView();
  const projects = projectOverviewSwr.data?.items ?? [];

  const handleContractClick = (clickedContract: Contract) => {
    if (clickedContract.name === selectedContract?.name) return;

    const selected = contracts.find((c) => c.name === clickedContract.name);
    if (!selected) return;

    onContractSelect(selected);
  };

  const downloadContractPDF = useCallback(
    (contractName: string, custom_name: string, modified: Date) => {
      if (!selectedContract || selectedContract.name !== contractName) {
        const selected = contracts.find((contract) => contract.name == contractName);

        if (selected) {
          onContractSelect(selected);
        } else {
          return;
        }
      }

      setTimeout(() => {
        const targetElement = document.querySelector("[data-pdf-target]") as HTMLElement;
        if (targetElement) {
          generatePDF(() => targetElement, {
            method: "save",
            filename: `${custom_name} - ${dayjs(modified).format("YYYY-MM-DD")}`,
            resolution: 5,
            page: { margin: Margin.MEDIUM },
          });
        }
      }, 500);
    },
    [selectedContract, onContractSelect]
  );

  const enhancedContracts = useMemo(() => {
    if (!contracts) return [];

    return contracts.map((contract, idx) => {
      const customer = customers[idx];
      const project = projects.find((p) => p.project_name === contract.document_name);

      return {
        name: contract.name,
        custom_name: contract.custom_name ?? "이름 없음",
        docstatus: contract.docstatus ?? 2,
        is_signed: contract.is_signed ?? false,
        custom_subscribe: contract.custom_subscribe ?? false,
        custom_fee: contract.custom_fee ?? 0,
        custom_maintenance: contract.custom_maintenance ?? 0,
        modified: contract.modified ? new Date(contract.modified) : new Date(),
        start_date: contract.start_date ?? "0000-00-00",
        end_date: contract.end_date ?? "0000-00-00",
        customer,
        project,
      };
    });
  }, [contracts, customers, projects]);

  const columns = [
    columnHelper.accessor("custom_name", {
      id: "name",
      header: "이름",
      size: 200,
      cell: ({ getValue }) => <div className="text-gray-900 font-medium">{getValue() || "계약서"}</div>,
    }),
    columnHelper.accessor("docstatus", {
      id: "status",
      header: "계약 상태",
      size: 100,
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div
            className={cn(
              "flex items-center justify-center px-1.5 py-0.5 rounded-sm border h-fit w-fit text-xs font-medium",
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
        );
      },
    }),
    columnHelper.accessor("project", {
      id: "project",
      header: "프로젝트",
      size: 200,
      cell: ({ getValue }) => <div className="text-gray-700">{getValue()?.custom_project_title}</div>,
    }),
    columnHelper.accessor("customer", {
      id: "contractor",
      header: "계약자",
      size: 80,
      cell: ({ getValue }) => <div className="text-gray-700">{getValue()?.name}</div>,
    }),
    columnHelper.accessor("custom_subscribe", {
      id: "payment",
      header: "결제 방식",
      size: 120,
      cell: ({ getValue }) => <div className="text-gray-700">{!getValue() ? `회차 정산형` : `정기 결제형`}</div>,
    }),
    columnHelper.display({
      id: "total",
      header: "합계",
      size: 200,
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div className="text-gray-700">
            {!contract.custom_subscribe ? `${contract.custom_fee?.toLocaleString()} 원` : `${contract.custom_maintenance?.toLocaleString()}원 / 월`}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "schedule",
      header: "일정",
      size: 250,
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div className="text-gray-700">
            {dayjs(contract.start_date).format("YYYY.MM.DD")} {contract.end_date && dayjs(contract.end_date).format("~ YYYY.MM.DD")}
          </div>
        );
      },
    }),
    columnHelper.accessor("modified", {
      id: "modified",
      header: "수정일",
      size: 80,
      cell: ({ getValue }) => <div className="text-gray-700">{dayjs(getValue()).format("YYYY.MM.DD")}</div>,
    }),
    columnHelper.display({
      id: "pdf",
      header: "PDF",
      size: 40,
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold h-6 px-2 shadow-none bg-transparent grow hover:bg-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              downloadContractPDF(contract.name, contract.custom_name, contract.modified);
            }}
          >
            <Download className="size-3" />
            PDF
          </Button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: enhancedContracts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="hidden lg:block text-sm font-bold">계약서: {contracts.length}건</div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-blue-200/60 backdrop-blur supports-[backdrop-filter]:bg-blue-200/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-black/5 text-xs font-semibold tracking-wide text-blue-600 uppercase">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col" className="px-5 py-3 text-left" style={{ width: `${header.getSize()}px` }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-black/5">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100/80 transition-colors even:bg-gray-100/40 cursor-pointer"
                onClick={() => handleContractClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-3" style={{ minWidth: `${cell.column.getSize()}px` }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contracts.length === 0 && !isLoading && (
        <div className="hidden lg:flex flex-col w-full">
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
