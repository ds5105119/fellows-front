import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import { SearchIcon } from "lucide-react";

export default function ContractHeader() {
  return (
    <div className="sticky z-30 top-24 md:top-32 bg-background w-full flex flex-col">
      <div className="flex w-full justify-between h-12 items-center px-4 md:px-6 border-b-1 border-b-sidebar-border space-x-2">
        <div className="flex items-center grow md:max-w-1/2 space-x-2">
          <div className="hidden lg:block">
            <ComboBoxResponsive
              statuses={[
                { label: "일별", value: "day" },
                { label: "주별", value: "week" },
                { label: "월별", value: "month" },
              ]}
              initial={"week"}
              callback={(value: string) => {}}
            />
          </div>
          <div className="relative w-full max-w-96 h-fit rounded-full bg-muted">
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-2.5 size-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
    </div>
  );
}
