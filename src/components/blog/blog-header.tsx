"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export function BlogHeader() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeTab, setActiveTab] = useState("전체");

  const tabs = ["전체", "인사이트", "고객 사례", "가이드북", "뉴스"];

  return (
    <motion.header
      ref={ref}
      initial={{ opacity: 0, y: -40, filter: "blur(10px)" }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : -40,
        filter: isInView ? "blur(0px)" : "blur(10px)",
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 backdrop-blur-xl"
    >
      <div className="w-full overflow-x-auto flex items-center justify-between scrollbar-hide">
        {/* Navigation Tabs */}
        <div className="relative">
          <div className="flex space-x-2 overflow-y-hidden">
            {tabs.map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => setActiveTab(item)}
                className={`relative px-4 py-2 md:px-6 md:py-3 text-base md:text-lg font-bold transition-all whitespace-nowrap rounded-xl ${
                  activeTab === item ? "text-blue-500 bg-blue-50" : "bg-gray-50 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
