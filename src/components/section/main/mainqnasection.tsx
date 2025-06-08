"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

interface QnAItem {
  question: string;
  answer: string;
}

const qnaData: QnAItem[] = [
  {
    question: "유지보수는 어떻게 이루어지나요?",
    answer:
      "안정적인 운영을 위해 최소 한달의 기본 기술 지원 기간을 제공합니다. 유지보수 범위와 기간은 협의하여 조정할 수 있으며, 필요에 따라 성능 최적화, 보안 업데이트, 버그 수정 등을 지원합니다. 서비스 운영 중 장애 발생이나 추가 기능 개발 필요성이 있을 경우 유용합니다.",
  },
  {
    question: "개발 중 기능을 추가할 수 있나요?",
    answer: "SaaS에서 이슈를 발행하여 개발 중 새로운 기능을 추가할 수 있습니다. 이슈의 사이즈에 따라 추가 계약이 필요할 수 있습니다.",
  },
  {
    question: "지속 가능성을 위한 노력은 무엇인가요?",
    answer:
      "재활용 가능한 소재 사용, 탄소 배출량 감소, 폐기물 최소화를 위한 다양한 이니셔티브를 실행하고 있습니다. 2025년까지 탄소 중립을 달성하는 것을 목표로 하고 있습니다.",
  },
  {
    question: "멤버십 프로그램은 어떤 혜택이 있나요?",
    answer:
      "멤버십 회원에게는 신제품 우선 구매권, 한정판 액세스, 특별 할인, 무료 배송 등의 혜택을 제공합니다. 또한 회원 전용 이벤트와 워크샵에 참여할 수 있는 기회도 주어집니다.",
  },
  {
    question: "브랜드의 핵심 가치는 무엇인가요?",
    answer:
      "우리는 지속 가능성을 생각하고, 혁신을 실천하며, 모두를 위한 디자인을 만듭니다. Fellows가 만드는 모든 것은 환경과 사회에 긍정적인 변화를 전제하여 시작됩니다.",
  },
];

export default function MainQnaSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // md 이상에서는 첫 번째 항목을 기본 선택
      if (window.innerWidth >= 768) {
        setActiveIndex(0);
      } else {
        setActiveIndex(null);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleItem = (index: number) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full pb-8 md:pb-10">
        <div className="px-4 flex flex-col space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">Frequently Asked Questions</h1>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
            <h4 className="text-base md:text-lg font-semibold text-foreground">200+개의 고객사가 Fellows를 선택한 이유.</h4>
            <Link href="/" className="flex items-center md:px-3 md:py-1.5 md:rounded-sm md:hover:bg-muted select-none">
              <ArrowUpRight className="!size-7 text-blue-500" />
              <p className="text-lg md:text-xl font-semibold text-blue-500">전체 사용사례 알아보기</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Questions List */}
        <div className="w-full lg:w-1/3">
          {qnaData.map((item, index) => (
            <div key={index} className="flex flex-col">
              <motion.button
                onClick={() => toggleItem(index)}
                animate={{
                  backgroundColor: activeIndex === index ? "#45f3a2" : "#f4f4f5",
                }}
                whileTap={{ scale: 0.99 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="w-full pl-7 pr-5 py-5 flex items-center justify-between text-left focus:outline-none rounded-3xl"
              >
                <span className="text-xl">{item.question}</span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 45 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <Plus className="!size-9" strokeWidth={1.5} />
                </motion.div>
              </motion.button>

              {/* Mobile Answer */}
              {isMobile && (
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: activeIndex === index ? "auto" : 0,
                      opacity: activeIndex === index ? 1 : 0,
                    }}
                    transition={{
                      height: {
                        duration: 0.4,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      },
                      opacity: {
                        duration: 0.3,
                        delay: activeIndex === index ? 0.1 : 0,
                      },
                    }}
                    className="bg-zinc-100 rounded-3xl overflow-hidden"
                  >
                    <div className="px-7 py-6">
                      <p className="text-sm text-black leading-relaxed">{item.answer}</p>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Answer Display */}
        <div className="flex-1 hidden lg:block">
          <motion.div
            layout
            transition={{
              duration: 0.4,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            className="bg-gray-100 rounded-3xl p-12"
          >
            <AnimatePresence mode="wait">
              {activeIndex !== null && (
                <motion.div key={activeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-4xl font-semibold text-balck mb-6">{qnaData[activeIndex].question}</h2>
                  <p className="text-black text-lg leading-relaxed">{qnaData[activeIndex].answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
