"use client";

import { BlogPostDtoType } from "@/@types/service/blog";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dayjs from "dayjs";
import { Clock9 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogPostItemProps {
  post: BlogPostDtoType;
  featured?: boolean;
}

export default function BlogPostItem({ post, featured = false }: BlogPostItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -100px 0px",
  });

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Common animation properties
  const animationProps = {
    initial: {
      opacity: 0,
      y: 30,
      filter: "blur(8px)",
    },
    animate: {
      opacity: isInView ? 1 : 0,
      y: isInView ? 0 : 20,
      filter: isInView ? "blur(0px)" : "blur(5px)",
    },
    transition: {
      duration: featured ? 0.8 : 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  };

  // Common post metadata
  const PostMetadata = ({ title = false }: { title?: boolean }) => (
    <>
      <div className="flex space-x-2">
        <h4 className="text-muted-foreground font-bold text-xs min-[70rem]:text-sm">{post?.category?.name ?? "인사이트"}</h4>
      </div>

      <h3
        className={cn(
          "font-extrabold text-slate-900 leading-tight group-hover:text-blue-500 transition-colors duration-500 grow",
          title ? "text-xl min-[70rem]:text-4xl" : "text-xl min-[70rem]:text-2xl"
        )}
      >
        {post.title}
      </h3>
    </>
  );

  // Common post info (date and reading time)
  const PostInfo = () => (
    <div className="w-full flex items-center justify-between">
      <span className="text-xs min-[70rem]:text-base font-semibold text-gray-500">
        {post.published_at ? dayjs(post.published_at).format("LL") : "날짜 없음"}
      </span>
      <div className="flex items-center space-x-1 text-xs min-[70rem]:text-sm font-bold text-slate-500">
        <Clock9 className="!size-4" strokeWidth={2.5} />
        <span>{estimateReadingTime(post.content)} min</span>
      </div>
    </div>
  );

  return (
    <motion.a href={`/blog/${post.id}`} ref={ref} className={cn("sm:group cursor-pointer", featured ? "md:col-span-full" : "")} {...animationProps}>
      {featured ? (
        <>
          {/* Featured post - horizontal layout for large screens */}
          <div className="hidden min-[70rem]:flex">
            <div className="rounded-l-4xl overflow-hidden grow">
              <div className="relative aspect-[16/9]">
                <Image
                  src={post.title_image || "/placeholder.svg?height=400&width=600"}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-all duration-1000"
                  fill
                />
              </div>
            </div>
            <div className="rounded-r-4xl bg-white space-y-4 px-8 py-8 flex flex-col w-[34%]">
              <PostMetadata title={true} />
              <PostInfo />
            </div>
          </div>

          {/* Featured post - vertical layout for small screens */}
          <div className="block min-[70rem]:hidden">
            <div className="rounded-t-3xl min-[70rem]:rounded-t-4xl overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image
                  src={post.title_image || "/placeholder.svg?height=400&width=600"}
                  alt={post.title}
                  className="object-cover group-hover:scale-105 transition-all duration-1000"
                  fill
                />
              </div>
            </div>
            <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 py-8 flex flex-col h-44 min-[70rem]:h-52">
              <PostMetadata />
              <PostInfo />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Regular post - vertical layout for all screen sizes */}
          <div className="rounded-t-3xl min-[70rem]:rounded-t-4xl overflow-hidden">
            <div className="relative aspect-[16/9]">
              <Image
                src={post.title_image || "/placeholder.svg?height=400&width=600"}
                alt={post.title}
                className="object-cover group-hover:scale-105 transition-all duration-1000"
                fill
              />
            </div>
          </div>
          <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 py-8 flex flex-col h-44 min-[70rem]:h-52">
            <PostMetadata />
            <PostInfo />
          </div>
        </>
      )}
    </motion.a>
  );
}
