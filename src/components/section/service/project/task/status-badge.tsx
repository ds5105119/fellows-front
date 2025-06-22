import { Badge } from "@/components/ui/badge";
import type { ERPNextTaskStatus } from "@/@types/service/project";

interface StatusBadgeProps {
  status?: ERPNextTaskStatus | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;

  const statusConfig = {
    Open: {
      color: "bg-blue-100 text-blue-600 border-blue-200",
      text: "열림",
    },
    Working: {
      color: "bg-yellow-100 text-yellow-600 border-yellow-200",
      text: "진행중",
    },
    "Pending Review": {
      color: "bg-purple-100 text-purple-600 border-purple-200",
      text: "리뷰 대기 중",
    },
    Overdue: {
      color: "bg-red-100 text-red-600 border-red-200",
      text: "지연",
    },
    Template: {
      color: "bg-gray-100 text-gray-600 border-gray-200",
      text: "초안",
    },
    Completed: {
      color: "bg-green-100 text-green-600 border-green-200",
      text: "완료",
    },
    Cancelled: {
      color: "bg-gray-100 text-gray-600 border-gray-200",
      text: "취소됨",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={`${config.color} rounded-[4px] px-1.5 font-medium`}>
      {config.text}
    </Badge>
  );
}
