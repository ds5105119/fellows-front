"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const features = ["한물 관리", "PG 연동", "결제", "요금제 제작", "알림 발송", "구독 관리", "미납 관리"]

const centerTexts = [
  {
    title: "컵제,",
    subtitle: "그 이상을 다룹니다.",
  },
  {
    title: "STEP이",
    subtitle: "압도적인 이유",
  },
]

interface AnimatedCircleProps {
  className?: string
}

export default function AnimatedCircle({ className = "" }: AnimatedCircleProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [backgroundExpanded, setBackgroundExpanded] = useState(false)
  const [animationCycle, setAnimationCycle] = useState(0)
  const [textColorWhite, setTextColorWhite] = useState(false)
  const [circleSize, setCircleSize] = useState(600)

  useEffect(() => {
    const calculateCircleSize = () => {
      const minSize = 600
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const screenMin = Math.min(screenWidth, screenHeight)

      // Use 80% of screen size but ensure minimum 600px
      const calculatedSize = Math.max(minSize, screenMin * 0.8)
      setCircleSize(calculatedSize)
    }

    calculateCircleSize()
    window.addEventListener("resize", calculateCircleSize)

    return () => window.removeEventListener("resize", calculateCircleSize)
  }, [])

  useEffect(() => {
    const runAnimationCycle = () => {
      // Reset states
      setLoadingProgress(0)
      setIsLoaded(false)
      setBackgroundExpanded(false)
      setCurrentTextIndex(0)
      setTextColorWhite(false)

      // Start loading progress
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setTimeout(() => {
              setIsLoaded(true)
              setCurrentTextIndex(1)
              setTimeout(() => {
                setBackgroundExpanded(true)
                setTimeout(() => {
                  setTextColorWhite(true)
                }, 500)
                // Start next cycle after background expansion
                setTimeout(() => {
                  setAnimationCycle((cycle) => cycle + 1)
                }, 2000)
              }, 500)
            }, 500)
            return 100
          }
          return prev + 2
        })
      }, 50)
    }

    runAnimationCycle()
  }, [animationCycle])

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
      <AnimatePresence>
        {backgroundExpanded && (
          <>
            <motion.div
              className="absolute bg-blue-300 rounded-full aspect-square"
              initial={{
                width: 0,
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                width: "200vmax",
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bg-blue-400 rounded-full aspect-square"
              initial={{
                width: 0,
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                width: "160vmax",
              }}
              transition={{ duration: 1.0, ease: "easeInOut", delay: 0.3 }}
            />
          </>
        )}
      </AnimatePresence>

      <div
        className="relative z-10 flex items-center justify-center"
        style={{ width: `${circleSize}px`, height: `${circleSize}px` }}
      >
        {features.map((feature, index) => {
          const angle = (index * 360) / features.length - 90 // Start from top
          const dotRadius = circleSize * 0.27 // Proportional to circle size
          const textRadius = circleSize * 0.33 // Text labels slightly outside

          const dotX = Math.cos(angle * (Math.PI / 180)) * dotRadius
          const dotY = Math.sin(angle * (Math.PI / 180)) * dotRadius

          const textX = Math.cos(angle * (Math.PI / 180)) * textRadius
          const textY = Math.sin(angle * (Math.PI / 180)) * textRadius

          return (
            <div key={feature}>
              {/* Yellow dot */}
              <motion.div
                className="absolute w-3 h-3 bg-yellow-400 rounded-full z-20"
                initial={{ opacity: 1 }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 },
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 },
                }}
                style={{
                  left: `${circleSize / 2 + dotX}px`,
                  top: `${circleSize / 2 + dotY}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Feature label */}
              <motion.div
                className={`absolute font-medium text-sm md:text-base whitespace-nowrap z-20 ${
                  textColorWhite ? "text-white" : "text-gray-800"
                }`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                style={{
                  left: `${circleSize / 2 + textX}px`,
                  top: `${circleSize / 2 + textY}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {feature}
              </motion.div>
            </div>
          )
        })}

        <motion.div
          className="absolute"
          style={{
            width: `${circleSize * 0.53}px`,
            height: `${circleSize * 0.53}px`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2 2" />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: loadingProgress / 100 }}
              transition={{ duration: 0.1 }}
              style={{
                pathLength: loadingProgress / 100,
              }}
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute rounded-full flex items-center justify-center shadow-2xl z-10"
          style={{
            background: "#3b82f6",
            width: `${circleSize * 0.48}px`,
            height: `${circleSize * 0.48}px`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            background: "#3b82f6",
          }}
          animate={{
            background: "#3b82f6",
          }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Inner Circle Content */}
          <div className="text-center relative z-30">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-xl md:text-3xl font-bold text-white relative z-30">
                  {centerTexts[currentTextIndex].title}
                </h1>
                <p className="text-sm md:text-lg font-medium text-white relative z-30">
                  {centerTexts[currentTextIndex].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
