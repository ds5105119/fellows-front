"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, HelpCircle, BookOpen, Settings, BarChart3 } from "lucide-react";
import { useState } from "react";
import type { Session } from "next-auth";
import type { HelpsRead } from "@/@types/service/help";
import Link from "next/link";

const categoryColors = {
  문서관리: "bg-orange-100 text-orange-800 border-orange-200",
  검색기능: "bg-blue-100 text-blue-800 border-blue-200",
  업무관리: "bg-purple-100 text-purple-800 border-purple-200",
  설정: "bg-green-100 text-green-800 border-green-200",
  기본: "bg-gray-100 text-gray-800 border-gray-200",
};

const categoryIcons = {
  문서관리: FileText,
  검색기능: Search,
  업무관리: BarChart3,
  설정: Settings,
  기본: HelpCircle,
};

const cardBackgrounds = [
  "bg-gradient-to-br from-orange-50 to-orange-100",
  "bg-gradient-to-br from-blue-50 to-blue-100",
  "bg-gradient-to-br from-purple-50 to-purple-100",
  "bg-gradient-to-br from-green-50 to-green-100",
  "bg-gradient-to-br from-yellow-50 to-yellow-100",
  "bg-gradient-to-br from-pink-50 to-pink-100",
];

interface HelpPageClientProps {
  session: Session | null;
  helps: HelpsRead;
}

export default function HelpPageClient({ session, helps }: HelpPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHelps =
    helps?.items?.filter(
      (help) =>
        help.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        help.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        help.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">도움말</h1>
        </div>
        <p className="text-muted-foreground text-lg">궁금한 내용을 검색하거나 카테고리별로 찾아보세요</p>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="도움말 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Help Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHelps.map((help, index) => {
          const category = help.category || "기본";
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || HelpCircle;
          const cardBg = cardBackgrounds[index % cardBackgrounds.length];

          return (
            <Link href={`/help/${help.id}`}>
              <Card key={help.id} className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-0 ${cardBg}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <Badge variant="secondary" className={categoryColors[category as keyof typeof categoryColors] || categoryColors["기본"]}>
                        {category}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">{help.title}</CardTitle>
                  {help.summary && <CardDescription className="text-sm text-muted-foreground line-clamp-2">{help.summary}</CardDescription>}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">자세히 보기 →</span>
                    {help.title_image && (
                      <div className="w-8 h-8 rounded bg-white/50 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredHelps.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground">다른 키워드로 검색해보세요</p>
        </div>
      )}
    </div>
  );
}
