"use client";

import { type LucideProps } from "lucide-react";
import dynamic from "next/dynamic";

type Props = {
  name: string;
  className?: string;
};

// 아이콘은 미리 캐싱하지 않음: 모든 요청은 dynamic import
export default function DynamicLucideIcon({ name, className }: Props) {
  const Icon = dynamic<LucideProps>(
    () =>
      import("lucide-react").then((mod) => {
        const Component = mod[name];

        // Type assertion: Lucide icons are always function components
        return Component as React.FC<LucideProps>;
      }),
    {
      ssr: false,
      loading: () => <div className="w-5 h-5 bg-gray-300/10 rounded animate-pulse" />,
    }
  );

  return <Icon className={className} />;
}
