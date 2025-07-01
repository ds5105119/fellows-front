"use client";

import { motion, useInView } from "framer-motion";
import { usePosts } from "@/hooks/fetch/blog";
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Color from "color";
import FeaturedSectionSkeleton from "./featured-section-skeleton";
import HeatmapBackground from "@/components/resource/heatmapbackground";
import RandomLines from "@/components/resource/randomlines";

function enforceMaximumLightness(hex: string, maxLightness = 40): string {
  const color = Color(hex);
  const { l } = color.hsl().object();

  if (l > maxLightness) {
    return color.hsl().lightness(maxLightness).hex();
  }

  return hex;
}

export function FeaturedSectionDesktop() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -100px 0px",
  });

  const swr = usePosts(3);
  const posts = swr.data?.flatMap((i) => i.items) ?? [];

  const featuredPost = posts[0];
  const sidebarPost1 = posts[1];
  const sidebarPost2 = posts[2];

  // Color extraction for sidebar posts
  const sidebarPost1ImageRef = useRef<HTMLImageElement | null>(null);
  const [sidebarPost1ImageRefHex, setSidebarPost1ImageRefHex] = useState("#ffffff");
  const [sidebarPost1ImageRefIsDark, setSidebarPost1ImageRefIsDark] = useState(false);

  const sidebarPost2ImageRef = useRef<HTMLImageElement | null>(null);
  const [sidebarPost2ImageRefHex, setSidebarPost2ImageRefHex] = useState("#ffffff");
  const [sidebarPost2ImageRefIsDark, setSidebarPost2ImageRefIsDark] = useState(false);

  useEffect(() => {
    const fac = new FastAverageColor();
    const imgEl = sidebarPost1ImageRef.current;

    if (!imgEl) return;

    const handleColorExtract = () => {
      fac.getColorAsync(imgEl).then((color) => {
        setSidebarPost1ImageRefHex(color.hex);
        setSidebarPost1ImageRefIsDark(color.isDark);
      });
    };

    if (imgEl.complete && imgEl.naturalWidth !== 0) {
      handleColorExtract();
    } else {
      imgEl.onload = handleColorExtract;
    }

    return () => {
      imgEl.onload = null;
    };
  }, [sidebarPost1ImageRef.current, sidebarPost1]);

  useEffect(() => {
    const fac = new FastAverageColor();
    const imgEl = sidebarPost2ImageRef.current;

    if (!imgEl) return;

    const handleColorExtract = () => {
      fac.getColorAsync(imgEl).then((color) => {
        setSidebarPost2ImageRefHex(color.hex);
        setSidebarPost2ImageRefIsDark(color.isDark);
      });
    };

    if (imgEl.complete && imgEl.naturalWidth !== 0) {
      handleColorExtract();
    } else {
      imgEl.onload = handleColorExtract;
    }

    return () => {
      imgEl.onload = null;
    };
  }, [sidebarPost2ImageRef.current, sidebarPost2]);

  return (
    <motion.section ref={ref} className="flex flex-col">
      {/* Hidden images for color extraction */}
      {sidebarPost1 && (
        <Image
          ref={sidebarPost1ImageRef}
          src={sidebarPost1.title_image || "/placeholder.svg"}
          alt={sidebarPost1.title}
          className="sr-only"
          width={80}
          height={80}
          crossOrigin="anonymous"
          unoptimized
          priority
        />
      )}
      {sidebarPost2 && (
        <Image
          ref={sidebarPost2ImageRef}
          src={sidebarPost2.title_image || "/placeholder.svg"}
          alt={sidebarPost2.title}
          className="sr-only"
          width={80}
          height={80}
          crossOrigin="anonymous"
          unoptimized
          priority
        />
      )}

      {/* Section Header */}
      <div className="col-span-full flex items-center justify-between mb-6 lg:mb-9">
        <div className="space-y-2">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">최신 글</h2>
        </div>
      </div>

      {swr.isLoading && <FeaturedSectionSkeleton />}

      {/* Desktop Grid Layout */}
      <div className="grid grid-cols-6 gap-8 h-fit">
        {/* Main Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.id}`} className="col-span-4">
            <motion.article
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
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="rounded-3xl xl:rounded-4xl overflow-hidden duration-500">
                <motion.div className="relative aspect-[4/3]">
                  <Image
                    src={featuredPost.title_image || "/placeholder.svg?height=400&width=600"}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-all duration-1000"
                    fill
                  />
                  <div className="absolute bottom-6 right-6 rounded-full size-14 bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/90 transition-colors">
                    <ArrowUpRight strokeWidth={2.5} className="text-slate-900" />
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4 px-5 pt-6 flex flex-col">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-sm py-1">{featuredPost?.category?.name ?? "인사이트"}</span>
                  <span className="text-muted-foreground text-sm">
                    {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString("ko-KR") : "발행 전"}
                  </span>
                </div>

                <h3 className="text-2xl xl:text-3xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors duration-500">
                  {featuredPost.title}
                </h3>

                <p className="text-lg xl:text-xl font-medium text-muted-foreground leading-relaxed">{featuredPost.summary}</p>
              </div>
            </motion.article>
          </Link>
        )}

        {/* Sidebar Posts */}
        <div className="col-span-2 flex flex-col space-y-8 w-full h-full min-h-0">
          {sidebarPost1 && (
            <Link href={`/blog/${sidebarPost1.id}`}>
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
                  delay: 0.2,
                }}
                className="group cursor-pointer overflow-hidden w-full aspect-[4/3] rounded-3xl xl:rounded-4xl"
              >
                <div className="relative h-full overflow-hidden p-8 flex flex-col justify-between">
                  <div
                    className="absolute inset-0 -z-20"
                    style={{
                      backgroundColor: sidebarPost1ImageRefIsDark ? "#1a1a1a" : "#f8f6f0",
                      opacity: 0.9,
                    }}
                  />

                  <div className="absolute inset-0 -z-10 group-hover:scale-110 transition-transform duration-700">
                    <RandomLines strokeWidth={0.6} strokeOpacity={0.6} strokeColor={enforceMaximumLightness(sidebarPost1ImageRefHex, 50)} />
                  </div>

                  <div className="flex flex-col space-y-3">
                    <div
                      className={cn(
                        "rounded-full py-1.5 px-4 font-semibold w-fit flex items-center space-x-2 border text-sm",
                        sidebarPost1ImageRefIsDark ? "border-white/30 text-white bg-white/10" : "border-slate-900/30 text-slate-900 bg-white/50"
                      )}
                    >
                      {sidebarPost1.category?.name && (
                        <>
                          <div className={cn("size-1.5 rounded-full", sidebarPost1ImageRefIsDark ? "bg-white" : "bg-slate-900")} />
                          <span>{sidebarPost1.category.name}</span>
                        </>
                      )}
                    </div>

                    <h3
                      className={cn(
                        "font-extrabold text-xl xl:text-2xl leading-tight line-clamp-2",
                        sidebarPost1ImageRefIsDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {sidebarPost1.title}
                    </h3>
                  </div>

                  <div className="flex justify-end">
                    <div className={cn("flex items-center space-x-2 font-semibold", sidebarPost1ImageRefIsDark ? "text-white" : "text-slate-900")}>
                      <span>더 읽어보기</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          )}

          {sidebarPost2 && (
            <Link href={`/blog/${sidebarPost2.id}`}>
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
                  delay: 0.4,
                }}
                className="group cursor-pointer overflow-hidden w-full aspect-[4/3] xl:aspect-[4/4] rounded-3xl xl:rounded-4xl"
              >
                <div className="relative h-full overflow-hidden p-8 flex flex-col justify-between">
                  <div
                    className="absolute inset-0 -z-20"
                    style={{
                      backgroundColor: sidebarPost2ImageRefHex,
                      opacity: 0.9,
                    }}
                  />

                  <div className="absolute inset-0 -z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <div style={{ opacity: 0.8 }}>
                      <HeatmapBackground color={enforceMaximumLightness(sidebarPost2ImageRefHex, 35)} />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <div
                      className={cn(
                        "rounded-full py-1.5 px-4 font-semibold w-fit flex items-center space-x-2 border text-sm",
                        sidebarPost2ImageRefIsDark ? "border-white/30 text-white bg-white/10" : "border-slate-900/30 text-slate-900 bg-white/50"
                      )}
                    >
                      {sidebarPost2.category?.name && (
                        <>
                          <div className={cn("size-1.5 rounded-full", sidebarPost2ImageRefIsDark ? "bg-white" : "bg-slate-900")} />
                          <span>{sidebarPost2.category.name}</span>
                        </>
                      )}
                    </div>

                    <h3
                      className={cn(
                        "font-extrabold text-xl xl:text-2xl leading-tight line-clamp-2",
                        sidebarPost2ImageRefIsDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      {sidebarPost2.title}
                    </h3>

                    <p className={cn("font-medium text-base leading-tight line-clamp-2", sidebarPost2ImageRefIsDark ? "text-white/80" : "text-slate-700")}>
                      {sidebarPost2.summary}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <div className={cn("flex items-center space-x-2 font-semibold", sidebarPost2ImageRefIsDark ? "text-white" : "text-slate-900")}>
                      <span>더 읽어보기</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          )}
        </div>
      </div>
    </motion.section>
  );
}
