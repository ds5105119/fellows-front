import { Badge } from "@/components/ui/badge";
import { Circle, Clock, Eye, AlertTriangle, FileText, CheckCircle, XCircle } from "lucide-react";
import type { ERPNextTaskStatus } from "@/@types/service/project";

interface StatusBadgeProps {
  status?: ERPNextTaskStatus | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;

  const statusConfig = {
    Open: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Circle,
      iconColor: "text-blue-600",
    },
    Working: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      iconColor: "text-yellow-600",
    },
    "Pending Review": {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Eye,
      iconColor: "text-purple-600",
    },
    Overdue: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
    Template: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: FileText,
      iconColor: "text-gray-600",
    },
    Completed: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    Cancelled: {
      color: "bg-gray-100 text-gray-600 border-gray-200",
      icon: XCircle,
      iconColor: "text-gray-500",
    },
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} font-medium`}>
      <IconComponent className={`mr-1 h-3 w-3 ${config.iconColor}`} />
      {status}
    </Badge>
  );
}
