"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostMetadata } from "@/components/section/blog/post-metadata";
import Editor from "@/components/editor/editor";
import { CreateBlogPostDto } from "@/@types/service/blog";
import { createPost } from "@/hooks/fetch/blog";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [content, setContent] = useState("");

  const [metadata, setMetadata] = useState({
    title: "",
    summary: "",
    category: "",
    tags: [] as string[],
    titleImage: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    if (!metadata.title || !metadata.summary || !metadata.category || !metadata.titleImage) {
      toast.error("누락된 항목이 있어요");
      setIsSaving(false);
      return;
    }
    const payload = CreateBlogPostDto.parse({
      content: content,
      title: metadata.title,
      title_image: metadata.titleImage,
      summary: metadata.summary,
      category: { name: metadata.category },
      tags: metadata.tags.map((tag) => ({ name: tag })),
    });
    await createPost(payload);

    setIsSaving(false);
  };

  const handlePublish = async () => {
    setIsSaving(true);

    if (!metadata.title || !metadata.summary || !metadata.category || !metadata.titleImage) {
      toast.error("누락된 항목이 있어요");
      setIsSaving(false);
      return;
    }

    const payload = CreateBlogPostDto.parse({
      content: content,
      title: metadata.title,
      title_image: metadata.titleImage,
      summary: metadata.summary,
      category: { name: metadata.category },
      tags: metadata.tags.map((tag) => ({ name: tag })),
      is_published: true,
      published_at: new Date().toISOString().slice(0, 19),
    });
    await createPost(payload);

    setIsSaving(false);
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
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-sm font-medium">{isSaving ? "저장 중..." : "저장"}</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isSaving}
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
              className="w-full h-full overflow-auto min-h-96"
            />
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-6">
            <PostMetadata metadata={metadata} onChange={setMetadata} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
