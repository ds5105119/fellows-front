"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function BlogNavigation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeTab, setActiveTab] = useState("전체");

  const tabs = ["전체", "인사이트", "고객 사례", "가이드북"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : -20,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="bg-zinc-200 p-1 md:p-1.5 rounded-full inline-flex relative">
        {tabs.map((tab) => (
          <div key={tab} className="relative">
            <motion.button
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium rounded-full transition-colors whitespace-nowrap ${
                activeTab === tab ? "text-white" : "text-black"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-black rounded-full shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
