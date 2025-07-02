"use client";

import type React from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { cn } from "@/lib/utils";
import type { Element as HastElement } from "hast";

interface MarkdownPreviewProps extends ComponentProps<typeof ReactMarkdown> {
  loading?: boolean;
  overlayColor?: string;
  className?: string;
}

// 간단하고 안전한 타입 정의
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

export default function MarkdownPreview({
  loading = false,
  children,
  className = "",
  remarkPlugins = [remarkGfm],
  overlayColor = "255, 255, 255",
  ...restProps
}: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [clipHeight, setClipHeight] = useState(0);

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

  const baseClasses = cn(
    "prose prose-sm md:prose-base max-w-none",
    "prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
    "prose-a:text-primary prose-img:rounded-md",
    "prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl",
    "[&_pre]:whitespace-pre-wrap [&_pre]:break-words",
    "[&_code]:break-words",
    // 표를 제외한 요소들에만 break-words 적용
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:max-w-full",
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:break-words",
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:overflow-hidden",
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:whitespace-normal",
    "[&_*:not(table):not(thead):not(tbody):not(tr):not(th):not(td)]:overflow-wrap-break-word",
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

        // 가로 스크롤이 가능한 경우에만 세로 스크롤 차단
        if (canScrollHorizontally) {
          e.preventDefault();
          e.stopPropagation();
          wrapper.scrollLeft += e.deltaY;
        }
        // 가로 스크롤이 불가능하면 일반 세로 스크롤 허용
      };

      // passive: false로 설정하여 preventDefault가 작동하도록 함
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
        const walk = (x - startX) * 2; // 스크롤 속도 조절
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

        // 가로 스크롤이 발생하는 경우에만 기본 동작 방지
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
            touchAction: canScroll ? "pan-y pinch-zoom" : "auto", // 세로 스크롤과 줌은 허용
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
    code({ node, inline, className, children, ...props }: CodeComponentProps) {
      const match = /language-(\w+)/.exec(className || "");

      const rawCode =
        !inline && node?.children?.[0]?.value
          ? node.children[0].value
          : typeof children === "string"
          ? children
          : Array.isArray(children)
          ? children.join("")
          : String(children);

      const codeString = rawCode
        .split("\n")
        .map((line: string) => line.replace(/^(\s+)/, (spaces: string) => spaces.replace(/ /g, "\u00A0")))
        .join("\n\n");

      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          customStyle={{
            borderRadius: "0.5rem",
            padding: "1rem",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            lineHeight: "1.4",
          }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return !loading && children ? (
    <div className={baseClasses}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components} {...restProps}>
        {children}
      </ReactMarkdown>
    </div>
  ) : (
    <motion.div ref={containerRef} className={baseClasses} animate={{ maxHeight: clipHeight }} initial={false} transition={{ duration: 0.5, ease: "linear" }}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components} {...restProps}>
        {children}
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
