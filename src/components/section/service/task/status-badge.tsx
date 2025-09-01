import { Badge } from "@/components/ui/badge";
import type { ERPNextTaskStatus } from "@/@types/service/project";
import { statusConfig } from "@/components/resource/project";

interface StatusBadgeProps {
  status?: ERPNextTaskStatus | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={`${config.color} rounded-[4px] px-1.5 font-medium`}>
      {config.text}
    </Badge>
  );
}
