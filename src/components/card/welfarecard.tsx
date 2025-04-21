import { Eye, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Welfare } from "@/@types/openApi/welfare";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface WelfareCardProps {
  img?: string;
  href?: string;
  bookmarks?: number;
  data: Welfare;
  className?: string;
}

export default function WelfareCard({ img, href, bookmarks, data, className }: WelfareCardProps) {
  return (
    <Link href={`/explore/welfare/${data.service_id}`}>
      <Card className={cn("transition-all duration-200 py-5 rounded-md border-none bg-muted shadow-none", className)}>
        <CardContent className="space-y-2 px-4">
          <div className="flex items-center align-baseline space-x-2">
            <div className="w-6 h-6">
              <img src={img} alt="부서 로고" className="w-full h-full" />
            </div>
            <span className="font-bold text-base leading-tight">{data.service_name}</span>
            <span className="text-sm text-muted-foreground">@{data.offc_name}</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm">{data.service_summary}</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(data.views)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" />
              <span>{formatNumber(bookmarks ?? 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
