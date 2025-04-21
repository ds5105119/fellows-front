import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { FiscalByYearOffc } from "@/@types/openApi/fiscal";
import { ChevronRight } from "lucide-react";
import { formatNumberKoreanWon } from "@/lib/utils";

interface FiscalCardProps {
  index?: string | number;
  img?: string;
  href?: string;
  bookmarks?: number;
  data: FiscalByYearOffc;
  className?: string;
}

export default function FiscalCard({ index, img, data, className }: FiscalCardProps) {
  const isDfn = data.Y_YY_DFN_MEDI_KCUR_AMT ? true : false;
  const amt = formatNumberKoreanWon(data.Y_YY_DFN_MEDI_KCUR_AMT ?? data.Y_YY_MEDI_KCUR_AMT ?? 0);
  const pct = (data.Y_YY_MEDI_KCUR_AMT_PCT ?? data.Y_YY_DFN_MEDI_KCUR_AMT_PCT ?? 0) * 100;
  const src = img ?? "/Emblem_of_the_Government_of_the_Republic_of_Korea.png";
  const key = index ? `${index}` : null;

  return (
    <Link href={`/explore/fiscal/${data.FSCL_YY}/${data.NORMALIZED_DEPT_NO}`}>
      <Card className={cn("transition-all duration-200 py-0 gap-0 rounded-md border-none bg-muted shadow-none", className)}>
        <CardContent className="px-0">
          <div className="flex h-16 w-full pl-6 pr-4 py-2.5 justify-between items-center">
            <div className="flex items-center align-baseline h-full">
              <div className="text-base font-bold w-4 text-center mr-3 text-gray-500">{key}</div>
              <div className="flex items-center align-baseline space-x-2 h-full">
                <div className="w-8 h-8 p-1 bg-white rounded-full">
                  <img src={src} alt="부서 로고" className="w-full h-full" />
                </div>
                <div className="flex flex-col justify-between h-full">
                  <span className="font-bold text-base leading-tight">{data.OFFC_NM}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{amt} 원</span>
                    <span className={cn("text-sm font-medium", pct >= 0 ? "text-red-600" : "text-blue-600")}>{pct.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm leading-tight">{data.COUNT} 건</span>
              <ChevronRight />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
