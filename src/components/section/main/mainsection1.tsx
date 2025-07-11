"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function MainSection1() {
  const [title, setTitle] = useState<string>("");
  const [tab, setTab] = useState<boolean>(true);

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col gap-8 items-center justify-center w-full h-full">
        {/* Main Control */}
        <motion.div className="bg-white/75 p-[4px] rounded-full inline-flex items-center relative shadow-[0_4px_32px_rgba(0,0,0,0.3)]">
          <div className="relative">
            <motion.button
              onClick={() => setTab(true)}
              className={`relative z-10 px-4 py-1 text-sm flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap ${
                tab ? "text-white" : "text-black"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              메인
              {tab && (
                <motion.div
                  layoutId="projectTabBackground"
                  className="absolute inset-0 bg-black rounded-full shadow-sm -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.button>
          </div>
          <div className="relative">
            <motion.a
              onClick={() => setTab(false)}
              className={`relative z-10 px-4 py-1 text-sm flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap ${
                !tab ? "text-white" : "text-black"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/service/dashboard"
            >
              대시보드
              {!tab && (
                <motion.div
                  layoutId="projectTabBackground"
                  className="absolute inset-0 bg-black rounded-full shadow-sm -z-10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.a>
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {tab ? (
            // Main CTA
            <motion.div
              key="main-cta"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:min-w-xl flex w-fit h-fit flex-col z-20 items-center justify-center rounded-2xl overflow-hidden"
            >
              <div className="w-full px-4 md:px-16 pb-10 pt-2 flex flex-col gap-3 items-center justify-center">
                <div className="w-full flex flex-col col gap-1 md:gap-2 items-center justify-center text-background text-center">
                  <h1 className="text-2xl xl:text-7xl font-extrabold tracking-normal">Web, App 개발</h1>
                  <h1 className="text-2xl xl:text-7xl font-extrabold tracking-normal">
                    <span className="font-black tracking-tighter">Fellows℠</span>에서 앞서나가세요
                  </h1>
                </div>
                <h4 className="scroll-m-20 text-xs md:text-base text-center font-medium md:font-semibold leading-normal text-muted md:mt-5">
                  최대 40% 더 적은 비용으로 주목받는 페이지를 만들어보세요.
                  <span className="text-[#e64646] font-black">*</span>
                  <br />
                  원하는 사이트의 제목을 입력하고 AI 견적서를 받아보세요.
                </h4>
                <div className="mt-6 w-full relative flex items-center justify-start p-1 rounded-full focus:ring-2 bg-white/50 border border-white/60 max-w-lg">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="사이트 제목을 입력하세요"
                    className="grow bg-transparent border-none focus-visible:ring-0 outline-none shadow-none h-8 md:h-8.5"
                  />
                  <Link href={`/service/project/new?title=${title}`}>
                    <InteractiveHoverButton className="h-8 md:h-8.5 text-sm font-semibold rounded-full">시작하기</InteractiveHoverButton>
                  </Link>
                </div>
              </div>
              <div className="w-full flex h-10 items-center justify-center px-4 text-xs text-muted font-light">
                <p>
                  <span className="text-[#e64646] font-black">*</span> 글로벌 웹 에이전시를 통해 낮은 개발 가격 제공
                </p>
              </div>
            </motion.div>
          ) : (
            // Dashboard Loading
            <motion.div
              key="dashboard-loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:min-w-xl flex w-fit h-fit flex-col z-20 items-center justify-center rounded-2xl"
            >
              <div className="w-full px-6 md:px-16 py-16 flex flex-col gap-2 items-center justify-center">
                <Loader2 className="!size-6 text-muted animate-spin" />
                <div className="flex text-center">
                  <p className="text-xs text-muted">불러오는 중입니다...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
