"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { type ComponentPropsWithoutRef, type FC, type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

export const TextReveal: FC<ComponentPropsWithoutRef<"div">> = ({ className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const words = "Fellows는 브랜드, 웹 및 앱 사이트를 제작하는 디지털 에이전시입니다.".split(" ");

  // 이미지 애니메이션 - 텍스트 완료 후 (0.5~1 구간)
  const imageY = useTransform(scrollYProgress, [0.5, 1], ["80%", "0%"]);
  const imageOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div className="sticky top-24 md:top-48 lg:top-64 flex h-[50%] max-w-5xl my-auto items-start bg-transparent py-8 md:py-16 lg:py-20 z-10 px-4 md:px-0">
        <span className={"flex flex-wrap font-bold tracking-wide text-2xl md:text-4xl lg:text-6xl xl:text-8xl space-x-2 md:space-x-5 lg:space-x-10"}>
          {words.map((word, i) => {
            // 텍스트 애니메이션을 0~0.5 구간으로 설정
            const start = (i / words.length) * 0.5;
            const end = start + (1 / words.length) * 0.5;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </span>
      </div>

      {/* 이미지 - 처음부터 일부 보이고 텍스트 완료 후 올라옴 */}
      <motion.div
        className="sticky px-4 md:px-6 bottom-0 left-0 right-0 z-20 flex space-x-4 w-full h-fit bg-white"
        style={{
          y: imageY,
          opacity: imageOpacity,
        }}
      >
        <div className="flex-1 text-3xl font-medium whitespace-pre-wrap leading-tight tracking-tight flex items-center">
          {
            " For 10 years, we've been delivering powerful, tailor-made websites that have helped brands anchor their authority. Now, we’re harnessing this cargo of expertise to propel your projects toward new and exciting horizons."
          }
        </div>
        <div className="grow px-20">
          <AspectRatio ratio={2858 / 1592}>
            <Image src="/design-main.png" className="rounded-lg md:rounded-xl overflow-hidden object-cover" alt="펠로우즈 SaaS" fill />
          </AspectRatio>
        </div>
      </motion.div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  // 스크롤에 따라 opacity 0.2에서 1로 변화
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative mx-0.5 md:mx-1 lg:mx-1.5">
      <motion.span style={{ opacity }} className="block text-black dark:text-white">
        {children}
      </motion.span>
    </span>
  );
};
