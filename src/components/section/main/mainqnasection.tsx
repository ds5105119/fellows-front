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
    question: "Fellows에서 개발하면 무슨 이점이 있나요?",
    answer:
      "Fellows는 국내 디자인 하우스와 글로벌 소프트웨어 에이전시 출신의 검증된 전문가들과 함께합니다. 단순한 아웃소싱이 아닌, 브랜드의 방향성과 품질을 함께 고민하며, 높은 완성도와 합리적인 비용을 동시에 만족시킬 수 있는 파트너십을 제공합니다.",
  },
  {
    question: "유지보수는 어떻게 이루어지나요?",
    answer:
      "서비스가 안정적으로 운영될 수 있도록, 기본적으로 한 달간의 기술 지원 기간을 제공합니다. 협의를 통해 유지보수 범위와 기간을 유연하게 조정할 수 있으며, 성능 개선과 보안 업데이트, 버그 수정 등 다양한 측면에서 실질적인 도움을 드립니다.",
  },
  {
    question: "개발 중 기능을 추가할 수 있나요?",
    answer:
      "개발 진행 중에도 변화는 있을 수 있습니다. Fellows는 SaaS 플랫폼 내 이슈 발행 방식을 통해 기능 요청을 체계적으로 반영하며, 요청된 기능의 크기와 범위에 따라 추가 계약이 필요한 경우에는 신속하게 안내드립니다.",
  },
  {
    question: "브랜드의 핵심 가치는 무엇인가요?",
    answer:
      "Fellows는 단순한 결과물 그 이상을 추구합니다. 지속 가능한 미래를 고려하고, 혁신의 가치를 실현하며, 모두가 접근할 수 있는 디자인을 지향합니다. 우리가 만드는 모든 것은 사회와 환경에 긍정적인 영향을 미치는 방향으로 설계됩니다.",
  },
  {
    question: "지속 가능성을 위한 노력은 무엇인가요?",
    answer:
      "Fellows는 GCP 저탄소 서버 활용, 자원 효율화, 저탄소 인프라 구성 등을 통해 지속 가능성에 실질적으로 기여하고 있습니다. 우리의 모든 기술적 선택은 환경적 영향을 최소화하기 위한 고민에서 출발하며, 2027년까지 탄소 중립 달성을 목표로 움직이고 있습니다.",
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
