"use client";

import dynamic from "next/dynamic";
import { IconBaseProps } from "react-icons/lib";

type Props = {
  name: string;
  className?: string;
};

// 아이콘은 미리 캐싱하지 않음: 모든 요청은 dynamic import
export default function DynamicFcIcon({ name, className }: Props) {
  const Icon = dynamic(
    () =>
      import("react-icons/fc").then((mod) => {
        const Component = mod[name];

        // Type assertion: Lucide icons are always function components
        return Component as React.FC<IconBaseProps>;
      }),
    {
      ssr: false,
      loading: () => <div className="w-5 h-5 bg-gray-300/10 rounded animate-pulse" />,
    }
  );

  return <Icon className={className} />;
}
