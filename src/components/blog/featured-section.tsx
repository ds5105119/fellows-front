"use client";

import { motion, useInView } from "framer-motion";
import { usePosts } from "@/hooks/fetch/blog";
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import FeaturedSectionSkeleton from "./featured-section-skeleton";
import HeatmapBackground from "@/components/resource/heatmapbackground";
import Color from "color";
import RandomLines from "../resource/randomlines";

function enforceMaximumLightness(hex: string, maxLightness = 40): string {
  const color = Color(hex);
  const { l } = color.hsl().object();

  if (l > maxLightness) {
    return color.hsl().lightness(maxLightness).hex();
  }

  return hex;
}

export function FeaturedSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -100px 0px",
  });

  const swr = usePosts(3);
  const posts = swr.data?.flatMap((i) => i.items) ?? [];

  const featuredPost = posts[0];

  const sidebarPost1 = posts[1];
  const sidebarPost1ImageRef = useRef(null);
  const [sidebarPost1ImageRefHex, setSidebarPost1ImageRefHex] = useState("#ffffff");
  const [sidebarPost1ImageRefIsDark, setSidebarPost1ImageRefIsDark] = useState(false);

  const sidebarPost2 = posts[2];
  const sidebarPost2ImageRef = useRef(null);
  const [sidebarPost2ImageRefHex, setSidebarPost2ImageRefHex] = useState("#ffffff");
  const [sidebarPost2ImageRefIsDark, setSidebarPost2ImageRefIsDark] = useState(false);

  useEffect(() => {
    const fac = new FastAverageColor();
    if (sidebarPost1ImageRef.current) {
      fac.getColorAsync(sidebarPost1ImageRef.current).then((color) => {
        setSidebarPost1ImageRefHex(color.hex);
        setSidebarPost1ImageRefIsDark(color.isDark);
      });
    }
  }, [sidebarPost1ImageRef, sidebarPost1]);

  useEffect(() => {
    const fac = new FastAverageColor();
    if (sidebarPost2ImageRef.current) {
      fac.getColorAsync(sidebarPost2ImageRef.current).then((color) => {
        setSidebarPost2ImageRefHex(color.hex);
        setSidebarPost2ImageRefIsDark(color.isDark);
      });
    }
  }, [sidebarPost2ImageRef, sidebarPost2]);

  return (
    <motion.section ref={ref} className="flex flex-col">
      {/* Section Header */}
      <div className="col-span-full flex items-center justify-between mb-6 md:mb-9">
        <div className="space-y-2">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">최신 글</h2>
        </div>
      </div>

      {swr.isLoading && <FeaturedSectionSkeleton />}

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 h-fit">
        {/* Main Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.id}`} className="lg:col-span-4">
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

              <div className="rounded-b-3xl min-[70rem]:rounded-b-4xl bg-white space-y-4 px-8 pt-8 flex flex-col">
                <div className="flex space-x-2">
                  <h4 className="text-muted-foreground font-bold text-xs min-[70rem]:text-sm">{featuredPost?.category?.name ?? "인사이트"}</h4>
                </div>

                <h3 className="text-xl min-[70rem]:text-3xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-500 transition-colors duration-500 grow">
                  {featuredPost.title}
                </h3>

                <h4 className="text-base min-[70rem]:text-xl font-medium text-muted-foreground leading-tight grow">{featuredPost.summary}</h4>
              </div>
            </motion.article>
          </Link>
        )}

        {/* Sidebar Posts */}
        <div className="lg:col-span-2 space-y-8 w-full h-full min-h-0">
          {sidebarPost1 && (
            <motion.article
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
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group cursor-pointer overflow-hidden w-full aspect-[4/3] rounded-3xl min-[70rem]:rounded-4xl"
            >
              <div className="relative h-full overflow-hidden p-8 flex flex-col justify-between">
                <Image
                  ref={sidebarPost1ImageRef}
                  src={sidebarPost1.title_image || "/placeholder.svg?height=80&width=80"}
                  alt={sidebarPost1.title}
                  className="sr-only"
                  width={80}
                  height={80}
                  crossOrigin="anonymous"
                  priority
                />

                <div
                  className="absolute inset-0 -z-20"
                  style={{
                    backgroundColor: sidebarPost1ImageRefIsDark ? "#222" : "#f5f2e3",
                    opacity: 0.8,
                  }}
                />

                <div className="absolute inset-0 -z-10 group-hover:scale-115 duration-750">
                  <RandomLines strokeWidth={0.6} strokeOpacity={0.7} strokeColor={enforceMaximumLightness(sidebarPost1ImageRefHex, 50)} />
                </div>

                <div className="flex flex-col space-y-2 md:space-y-3">
                  <div
                    className={cn(
                      "rounded-full py-1 px-4.5 font-medium w-fit flex items-center space-x-2 border",
                      sidebarPost1ImageRefIsDark ? "border-white text-white" : "border-slate-900 text-slate-900"
                    )}
                  >
                    {sidebarPost1.category?.name && (
                      <>
                        <div className={cn("size-1 rounded-full", sidebarPost1ImageRefIsDark ? "bg-white" : "bg-slate-900")} />
                        <div>{sidebarPost1.category.name}</div>
                      </>
                    )}
                  </div>
                  <p
                    className={cn(
                      "md:hidden mt-1 md:mt-2 font-semibold line-clamp-2 text-base md:text-lg leading-tight",
                      sidebarPost1ImageRefIsDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {sidebarPost1.summary}
                  </p>
                  <p
                    className={cn(
                      "font-extrabold line-clamp-2 text-xl md:text-2xl leading-tight",
                      sidebarPost1ImageRefIsDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {sidebarPost1.title}
                  </p>
                </div>
                <Link href={`/blog/${sidebarPost1.id}`} className="flex justify-end">
                  <div className={cn("flex items-center space-x-2", sidebarPost1ImageRefIsDark ? "text-white" : "text-slate-900")}>
                    <p>더 읽어보기</p>
                    <ArrowRight />
                  </div>
                </Link>
              </div>
            </motion.article>
          )}

          {sidebarPost2 && (
            <motion.article
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
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group cursor-pointer overflow-hidden w-full aspect-[4/3] md:aspect-[4/4] rounded-3xl min-[70rem]:rounded-4xl"
            >
              <div className="relative h-full overflow-hidden p-8 flex flex-col justify-between">
                <Image
                  ref={sidebarPost2ImageRef}
                  src={sidebarPost2.title_image || "/placeholder.svg?height=80&width=80"}
                  alt={sidebarPost2.title}
                  className="sr-only"
                  width={80}
                  height={80}
                  crossOrigin="anonymous"
                  priority
                />

                <div
                  className="absolute inset-0 -z-20"
                  style={{
                    backgroundColor: sidebarPost2ImageRefHex,
                    opacity: 0.8,
                  }}
                />

                <div className="absolute inset-0 -z-10 flex items-center justify-center group-hover:scale-115 duration-750">
                  <div style={{ opacity: 0.9 }}>
                    <HeatmapBackground color={enforceMaximumLightness(sidebarPost2ImageRefHex)} />
                  </div>
                </div>

                <div className="flex flex-col space-y-2 md:space-y-3">
                  <div
                    className={cn(
                      "rounded-full py-1 px-4.5 font-medium w-fit flex items-center space-x-2 border",
                      sidebarPost2ImageRefIsDark ? "border-white text-white" : "border-slate-900 text-slate-900"
                    )}
                  >
                    {sidebarPost2.category?.name && (
                      <>
                        <div className={cn("size-1 rounded-full", sidebarPost2ImageRefIsDark ? "bg-white" : "bg-slate-900")} />
                        <div>{sidebarPost2.category.name}</div>
                      </>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-1 md:mt-2 font-semibold line-clamp-2 text-base md:text-lg leading-tight",
                      sidebarPost2ImageRefIsDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {sidebarPost2.summary}
                  </p>
                  <p
                    className={cn(
                      "font-extrabold line-clamp-2 text-xl md:text-2xl leading-tight",
                      sidebarPost2ImageRefIsDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {sidebarPost2.title}
                  </p>
                </div>
                <Link href={`/blog/${sidebarPost2.id}`} className="flex justify-end">
                  <div className={cn("flex items-center space-x-2", sidebarPost2ImageRefIsDark ? "text-white" : "text-slate-900")}>
                    <p>더 읽어보기</p>
                    <ArrowRight />
                  </div>
                </Link>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </motion.section>
  );
}
