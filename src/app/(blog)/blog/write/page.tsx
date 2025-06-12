"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, ImageIcon, Code, Table, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostMetadata } from "@/components/blog/post-metadata";
import Editor from "@/components/editor/editor";

export default function WritePage() {
  const router = useRouter();
  const [content, setContent] = useState("");

  const [metadata, setMetadata] = useState({
    title: "",
    summary: "",
    category: "",
    tags: [] as string[],
    titleImage: "",
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    // 여기에 실제 저장 로직 구현
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    // 성공 알림 등 추가 가능
  };

  const handlePublish = async () => {
    // 발행 로직
    console.log("Publishing post...", { metadata, content });
  };

  return (
    <div className="min-h-screen pt-13 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-slate-900">새 글 작성</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isPreviewMode ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{isPreviewMode ? "편집" : "미리보기"}</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">{isSaving ? "저장 중..." : "저장"}</span>
              </button>

              <button
                onClick={handlePublish}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <span className="text-sm font-medium">발행</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            <Editor
              markdown={content}
              placeholder="글을 작성하세요. 이미지는 드래그 앤 드롭으로도 올릴 수 있습니다..."
              onChange={setContent}
              className="w-full h-full overflow-auto"
            />
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-6">
            <PostMetadata metadata={metadata} onChange={setMetadata} />

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">빠른 삽입</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center space-y-2 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <ImageIcon className="w-5 h-5 text-slate-600" />
                  <span className="text-xs text-slate-600">이미지</span>
                </button>
                <button className="flex flex-col items-center space-y-2 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <Code className="w-5 h-5 text-slate-600" />
                  <span className="text-xs text-slate-600">코드</span>
                </button>
                <button className="flex flex-col items-center space-y-2 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <Table className="w-5 h-5 text-slate-600" />
                  <span className="text-xs text-slate-600">테이블</span>
                </button>
                <button className="flex flex-col items-center space-y-2 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <List className="w-5 h-5 text-slate-600" />
                  <span className="text-xs text-slate-600">리스트</span>
                </button>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">작성 팁</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• # 제목, ## 부제목으로 구조화</li>
                <li>• **굵게**, *기울임*으로 강조</li>
                <li>• \`\`\`로 코드 블록 생성</li>
                <li>• &gt; 인용구 사용</li>
                <li>• - 또는 * 로 리스트 생성</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
