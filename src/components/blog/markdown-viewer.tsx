"use client";

import { X, ArrowLeft, Link, Facebook, Linkedin, ChevronRight } from "lucide-react";
import { BlogPostDtoType } from "@/@types/service/blog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

interface MarkdownViewerProps {
  post: BlogPostDtoType;
  isOpen: boolean;
  onClose: () => void;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function MarkdownViewer({ post, isOpen, onClose }: MarkdownViewerProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 마크다운 콘텐츠에서 제목 추출
  useEffect(() => {
    if (isOpen && post && post.content) {
      try {
        const headingRegex = /^(#{1,2})\s+(.+)$/gm;
        const extractedHeadings: HeadingItem[] = [];
        let match;

        while ((match = headingRegex.exec(post.content)) !== null) {
          const level = match[1].length;
          const text = match[2].trim();
          // 안전한 ID 생성
          const id = text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-가-힣]/g, "");

          extractedHeadings.push({
            id,
            text,
            level,
          });
        }

        setHeadings(extractedHeadings);

        // 첫 번째 제목을 초기 활성 제목으로 설정
        if (extractedHeadings.length > 0) {
          setActiveHeading(extractedHeadings[0].id);
        }
      } catch (error) {
        console.error("Error extracting headings:", error);
        setHeadings([]);
      }
    }
  }, [isOpen, post]);

  // 스크롤 위치에 따른 활성 섹션 감지
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || headings.length === 0) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop + 120; // 헤더 높이 고려

    // 모든 제목 요소의 위치를 계산
    const headingPositions = headings
      .map((heading) => {
        const element = document.getElementById(heading.id);
        if (!element) return { ...heading, offsetTop: 0 };

        return {
          ...heading,
          offsetTop: element.offsetTop,
        };
      })
      .filter((h) => h.offsetTop > 0);

    if (headingPositions.length === 0) return;

    // 현재 스크롤 위치보다 위에 있는 제목들 중 가장 가까운 것 찾기
    let activeId = headingPositions[0].id;

    for (let i = 0; i < headingPositions.length; i++) {
      if (headingPositions[i].offsetTop <= scrollTop) {
        activeId = headingPositions[i].id;
      } else {
        break;
      }
    }

    // 맨 아래에 도달했는지 확인
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const isAtBottom = container.scrollTop + clientHeight >= scrollHeight - 50;

    if (isAtBottom) {
      activeId = headingPositions[headingPositions.length - 1].id;
    }

    setActiveHeading(activeId);
  }, [headings]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen || headings.length === 0) return;

    // 초기 활성 섹션 설정
    setTimeout(() => {
      handleScroll();
    }, 100);

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, isOpen, headings]);

  // 제목 클릭 시 해당 섹션으로 스크롤
  const scrollToHeading = (id: string) => {
    try {
      const element = document.getElementById(id);
      const container = scrollContainerRef.current;

      if (element && container) {
        const headerHeight = 100;
        const elementPosition = element.offsetTop - headerHeight;

        container.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error scrolling to heading:", error);
    }
  };

  // post가 없으면 아무것도 렌더링하지 않음
  if (!post) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="font-semibold text-gray-900">Blog</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={scrollContainerRef} className="h-[calc(100vh-73px)] overflow-y-auto">
            <article className="max-w-6xl mx-auto px-6 py-8">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500 mb-6 flex items-center">
                <span>블로그 메인</span>
                <ChevronRight className="w-3 h-3 mx-2" />
                <span className="text-blue-400">{post.category?.name || "인사이트"}</span>
                <ChevronRight className="w-3 h-3 mx-2" />
                <span className="truncate max-w-[300px]">{post.title}</span>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="text-blue-400 font-medium">{post.category?.name || "인사이트"}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  {/* Title */}
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

                  {/* Date */}
                  <div className="text-gray-500 text-sm mb-8">
                    {new Date(post.published_at || new Date())
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\. /g, "-")
                      .replace(".", "")}
                  </div>

                  {/* Featured Image */}
                  {post.title_image && (
                    <div className="mb-8">
                      <img src={post.title_image || "/placeholder.svg"} alt={post.title} className="w-full rounded-lg" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-lg prose-gray max-w-none" ref={contentRef}>
                    {post.content && (
                      <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary prose-img:rounded-md prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}>
                          {post.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Share */}
                  <div className="flex items-center space-x-4 mt-12 pt-6 border-t border-gray-100">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Link className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Facebook className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Linkedin className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Table of Contents */}
                  {headings.length > 0 && (
                    <div className="mb-12 sticky top-24">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">목차</h3>
                      <nav className="space-y-1">
                        {headings.map((heading, index) => {
                          const isActive = activeHeading === heading.id;
                          return (
                            <button
                              key={index}
                              onClick={() => scrollToHeading(heading.id)}
                              className={`block text-left w-full text-sm rounded-md px-3 py-2 transition-all ${heading.level === 1 ? "font-medium" : "pl-6"} ${
                                isActive
                                  ? "bg-gray-100 text-blue-600 font-medium"
                                  : heading.level === 1
                                  ? "text-gray-900 hover:text-blue-500 hover:bg-gray-50"
                                  : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                              }`}
                            >
                              {heading.text}
                            </button>
                          );
                        })}
                      </nav>
                    </div>
                  )}

                  {/* CTA Box */}
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-blue-600 mb-3">간편한 근태, 손쉬운 인력 관리는 샤플</h3>
                    <p className="text-gray-600 mb-6">업무 · 근태관리, 커뮤니케이션을 한번에! 사람을 관리 업무를 효율화 해보세요.</p>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center justify-center w-full hover:bg-blue-600 transition-colors">
                      <span>샤플 알아보기</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
