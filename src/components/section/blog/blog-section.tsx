"use client";

import { motion, useInView } from "framer-motion";
import { usePosts } from "@/hooks/fetch/blog";
import { useEffect, useRef, useState } from "react";
import BlogPostItem from "./blog-post-item";
import BlogPostSkeleton from "./blog-post-skeleton";
import BlogNavigation from "./blog-navigation";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BlogSectionProps {
  title: string;
}

export function BlogSection({ title }: BlogSectionProps) {
  const ref = useRef(null);
  const infinitRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState("전체");
  const tabs = ["전체", "인사이트", "고객 사례", "가이드북"];

  const isInView = useInView(ref, {
    once: true,
    margin: "-50px 0px -50px 0px",
  });
  const isReachingEnd = useInView(infinitRef, {
    once: false,
    margin: "-50px 0px -50px 0px",
  });

  const swr = usePosts(20, activeTab === "전체" ? undefined : activeTab);
  const posts = swr.data?.flatMap((i) => i.items) ?? [];
  const isReachedEnd = swr.data && swr.data.length > 0 && swr.data[swr.data.length - 1].items.length === 0;
  const isLoading = !isReachedEnd && (swr.isLoading || (swr.data && swr.size > 0 && typeof swr.data[swr.size - 1] === "undefined"));

  useEffect(() => {
    if (isReachingEnd && !isLoading && !isReachedEnd) {
      swr.setSize((s) => s + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReachingEnd, isLoading, isReachedEnd]);

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
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Posts Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-9">
        {/* Section Header */}
        <div className="col-span-full flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center justify-between">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">{title}</h2>
          <BlogNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {posts.length > 0 && <BlogPostItem post={posts[0]} featured={true} />}

        {posts.slice(1, 3).map((post, index) => (
          <BlogPostItem key={index} post={post} />
        ))}

        <Link
          href="/service/dashboard"
          className="group col-span-full py-8 rounded-xl hidden md:flex items-center justify-center bg-zinc-200/80 border border-zinc-200 hover:bg-zinc-300/80 duration-300 transition-colors"
        >
          <AnimatedGradientText speed={2} colorFrom="#4ade80" colorTo="#06b6d4" className="flex items-center text-2xl font-bold tracking-tight">
            <span>Fellows</span>
            <span className="font-medium">가 궁금하다면?&nbsp;</span>
            <span>지금 무료로 체험해보세요</span>
            <ChevronRight className="ml-1.5 size-5 stroke-[#06b6d4] transition-transform duration-500 ease-in-out group-hover:translate-x-1" />
          </AnimatedGradientText>
        </Link>

        {posts.slice(3, posts.length).map((post, index) => (
          <BlogPostItem key={index} post={post} />
        ))}

        {isLoading && posts.length == 0 && <BlogPostSkeleton featured={true} />}
        {isLoading && (
          <>
            <BlogPostSkeleton />
            <BlogPostSkeleton />
            <BlogPostSkeleton />
          </>
        )}

        <div className="col-span-full h-1" ref={infinitRef} />
      </div>
    </motion.section>
  );
}
