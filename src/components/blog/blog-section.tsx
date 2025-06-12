"use client";

import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePosts } from "@/hooks/fetch/blog";
import { BlogPostItem } from "./blog-post-item";
import { useRef } from "react";
import Link from "next/link";

interface BlogSectionProps {
  title: string;
}

export function BlogSection({ title }: BlogSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-50px 0px -50px 0px",
  });

  const swr = usePosts(20);
  const posts = swr.data?.flatMap((i) => i.items) ?? [];

  return (
    <motion.section
      ref={ref}
      className="flex flex-col items-center"
      initial={{
        opacity: 0,
        y: 40,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 40,
        filter: isInView ? "blur(0px)" : "blur(10px)",
      }}
      exit={{
        opacity: 0,
        y: -40,
        filter: "blur(10px)",
      }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-9">
        {/* Section Header */}
        <div className="col-span-full flex items-center justify-between mb-3">
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">{title}</h2>
          </div>

          <Link href="/" className="flex items-center space-x-1.5 md:px-3 md:py-1.5 md:rounded-sm md:hover:bg-gray-200 select-none">
            <ArrowUpRight className="!size-7 text-blue-500" />
            <p className="text-lg md:text-xl font-semibold text-blue-500">더 확인하기</p>
          </Link>
        </div>

        {posts.length > 0 && <BlogPostItem post={posts[0]} featured={true} />}
        {posts.slice(1, posts.length).map((post, index) => (
          <BlogPostItem key={index} post={post} index={index + 1} />
        ))}
      </div>
    </motion.section>
  );
}
