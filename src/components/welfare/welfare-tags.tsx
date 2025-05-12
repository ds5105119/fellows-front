interface WelfareTagsProps {
  category: string;
  type: string;
  isOnline?: boolean;
  dDay?: number;
}

export function WelfareTags({ type, isOnline, dDay }: WelfareTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {dDay && dDay > 0 && (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">마감 D-{dDay}</span>
      )}
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">{type}</span>
      {isOnline && <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">온·오프라인</span>}
    </div>
  );
}
