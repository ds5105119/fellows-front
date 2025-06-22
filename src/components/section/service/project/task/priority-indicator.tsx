import { Flag } from "lucide-react";

interface PriorityIndicatorProps {
  expectedTime: number;
}

export function PriorityIndicator({ expectedTime }: PriorityIndicatorProps) {
  let priority = "Low";
  let color = "text-green-600";

  if (expectedTime > 40) {
    priority = "High";
    color = "text-red-600";
  } else if (expectedTime > 20) {
    priority = "Medium";
    color = "text-yellow-600";
  }

  return (
    <div className={`flex items-center gap-1 ${color}`}>
      <Flag className="h-3 w-3" />
      <span className="text-xs font-medium">{priority}</span>
    </div>
  );
}
