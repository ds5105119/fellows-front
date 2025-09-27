"use client";

import { useContract, useContracts } from "@/hooks/fetch/contract";
import type { Session } from "next-auth";
import { ContractList } from "./contract-list";
import type { UserERPNextContract } from "@/@types/service/contract";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ContractSheet } from "./contract-sheet";
import ContractHeader from "./contract-header";
import { useParams, usePathname } from "next/navigation";

export type ContractFilters = {
  keyword?: string;
  order_by?: string;
  type?: string;
};

export default function ContractMain({ session }: { session: Session }) {
  const params = useParams();
  const pathname = usePathname();
  const contract_id = params?.contract_id as string | undefined;

  const [filters, setFilters] = useState<ContractFilters>({ type: "0" });
  const [selectedContract, setSelectedContract] = useState<UserERPNextContract>();
  const [contractSheetOpen, setContractSheetOpen] = useState<boolean>(false);

  const contractsSwr = useContracts({
    keyword: filters.keyword,
    docstatus: filters.type === "0" ? undefined : filters.type === "1" || filters.type === "2" ? 0 : filters.type === "3" ? 1 : 2,
    is_signed: filters.type === "0" ? undefined : filters.type === "1" ? false : filters.type === "2" ? true : filters.type === "3" ? true : undefined,
  });
  const contractSwr = useContract(contract_id);

  const onContractSelect = (contract: UserERPNextContract) => {
    setSelectedContract(contract);
    setContractSheetOpen(true);
    const newPath = `${pathname}/${encodeURIComponent(contract.name)}`;
    window.history.pushState(null, "", newPath);
  };

  const handleContractSheetClose = (open: boolean) => {
    if (!open) {
      setSelectedContract(undefined);
      window.history.pushState(null, "", "/service/project/contracts");
    }
    setContractSheetOpen(open);
  };

  useEffect(() => {
    if (contractSwr.data) {
      setSelectedContract(contractSwr.data);
      setContractSheetOpen(true);
    }
  }, [contractSwr.data]);

  return (
    <div className="w-full h-full">
      <ContractHeader filters={filters} setFilters={setFilters} />
      <div className="w-full px-6 py-4">
        <ContractList contractsSwr={contractsSwr} selectedContract={selectedContract} onContractSelect={onContractSelect} />
      </div>
      <Sheet open={contractSheetOpen} onOpenChange={handleContractSheetClose}>
        <SheetTrigger className="sr-only" />
        <SheetContent side="right" className="w-full h-full sm:max-w-full md:w-[45%] md:min-w-[728px] [&>button:first-of-type]:hidden gap-0">
          <SheetHeader className="sr-only">
            <SheetTitle>계약서</SheetTitle>
          </SheetHeader>
          <ContractSheet
            contract={selectedContract}
            contractSwr={contractSwr}
            contractsSwr={contractsSwr}
            session={session}
            setOpenSheet={handleContractSheetClose}
          />
          <SheetDescription className="sr-only" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
