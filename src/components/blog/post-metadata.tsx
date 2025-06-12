"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Upload } from "lucide-react";

interface PostMetadataProps {
  metadata: {
    title: string;
    summary: string;
    category: string;
    tags: string[];
    titleImage: string;
  };
  onChange: (metadata: { title: string; summary: string; category: string; tags: string[]; titleImage: string }) => void;
}

export function PostMetadata({ metadata, onChange }: PostMetadataProps) {
  const [newTag, setNewTag] = useState("");

  const categories = ["인사이트", "고객 사례", "협동팀", "가이드북", "뉴스", "서비스 스토리"];

  const addTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      onChange({
        ...metadata,
        tags: [...metadata.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange({
      ...metadata,
      tags: metadata.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제로는 파일 업로드 로직 구현
      const imageUrl = URL.createObjectURL(file);
      onChange({
        ...metadata,
        titleImage: imageUrl,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 space-y-6"
    >
      <h3 className="text-lg font-semibold text-slate-900">포스트 설정</h3>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">제목</label>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => onChange({ ...metadata, title: e.target.value })}
          placeholder="포스트 제목을 입력하세요"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">요약</label>
        <textarea
          value={metadata.summary}
          onChange={(e) => onChange({ ...metadata, summary: e.target.value })}
          placeholder="포스트 요약을 입력하세요"
          rows={3}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">카테고리</label>
        <select
          value={metadata.category}
          onChange={(e) => onChange({ ...metadata, category: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">카테고리 선택</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">태그</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {metadata.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              <span>{tag}</span>
              <button onClick={() => removeTag(tag)} className="hover:bg-blue-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTag()}
            placeholder="태그 추가"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button onClick={addTag} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title Image */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">대표 이미지</label>
        {metadata.titleImage ? (
          <div className="relative">
            <img src={metadata.titleImage || "/placeholder.svg"} alt="Title" className="w-full h-32 object-cover rounded-lg" />
            <button
              onClick={() => onChange({ ...metadata, titleImage: "" })}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-slate-400" />
              <p className="text-sm text-slate-500">이미지 업로드</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        )}
      </div>
    </motion.div>
  );
}
