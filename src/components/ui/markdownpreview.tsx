"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks"; // 줄바꿈 처리를 위한 플러그인
import { cn } from "@/lib/utils";
import type { Element as HastElement } from "hast";
import rehypeRaw from "rehype-raw";
import { bundledLanguages, createHighlighter, type Highlighter } from "shiki";
import { Loader2 } from "lucide-react";

interface MarkdownPreviewProps extends ComponentProps<typeof ReactMarkdown> {
  loading?: boolean;
  overlayColor?: string;
  className?: string;
}

interface TableComponentProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
}

interface ThComponentProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children?: React.ReactNode;
}

interface TdComponentProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  children?: React.ReactNode;
}

interface CodeComponentProps extends React.HTMLAttributes<HTMLElement> {
  node?: HastElement;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function preprocessMarkdown(content: string): string {
  return (
    content
      // 연속된 공백 처리
      .replace(/ {2,}/g, (match) => "\u00A0".repeat(match.length))
      // 줄 끝 공백을 hard break로
      .replace(/ {2,}$/gm, "  ")
      // 두 개 이상의 연속 줄바꿈을 명시적인 문단 구분으로 변환
      .replace(/\n\n+/g, "\n\n \n\n")
  );
}

export default function MarkdownPreview({
  loading = false,
  children,
  className = "",
  remarkPlugins = [remarkGfm, remarkBreaks], // remarkBreaks 추가
  overlayColor = "255, 255, 255",
  ...restProps
}: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [clipHeight, setClipHeight] = useState(0);
  const [highlighter, setHighlighter] = useState<Highlighter | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;
    const h = containerRef.current.scrollHeight;
    setClipHeight(loading ? Math.max(h - 50, 0) : h);
  }, [children, loading]);

  useEffect(() => {
    if (containerRef.current && overlayRef.current) {
      /* overlayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      }); */
    }
  }, [children, loading]);

  useEffect(() => {
    const initHighlighter = async () => {
      const highlighter = await createHighlighter({
        themes: ["dark-plus"],
        langs: Object.keys(bundledLanguages),
      });
      setHighlighter(highlighter);
    };
    initHighlighter();
  }, []);

  const baseClasses = cn(
    "prose prose-sm md:prose-base max-w-none",
    "prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
    "prose-a:text-primary prose-img:rounded-md",
    "prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:p-3",
    "[&_pre]:whitespace-pre-wrap [&_pre]:break-words",
    "[&_code]:break-words",
    // 표를 제외한 요소들에만 break-words 적용
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:max-w-full",
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:break-words",
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:overflow-hidden",
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:whitespace-normal",
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:overflow-wrap-break-word",
    // 줄바꿈과 공백 처리를 위한 추가 스타일
    "[&_p]:whitespace-pre-wrap", // 문단에서 줄바꿈 보존
    "[&_div]:whitespace-pre-wrap", // div에서도 줄바꿈 보존
    "min-w-0",
    className
  );

  // 표를 wrapper div로 감싸는 커스텀 컴포넌트
  const TableComponent = ({ children, ...props }: TableComponentProps) => {
    const tableWrapperRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScroll, setCanScroll] = useState(false);
    const [isTouching, setIsTouching] = useState(false);
    const [lastTouchX, setLastTouchX] = useState(0);

    // 스크롤 가능 여부 체크
    useEffect(() => {
      const checkScrollable = () => {
        const wrapper = tableWrapperRef.current;
        if (wrapper) {
          const scrollable = wrapper.scrollWidth > wrapper.clientWidth;
          setCanScroll(scrollable);
        }
      };
      checkScrollable();
      window.addEventListener("resize", checkScrollable);
      return () => window.removeEventListener("resize", checkScrollable);
    }, [children]);

    // 네이티브 휠 이벤트 처리
    useEffect(() => {
      const wrapper = tableWrapperRef.current;
      if (!wrapper) return;

      const handleWheel = (e: WheelEvent) => {
        const canScrollHorizontally = wrapper.scrollWidth > wrapper.clientWidth;
        if (canScrollHorizontally) {
          e.preventDefault();
          e.stopPropagation();
          wrapper.scrollLeft += e.deltaY;
        }
      };

      wrapper.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        wrapper.removeEventListener("wheel", handleWheel);
      };
    }, []);

    // 드래그 이벤트 핸들러들
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!canScroll || !tableWrapperRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - tableWrapperRef.current.offsetLeft);
        setScrollLeft(tableWrapperRef.current.scrollLeft);
        if (tableWrapperRef.current) {
          tableWrapperRef.current.style.cursor = "grabbing";
        }
      },
      [canScroll]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!isDragging || !canScroll || !tableWrapperRef.current) return;
        e.preventDefault();
        const x = e.pageX - tableWrapperRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        tableWrapperRef.current.scrollLeft = scrollLeft - walk;
      },
      [isDragging, startX, scrollLeft, canScroll]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      if (tableWrapperRef.current && canScroll) {
        tableWrapperRef.current.style.cursor = "grab";
      }
    }, [canScroll]);

    const handleMouseLeave = useCallback(() => {
      setIsDragging(false);
      if (tableWrapperRef.current && canScroll) {
        tableWrapperRef.current.style.cursor = "grab";
      }
    }, [canScroll]);

    // 터치 이벤트 핸들러들
    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (!canScroll || !tableWrapperRef.current) return;
        const touch = e.touches[0];
        const touchX = touch.clientX;
        setIsTouching(true);
        setLastTouchX(touchX);
      },
      [canScroll]
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (!isTouching || !canScroll || !tableWrapperRef.current) return;
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const deltaX = lastTouchX - touchX;

        if (Math.abs(deltaX) > 5) {
          e.preventDefault();
        }

        tableWrapperRef.current.scrollLeft += deltaX;
        setLastTouchX(touchX);
      },
      [isTouching, lastTouchX, canScroll]
    );

    const handleTouchEnd = useCallback(() => {
      setIsTouching(false);
    }, []);

    return (
      <div className="relative">
        <div
          ref={tableWrapperRef}
          className={cn("overflow-x-auto w-full my-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent", canScroll && "select-none")}
          style={{
            scrollbarWidth: "thin",
            cursor: canScroll ? "grab" : "default",
            touchAction: canScroll ? "pan-y pinch-zoom" : "auto",
          }}
          onMouseDown={canScroll ? handleMouseDown : undefined}
          onMouseMove={canScroll ? handleMouseMove : undefined}
          onMouseUp={canScroll ? handleMouseUp : undefined}
          onMouseLeave={canScroll ? handleMouseLeave : undefined}
          onTouchStart={canScroll ? handleTouchStart : undefined}
          onTouchMove={canScroll ? handleTouchMove : undefined}
          onTouchEnd={canScroll ? handleTouchEnd : undefined}
        >
          <table
            className="border-collapse"
            style={{
              minWidth: "100%",
              width: "max-content",
            }}
            {...props}
          >
            {children}
          </table>
        </div>
      </div>
    );
  };

  const components = {
    table: TableComponent,
    th: ({ children, ...props }: ThComponentProps) => (
      <th className="bg-muted/50 px-6 py-3 text-center font-medium" style={{ whiteSpace: "nowrap" }} {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: TdComponentProps) => (
      <td className="px-6 py-3 text-center" style={{ whiteSpace: "nowrap" }} {...props}>
        {children}
      </td>
    ),
    // 문단 컴포넌트 추가
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="whitespace-pre-wrap" {...props}>
        {children}
      </p>
    ),
    code({ node, inline, className, children, ...props }: CodeComponentProps) {
      const langMatch = /language-(\w+)/.exec(className || "");
      const language = langMatch?.[1];
      const rawCode = Array.isArray(children) ? children.join("\n") : String(children);
      const codeString = rawCode
        .split("\n")
        .map((line: string) => line.replace(/^(\s+)/, (spaces: string) => spaces.replace(/ /g, "\u00A0")))
        .join("\n");

      if (!inline && language) {
        if (!highlighter) {
          return (
            <div {...props} className="flex justify-center items-center p-4">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          );
        }

        const html = highlighter
          .codeToHtml(codeString, {
            lang: language,
            theme: "dark-plus",
          })
          .replace(/<span class="line">/g, '<span style="display:block">');

        return <div {...props} className="drop-shadow-xl" dangerouslySetInnerHTML={{ __html: html }} />;
      }

      return (
        <code className={className} style={{ marginTop: 0, marginBottom: 0 }} {...props}>
          {rawCode}
        </code>
      );
    },
  };

  // children을 전처리
  const processedChildren = typeof children === "string" ? preprocessMarkdown(children) : children;

  return !loading && children ? (
    <div className={baseClasses}>
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={[rehypeRaw]} components={components} {...restProps}>
        {processedChildren}
      </ReactMarkdown>
    </div>
  ) : (
    <motion.div ref={containerRef} className={baseClasses} animate={{ maxHeight: clipHeight }} initial={false} transition={{ duration: 0.5, ease: "linear" }}>
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={[rehypeRaw]} components={components} {...restProps}>
        {processedChildren}
      </ReactMarkdown>
      {loading && (
        <div
          ref={overlayRef}
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(${overlayColor}, 0) 0%,
              rgba(${overlayColor}, 1) 60%
            )`,
          }}
        />
      )}
    </motion.div>
  );
}
