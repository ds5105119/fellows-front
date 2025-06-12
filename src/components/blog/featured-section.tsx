"use client";

import { motion, useInView } from "framer-motion";
import { BlogPostDtoType } from "@/@types/service/blog";
import { useRef } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface FeaturedSectionProps {
  posts: BlogPostDtoType[];
}

export function FeaturedSection({ posts }: FeaturedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-100px 0px -100px 0px",
  });

  const featuredPost = posts[0];
  const sidebarPosts = posts.slice(1, posts.length);

  return (
    <motion.section
      ref={ref}
      className="flex flex-col"
      initial={{
        opacity: 0,
        y: 80,
        filter: "blur(12px)",
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 80,
        filter: isInView ? "blur(0px)" : "blur(12px)",
      }}
      exit={{
        opacity: 0,
        y: -80,
        filter: "blur(12px)",
      }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Section Header */}
      <div className="col-span-full flex items-center justify-between mb-6 md:mb-9">
        <div className="space-y-2">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">추천</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Featured Post */}
        <div className="lg:col-span-3">
          <motion.article
            ref={ref}
            className="group cursor-pointer"
            initial={{
              opacity: 0,
              y: 30,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 30,
              filter: isInView ? "blur(0px)" : "blur(8px)",
            }}
            exit={{
              opacity: 0,
              y: -30,
              filter: "blur(8px)",
            }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="rounded-3xl min-[70rem]:rounded-4xl overflow-hidden">
              <motion.div className="relative aspect-[4/3]">
                <Image
                  src={featuredPost.title_image || "/placeholder.svg?height=400&width=600"}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-all duration-1000"
                  fill
                />
                <div className="absolute bottom-6 right-6 rounded-full size-14 bg-white/70 flex items-center justify-center">
                  <ArrowUpRight strokeWidth={2.5} />
                </div>
              </motion.div>
            </div>

            <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 py-8 flex flex-col h-44 min-[70rem]:h-52">
              <div className="flex space-x-2">
                <h4 className="text-muted-foreground font-bold text-xs min-[70rem]:text-sm">{featuredPost?.category?.name ?? "인사이트"}</h4>{" "}
              </div>

              <h3 className="text-xl min-[70rem]:text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-500 transition-colors duration-500 grow">
                {featuredPost.title}
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-xs min-[70rem]:text-base font-semibold text-gray-500">
                  {featuredPost.published_at ? dayjs(featuredPost.published_at).format("LL") : ""}
                </span>
              </div>
            </div>
          </motion.article>
        </div>

        {/* Sidebar Posts */}
        <div className="lg:col-span-2 space-y-6">
          {sidebarPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{
                opacity: 0,
                x: 40,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: isInView ? 1 : 0,
                x: isInView ? 0 : 40,
                filter: isInView ? "blur(0px)" : "blur(6px)",
              }}
              transition={{
                duration: 0.6,
                delay: 0.4 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group cursor-pointer"
            >
              <div className="flex space-x-4 p-4 rounded-3xl transition-all duration-300 glass">
                <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                  <motion.img
                    src={post.title_image || "/placeholder.svg?height=80&width=80"}
                    alt={post.title}
                    className="w-20 h-20 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    {post.category?.name || "인사이트"}
                  </span>
                  <h4 className="font-semibold text-slate-900 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h4>
                  <p className="text-xs text-slate-500">{new Date(post.published_at || new Date()).toLocaleDateString("ko-KR")}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
