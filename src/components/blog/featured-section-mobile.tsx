"use client";

import { motion } from "framer-motion";
import { usePosts } from "@/hooks/fetch/blog";
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import Color from "color";
import HeatmapBackground from "@/components/resource/heatmapbackground";
import RandomLines from "@/components/resource/randomlines";
import Autoplay from "embla-carousel-autoplay";
import { BlogPostDtoType } from "@/@types/service/blog";

function enforceMaximumLightness(hex: string, maxLightness = 40): string {
  const color = Color(hex);
  const { l } = color.hsl().object();

  if (l > maxLightness) {
    return color.hsl().lightness(maxLightness).hex();
  }

  return hex;
}

function BlogPostSkeleton() {
  return (
    <article className="group cursor-pointer h-full">
      <div className="rounded-3xl overflow-hidden h-full">
        <div className="relative aspect-[4/5] h-full">
          <div className="h-full w-full bg-gray-200 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      </div>
    </article>
  );
}

export function FeaturedSectionMobile() {
  const ref = useRef(null);

  const swr = usePosts(3);
  const posts = swr.data?.flatMap((i) => i.items) ?? [];

  const featuredPost = posts[0];
  const sidebarPost1 = posts[1];
  const sidebarPost2 = posts[2];

  // Color extraction for posts
  const sidebarPost1ImageRef = useRef<HTMLImageElement | null>(null);
  const [sidebarPost1ImageRefHex, setSidebarPost1ImageRefHex] = useState("#ffffff");
  const [sidebarPost1ImageRefIsDark, setSidebarPost1ImageRefIsDark] = useState(false);

  const sidebarPost2ImageRef = useRef<HTMLImageElement | null>(null);
  const [sidebarPost2ImageRefHex, setSidebarPost2ImageRefHex] = useState("#ffffff");
  const [sidebarPost2ImageRefIsDark, setSidebarPost2ImageRefIsDark] = useState(false);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, setCount, setCurrent]);

  const CarouselPostItem = ({ post, type }: { post: BlogPostDtoType; type: "featured" | "sidebar1" | "sidebar2" }) => {
    if (type === "featured") {
      return (
        <Link href={`/blog/${post.id}`} className="block">
          <article className="group cursor-pointer h-full">
            <div className="rounded-3xl overflow-hidden h-full">
              <div className="relative aspect-[4/5] h-full">
                <Image
                  src={post.title_image || "/placeholder.svg?height=600&width=400"}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-all duration-1000"
                  fill
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 rounded-full size-10 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ArrowUpRight strokeWidth={2.5} className="text-white size-5" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                  <div className="flex space-x-2 mb-3">
                    <span className="text-white/90 font-bold text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {post?.category?.name ?? "인사이트"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold leading-tight mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-white/90 leading-tight line-clamp-2">{post.summary}</p>
                </div>
              </div>
            </div>
          </article>
        </Link>
      );
    }

    if (type === "sidebar1") {
      return (
        <Link href={`/blog/${post.id}`} className="block">
          <article className="group cursor-pointer h-full">
            <div className="rounded-3xl overflow-hidden h-full">
              <div className="relative aspect-[4/5] h-full p-6 flex flex-col justify-between">
                <div
                  className="absolute inset-0 -z-20"
                  style={{
                    backgroundColor: sidebarPost1ImageRefIsDark ? "#1a1a1a" : "#f8f6f0",
                    opacity: 0.95,
                  }}
                />
                <div className="absolute inset-0 -z-10 group-hover:scale-110 transition-transform duration-700">
                  <RandomLines strokeWidth={1} strokeOpacity={0.5} strokeColor={enforceMaximumLightness(sidebarPost1ImageRefHex, 45)} />
                </div>

                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t",
                    sidebarPost1ImageRefIsDark ? "from-white/20 via-white/5 to-transparent" : "from-black/20 via-black/5 to-transparent"
                  )}
                />
                <div
                  className={cn(
                    "absolute top-4 right-4 rounded-full size-10 backdrop-blur-sm flex items-center justify-center",
                    sidebarPost1ImageRefIsDark ? "bg-white/20" : "bg-black/10"
                  )}
                >
                  <ArrowUpRight strokeWidth={2.5} className={cn("size-5", sidebarPost1ImageRefIsDark ? "text-white" : "text-black")} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7 flex flex-col space-y-3">
                  <span
                    className={cn(
                      "font-bold text-xs backdrop-blur-sm px-3 py-1.5 rounded-full w-fit",
                      sidebarPost1ImageRefIsDark ? "text-black/90 bg-white/50" : "text-white/90 bg-black/50"
                    )}
                  >
                    {post?.category?.name ?? "인사이트"}
                  </span>
                  <h3 className={cn("font-extrabold text-2xl leading-tight line-clamp-2", sidebarPost1ImageRefIsDark ? "text-white" : "text-slate-900")}>
                    {post.title}
                  </h3>
                  <p className={cn("font-medium text-base leading-tight line-clamp-2", sidebarPost1ImageRefIsDark ? "text-white/80" : "text-slate-700")}>
                    {post.summary}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </Link>
      );
    }

    // sidebar2 - HeatmapBackground
    return (
      <Link href={`/blog/${post.id}`} className="block">
        <article className="group cursor-pointer h-full">
          <div className="rounded-3xl overflow-hidden h-full">
            <div className="relative aspect-[4/5] h-full p-6 flex flex-col justify-between">
              <div
                className="absolute inset-0 -z-20"
                style={{
                  backgroundColor: sidebarPost2ImageRefHex,
                  opacity: 0.95,
                }}
              />
              <div className="absolute inset-0 -z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 rounded-3xl overflow-hidden">
                <div style={{ opacity: 0.7 }}>
                  <HeatmapBackground columns={30} rows={30} color={enforceMaximumLightness(sidebarPost2ImageRefHex, 35)} />
                </div>
              </div>

              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t",
                  sidebarPost2ImageRefIsDark ? "from-white/20 via-white/5 to-transparent" : "from-black/20 via-black/5 to-transparent"
                )}
              />
              <div
                className={cn(
                  "absolute top-4 right-4 rounded-full size-10 backdrop-blur-sm flex items-center justify-center",
                  sidebarPost2ImageRefIsDark ? "bg-white/20" : "bg-black/10"
                )}
              >
                <ArrowUpRight strokeWidth={2.5} className={cn("size-5", sidebarPost2ImageRefIsDark ? "text-white" : "text-black")} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7 flex flex-col space-y-3">
                <span
                  className={cn(
                    "font-bold text-xs backdrop-blur-sm px-3 py-1.5 rounded-full w-fit",
                    sidebarPost2ImageRefIsDark ? "text-black/90 bg-white/50" : "text-white/90 bg-black/50"
                  )}
                >
                  {post?.category?.name ?? "인사이트"}
                </span>
                <h3 className={cn("font-extrabold text-2xl leading-tight line-clamp-2", sidebarPost2ImageRefIsDark ? "text-white" : "text-slate-900")}>
                  {post.title}
                </h3>
                <p className={cn("font-medium text-base leading-tight line-clamp-2", sidebarPost2ImageRefIsDark ? "text-white/80" : "text-slate-700")}>
                  {post.summary}
                </p>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  };

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
          priority
        />
      )}

      {/* Section Header */}
      <div className="px-6 flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900">최신 글</h2>
        </div>
      </div>

      {/* Mobile Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full pl-6"
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 10000,
          }),
        ]}
      >
        <CarouselContent className="-ml-4">
          <CarouselItem className="pl-4 basis-[92%]">
            {featuredPost ? <CarouselPostItem post={featuredPost} type="featured" /> : <BlogPostSkeleton />}
          </CarouselItem>
          <CarouselItem className="pl-4 basis-[92%]">
            {sidebarPost1 ? <CarouselPostItem post={sidebarPost1} type="sidebar1" /> : <BlogPostSkeleton />}
          </CarouselItem>
          <CarouselItem className="pl-4 basis-[92%]">
            {sidebarPost2 ? <CarouselPostItem post={sidebarPost2} type="sidebar2" /> : <BlogPostSkeleton />}
          </CarouselItem>
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="pl-2 pr-8 flex justify-between items-center mt-5">
          <div className="flex space-x-3.5">
            {[...Array(count).keys()].map((index) => (
              <div key={index} className={cn("w-2 h-2 rounded-full", index === current ? "bg-slate-500" : "bg-slate-300")} />
            ))}
          </div>
          <div className="flex space-x-2">
            <CarouselPrevious className="relative translate-y-0 left-0 size-11 bg-black/5 backdrop-blur-sm border-0" />
            <CarouselNext className="relative translate-y-0 right-0 size-11 bg-black/5 backdrop-blur-sm border-0" />
          </div>
        </div>
      </Carousel>
    </motion.section>
  );
}
