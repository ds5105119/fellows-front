"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Welfare } from "@/@types/openApi/welfare";
import { Button } from "@/components/ui/button";

interface WelfareDetailsProps {
  welfare: Welfare;
}

export function WelfareDetails({ welfare }: WelfareDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-t bg-white">
      <Button variant="ghost" className="w-full flex justify-between items-center p-4" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="font-semibold">정책을 요약했어요</span>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </Button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">지원대상</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{welfare.service_conditions}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">신청방법</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{welfare.apply_method}</p>
          </div>
          {welfare.document && (
            <div className="space-y-2">
              <h3 className="font-medium">필요서류</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{welfare.document}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
