"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowDownIcon, ArrowUpRight, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MainSection2Dialog() {
  const [isKorean, setIsKorean] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleLanguage = () => {
    setIsAnimating(true);
    setIsKorean(!isKorean);

    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const embedUrl = isKorean
    ? "https://embed.figma.com/slides/zUxexfMaoALzAzayStpXzB/Fellows-Solutions---ko?node-id=1-352&embed-host=share"
    : "https://embed.figma.com/slides/bpMstfrj6j9VIyObbWAcNu/Fellows-Solutions---en?node-id=1-352&embed-host=share";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center md:px-3 md:py-1.5 md:rounded-sm md:hover:bg-muted select-none">
          <ArrowUpRight className="!size-7 text-blue-500" />
          <p className="text-lg md:text-xl font-semibold text-blue-500">서비스 소개서</p>
        </div>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayClassName="backdrop-blur-sm"
        className="drop-shadow-white/10 drop-shadow-2xl p-0 w-[calc(100%-32px)] max-w-[calc(100%-32px)] sm:w-[calc(100%-32px)] min-w-[calc(100%-32px)] lg:min-w-5xl xl:min-w-6xl lg:h-fit rounded-3xl overflow-hidden scrollbar-hide focus-visible:ring-0"
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">서비스 소개서 창</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <div className="w-full h-full flex flex-col">
          <div className="sticky top-0 w-full px-3.5 h-14 border-b border-b-muted bg-white font-bold grid grid-cols-3 items-center">
            <div className="h-full flex items-center justify-start">
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="focus-visible:ring-0">
                  <ArrowDownIcon />
                </Button>
              </DialogClose>
            </div>
            <div className="h-full flex items-center justify-center">
              <motion.button
                onClick={toggleLanguage}
                className="relative overflow-hidden px-8 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm font-medium focus-visible:ring-0 focus-visible:outline-none transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isAnimating ? 0.8 : 0,
                  }}
                  whileHover={{ opacity: 0.3 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isKorean ? "korean" : "english"}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    {isKorean ? "Korean" : "English"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
            <div className="h-full flex items-center justify-end">
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="focus-visible:ring-0">
                  <XIcon />
                </Button>
              </DialogClose>
            </div>
          </div>
          <div className="w-full overflow-hidden aspect-[9/14] sm:aspect-[18/9]">
            <motion.iframe
              key={embedUrl}
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
