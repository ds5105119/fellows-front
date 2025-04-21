import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Fiscal } from "@/@types/openApi/fiscal";
import { ChevronRight } from "lucide-react";
import { formatNumberKoreanWon } from "@/lib/utils";

interface FiscalDetailCardProps {
  index?: string | number;
  img?: string;
  href?: string;
  bookmarks?: number;
  data: Fiscal;
  className?: string;
}

export default function FiscalDetailCard({ index, img, data, className }: FiscalDetailCardProps) {
  const isDfn = data.Y_YY_DFN_MEDI_KCUR_AMT ? true : false;
  const amt = formatNumberKoreanWon(data.Y_YY_DFN_MEDI_KCUR_AMT ?? data.Y_YY_MEDI_KCUR_AMT ?? 0);
  const src = img ?? "/Emblem_of_the_Government_of_the_Republic_of_Korea.png";
  const key = index ? `${index}` : null;

  return (
    <Link href={`/explore/fiscal/${data.FSCL_YY}/${data.NORMALIZED_DEPT_NO}`}>
      <Card className={cn("transition-all duration-200 py-0 gap-0 rounded-md border-none bg-muted shadow-none", className)}>
        <CardContent className="px-0">
          <div className="flex h-16 w-full pl-6 pr-4 py-2.5 justify-between items-center gap-4">
            <div className="flex items-center align-baseline h-full flex-1 min-w-0">
              <div className="text-base font-bold w-4 text-center mr-3 text-gray-500">{key}</div>
              <div className="flex items-center align-baseline space-x-2 h-full flex-1 min-w-0 overflow-hidden">
                <div className="w-8 h-8 p-1 bg-white rounded-full flex-shrink-0">
                  <img src={src} alt="부서 로고" className="w-full h-full" />
                </div>
                <div className="flex flex-col justify-between h-full flex-1 min-w-0 overflow-hidden">
                  <p className="font-bold text-base leading-tight truncate">{data.SACTV_NM}</p>
                  <div className="flex items-center space-x-0.5 truncate">
                    <span className="text-sm text-muted-foreground truncate">{data.SECT_NM}</span>
                    <ChevronRight className="!size-4 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">{data.PGM_NM}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end min-w-32 flex-shrink-0">
              <span className="text-sm leading-tight whitespace-nowrap">{amt} 원</span>
              <ChevronRight className="flex-shrink-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
