"use client";

import { useContracts } from "@/hooks/fetch/contract";
import { Session } from "next-auth";
import { ContractList } from "./contract-list";
import { UserERPNextContract } from "@/@types/service/contract";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ContractSheet } from "./contract-sheet";
import ContractHeader from "./contract-header";

export default function ContractMain({ session }: { session: Session }) {
  const contractsSwr = useContracts({});
  const [selectedContract, setSelectedContract] = useState<UserERPNextContract>();
  const [contractSheetOpen, setContractSheetOpen] = useState<boolean>(false);

  const onContractSelect = (contract?: UserERPNextContract) => {
    setSelectedContract((prev) => (prev?.name === contract?.name ? prev : contract));
    if (contract && contract?.name !== selectedContract?.name) {
      setContractSheetOpen(true);
    }
  };

  const handleContractSheetClose = (open: boolean) => {
    setSelectedContract(undefined);
    setContractSheetOpen(open);
  };

  return (
    <div className="w-full h-full">
      <ContractHeader />
      <div className="w-full px-6 py-4">
        <ContractList contractsSwr={contractsSwr} selectedContract={selectedContract} onContractSelect={onContractSelect} />
      </div>
      <Sheet open={contractSheetOpen} onOpenChange={handleContractSheetClose}>
        <SheetTrigger className="sr-only" />
        <SheetContent side="right" className="w-full h-full sm:max-w-full md:w-[45%] md:min-w-[728px] [&>button:first-of-type]:hidden gap-0">
          <SheetHeader className="sr-only">
            <SheetTitle>계약서</SheetTitle>
          </SheetHeader>
          <ContractSheet contract={selectedContract} session={session} setOpenSheet={handleContractSheetClose} />
          <SheetDescription className="sr-only" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
