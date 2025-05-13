"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps extends Omit<ComponentProps<typeof ReactMarkdown>, "children"> {
  /** Loading state controls the blurred gradient overlay and clip animation */
  loading: boolean;
  /** The markdown content to render */
  children: string;
  /** overlay에 사용할 RGB 색상 (default: white) */
  overlayColor?: string; // e.g. "255, 255, 255"
}

export default function MarkdownPreview({
  loading,
  children,
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

  return !loading && children ? (
    <ReactMarkdown remarkPlugins={remarkPlugins} {...restProps}>
      {children}
    </ReactMarkdown>
  ) : (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden"
      animate={{ maxHeight: clipHeight }}
      initial={false}
      transition={{ duration: 0.5, ease: "linear" }}
    >
      <ReactMarkdown remarkPlugins={remarkPlugins} {...restProps}>
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
