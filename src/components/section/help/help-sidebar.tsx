"use client";

import { HelpRead, HelpsRead } from "@/@types/service/help";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, FolderOpen, Receipt, CheckSquare, FileBarChart, AlertCircle, CreditCard, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export const helpCategories = [
  { value: "일반", label: "일반", icon: HelpCircle },
  { value: "프로젝트", label: "프로젝트", icon: FolderOpen },
  { value: "견적서", label: "견적서", icon: Receipt },
  { value: "테스크", label: "테스크", icon: CheckSquare },
  { value: "보고서", label: "보고서", icon: FileBarChart },
  { value: "이슈", label: "이슈", icon: AlertCircle },
  { value: "구독", label: "구독", icon: CreditCard },
  { value: "기타", label: "기타", icon: MoreHorizontal },
] as const;

export default function HelpSidebar({ helps, help }: { helps: HelpsRead; help?: HelpRead }) {
  const router = useRouter();

  return (
    <div className="w-48 bg-card border-r border-border p-4 absolute top-0 h-full overflow-y-auto">
      <h2 className="font-semibold text-lg mb-4 ml-3">카테고리</h2>
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            const container = document.getElementById("main");
            container?.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          전체
        </Button>
        {helpCategories.map((category) => {
          const Icon = category.icon;
          const count = helps?.items?.filter((help) => help.category === category.value).length || 0;

          return (
            <Button
              key={category.value}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                if (help) {
                  router.push(`/help/#${category.value}`);
                  return;
                }
                const target = document.getElementById(category.value);
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.label}
              <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{count}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
