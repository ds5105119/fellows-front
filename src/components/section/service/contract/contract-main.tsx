"use client";

import { useContracts } from "@/hooks/fetch/contract";
import { Session } from "next-auth";
import { ContractList } from "./contract-list";
import { UserERPNextContract } from "@/@types/service/contract";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ContractSheet } from "./contract-sheet";

export default function ContractMain({ session }: { session: Session }) {
  const contractsSwr = useContracts({});
  const [selectedContract, setSelectedContract] = useState<UserERPNextContract>();
  const [contractSheetOpen, setContractSheetOpen] = useState<boolean>(false);

  const onContractSelect = (contract?: UserERPNextContract) => {
    if (contract) {
      setContractSheetOpen(true);
    }
    setSelectedContract(contract);
  };

  const handleContractSheetClose = (open: boolean) => {
    setSelectedContract(undefined);
    setContractSheetOpen(open);
  };

  return (
    <div>
      <ContractList contractsSwr={contractsSwr} selectedContract={selectedContract} onContractSelect={onContractSelect} />
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
