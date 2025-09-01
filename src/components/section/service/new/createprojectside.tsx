"use client";

import { motion } from "framer-motion";
import { FcDocument } from "react-icons/fc";

export default function ProposalCreationScreen() {
  return (
    <div className="sticky py-16 top-16 w-full bg-white flex flex-col items-start justify-start">
      <div className="w-full space-y-6">
        {/* Document with Magnifying Glass */}
        <div className="flex mb-8">
          <div className="relative">
            {/* Document Icon */}
            <div className="text-6xl">
              <FcDocument />
            </div>

            {/* Animated Apple-style Magnifying Glass */}
            <motion.div
              animate={{
                x: [0, -10, 20, -5, 15, 0, -15, 10, -8, 0],
                y: [0, -15, 5, 20, -10, 0, -5, -20, 10, 0],
                rotate: [0, 0, 25, -15, 30, -10, 20, -25, 15, 0],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer ring with gradient */}
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5a5a5" />
                    <stop offset="100%" stopColor="#585858" />
                  </linearGradient>
                  <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#F2F2F7" stopOpacity="0.4" />
                  </linearGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Main circle */}
                <circle cx="13" cy="13" r="9" fill="url(#glassGradient)" stroke="url(#ringGradient)" strokeWidth="2" filter="url(#shadow)" />

                {/* Inner highlight */}
                <circle cx="13" cy="13" r="7" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />

                {/* Handle */}
                <path d="M20.5 20.5L27.5 27.5" stroke="url(#ringGradient)" strokeWidth="3" strokeLinecap="round" filter="url(#shadow)" />

                {/* Handle highlight */}
                <path d="M20.5 20.5L27.5 27.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />

                {/* Lens reflection */}
                <ellipse cx="10" cy="10" rx="3" ry="4" fill="#FFFFFF" fillOpacity="0.3" transform="rotate(-30 10 10)" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Main Text */}
        <div className="text space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            맞춤 제안서를
            <br />
            만들고 있어요
          </h1>

          <p className="text-gray-600 text-sm leading-relaxed">
            입력된 내용을 분석하여
            <br />
            사업에 맞춘 서비스를 찾고 있어요.
          </p>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-2">
          {["#payment", "#service", "#important", "#extract", "#text"].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-500 text-xs font-semibold rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col space-y-2">
          <div>1. 필수 정보 입력</div>
          <div>2. 추가 정보 입력</div>
        </div>
      </div>
    </div>
  );
}
