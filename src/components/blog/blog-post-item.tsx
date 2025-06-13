"use client";

import { BlogPostDtoType } from "@/@types/service/blog";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dayjs from "dayjs";
import { Clock9 } from "lucide-react";
import Image from "next/image";

interface BlogPostItemProps {
  post: BlogPostDtoType;
  featured?: boolean;
  index?: number;
}

export function BlogPostItem({ post, featured = false, index = 0 }: BlogPostItemProps) {
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

  if (featured) {
    return (
      <motion.a
        href={`/blog/${post.id}`}
        ref={ref}
        className="group cursor-pointer md:max-w-xs min-[70rem]:max-w-[62.25rem] min-[70rem]:col-span-full"
        initial={{
          opacity: 0,
          y: 30,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 20,
          filter: isInView ? "blur(0px)" : "blur(5px)",
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="hidden min-[70rem]:flex">
          <div className="rounded-l-4xl overflow-hidden grow">
            <motion.div className="relative aspect-[17/9]">
              <Image
                src={post.title_image || "/placeholder.svg?height=400&width=600"}
                alt={post.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-all duration-1000"
                fill
              />
            </motion.div>
          </div>
          <div className="rounded-r-4xl bg-white space-y-4 px-8 py-8 flex flex-col w-80">
            <div className="flex space-x-2">
              <h4 className="text-muted-foreground font-bold text-xs min-[70rem]:text-sm">{post?.category?.name ?? "인사이트"}</h4>{" "}
            </div>

            <h3 className="text-xl min-[70rem]:text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-500 transition-colors duration-500 grow">
              {post.title}
            </h3>

            <div className="flex flex-col space-y-2 justify-between">
              <span className="text-xs min-[70rem]:text-base font-semibold text-gray-500">
                {post.published_at ? dayjs(post.published_at).format("LL") : ""}
              </span>
              <div className="flex items-center space-x-1 text-xs min-[70rem]:text-sm font-bold text-slate-500">
                <Clock9 className="!size-4" strokeWidth={2.5} />
                <span>{estimateReadingTime(post.content)} min</span>
              </div>
            </div>
          </div>
        </div>
        <div className="block min-[70rem]:hidden">
          <div className="rounded-t-3xl min-[70rem]:rounded-t-4xl overflow-hidden">
            <motion.div className="relative aspect-[16/9]">
              <Image
                src={post.title_image || "/placeholder.svg?height=400&width=600"}
                alt={post.title}
                className="object-cover group-hover:scale-105 transition-all duration-1000"
                fill
              />
            </motion.div>
          </div>

          <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 py-8 flex flex-col h-44 min-[70rem]:h-52">
            <div className="flex space-x-2">
              <h4 className="text-muted-foreground font-bold text-xs min-[70rem]:text-sm">{post?.category?.name ?? "인사이트"}</h4>{" "}
            </div>

            <h3 className="text-xl min-[70rem]:text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-500 transition-colors duration-500 grow">
              {post.title}
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs min-[70rem]:text-base font-semibold text-gray-500">
                {post.published_at ? dayjs(post.published_at).format("LL") : ""}
              </span>
              <div className="flex items-center space-x-1 text-xs min-[70rem]:text-sm font-bold text-slate-500">
                <Clock9 className="!size-4" strokeWidth={2.5} />
                <span>{estimateReadingTime(post.content)} min</span>
              </div>
            </div>
          </div>
        </div>
      </motion.a>
    );
  }

  return (
    <motion.a
      ref={ref}
      href={`/blog/${post.id}`}
      className="group cursor-pointer"
      initial={{
        opacity: 0,
        y: 30,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20,
        filter: isInView ? "blur(0px)" : "blur(5px)",
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="rounded-t-3xl min-[70rem]:rounded-t-4xl overflow-hidden">
        <motion.div className="relative aspect-[16/9]">
          <Image
            src={post.title_image || "/placeholder.svg?height=400&width=600"}
            alt={post.title}
            className="object-cover group-hover:scale-105 transition-all duration-1000"
            fill
          />
        </motion.div>
      </div>

      <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 py-8 flex flex-col h-44 min-[70rem]:h-52">
        <div className="flex space-x-2">
          <h4 className="text-muted-foreground font-bold text-xs min-[70rem]:text-sm">{post?.category?.name ?? "인사이트"}</h4>{" "}
        </div>

        <h3 className="text-xl min-[70rem]:text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-500 transition-colors duration-500 grow">
          {post.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xs min-[70rem]:text-base font-semibold text-gray-500">{post.published_at ? dayjs(post.published_at).format("LL") : ""}</span>
          <div className="flex items-center space-x-1 text-xs min-[70rem]:text-sm font-bold text-slate-500">
            <Clock9 className="!size-4" strokeWidth={2.5} />
            <span>{estimateReadingTime(post.content)} min</span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
