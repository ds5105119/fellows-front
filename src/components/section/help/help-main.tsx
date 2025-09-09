"use client";

import { Input } from "@/components/ui/input";
import { Search, HelpCircle } from "lucide-react";
import { useState, useMemo } from "react";
import type { HelpsRead } from "@/@types/service/help";
import { HelpCard } from "./help-card";
import HelpSidebar, { helpCategories } from "./help-sidebar";

export default function HelpPageClient({ helps }: { helps: HelpsRead }) {
  const [searchQuery, setSearchQuery] = useState("");

  const groupedHelps = useMemo(() => {
    const filtered =
      helps?.items?.filter(
        (help) =>
          help.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          help.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          help.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

    filtered.sort((a, b) => a.title.localeCompare(b.title, "ko"));

    const grouped = helpCategories.reduce((acc, category) => {
      const categoryHelps = filtered.filter((help) => help.category === category.value);
      acc[category.value] = categoryHelps;
      return acc;
    }, {} as Record<string, typeof filtered>);

    return grouped;
  }, [helps?.items, searchQuery]);

  return (
    <div className="flex h-full">
      <HelpSidebar helps={helps} />

      {/* Main content */}
      <div id="main" className="flex-1 p-6 ml-48 overflow-y-auto">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="도움말 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        {Object.keys(groupedHelps).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedHelps).map(([categoryValue, categoryHelps]) => {
              const category = helpCategories.find((c) => c.value === categoryValue);
              const Icon = category?.icon || HelpCircle;

              return (
                <div key={categoryValue} id={category?.value}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="w-5 h-5" />
                    <h2 className="text-xl font-semibold">{category?.label || categoryValue}</h2>
                    <span className="text-sm text-muted-foreground">({categoryHelps.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryHelps.map((help) => (
                      <HelpCard key={help.id} help={help} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">검색 결과가 없습니다</h3>
            <p className="text-muted-foreground">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
