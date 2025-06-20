"use client";

import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/fetch/project";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useProjects({ size: 1 });

  useEffect(() => {
    if (isLoading) return;

    if (!data || data.length === 0 || data[0].items.length === 0) {
      router.push("/service/project/new");
    } else {
      router.push("/service/dashboard");
    }
  }, [data, isLoading, router]);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* Loading */}
        <div className="space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">준비 중</p>
        </div>
      </div>
    </div>
  );
}
