"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimatedText from "@/components/animation/animatedtext";
import PlanSection from "./plansection";
import { subscriptionPlans, shopifyPlans, outsourcingPlans, tabs } from "./data";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/motion-primitives/accordion";
import { ChevronRight } from "lucide-react";

export function Solutions() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("outsourcing");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>([]);

  const hiddenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getCurrentPlans = () => {
    switch (activeTab) {
      case "subscription":
        return subscriptionPlans;
      case "shopify":
        return shopifyPlans;
      case "outsourcing":
        return outsourcingPlans;
      default:
        return outsourcingPlans;
    }
  };

  const nextSlide = () => {
    const plans = getCurrentPlans();
    setCurrentSlide((prev) => (prev + 1) % plans.length);
  };

  const prevSlide = () => {
    const plans = getCurrentPlans();
    setCurrentSlide((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const measureHeights = useCallback(() => {
    const newHeights: number[] = [];

    hiddenRefs.current.forEach((ref, index) => {
      if (ref) {
        // Force a reflow to ensure accurate measurements
        ref.style.height = "auto";
        const rect = ref.getBoundingClientRect();
        newHeights[index] = Math.max(rect.height, ref.scrollHeight, ref.offsetHeight);
      }
    });

    setHeights(newHeights);

    // Set initial carousel height
    if (newHeights.length > 0) {
      setCarouselHeight(newHeights[currentSlide] || newHeights[0]);
    }
  }, [currentSlide]);

  useEffect(() => {
    const measureWithDelay = () => {
      // Multiple measurements to ensure accuracy
      const measure = () => measureHeights();

      // Immediate measurement
      measure();

      // Delayed measurements for font loading
      setTimeout(measure, 100);
      setTimeout(measure, 300);
      setTimeout(measure, 500);

      // Wait for fonts to load
      if (document.fonts) {
        document.fonts.ready.then(measure);
      }
    };

    measureWithDelay();
  }, [activeTab, measureHeights]);

  useEffect(() => {
    if (heights.length > 0 && heights[currentSlide]) {
      setCarouselHeight(heights[currentSlide]);
    }
  }, [currentSlide, heights]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize measurements
      setTimeout(measureHeights, 100);
    });

    hiddenRefs.current.forEach((ref) => {
      if (ref) {
        resizeObserver.observe(ref);
      }
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureHeights, activeTab]);

  const currentPlans = getCurrentPlans();
  const getButtonText = () => {
    switch (activeTab) {
      case "subscription":
        return "문의하기";
      default:
        return "문의하기";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 pt-32 md:pt-64">
      <div className="col-span-full md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 py-12">
        <div className="flex items-center justify-between px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 flex items-center space-x-4">
            <p>솔루션</p>
            <AnimatedText textClassName="text-4xl md:text-5xl lg:text-6xl" />
          </h1>

          <div className="flex items-center space-x-4">
            <Button
              className="hidden md:inline-flex h-[46px] md:h-[48px] lg:h-[60px] text-base md:text-base lg:text-lg font-bold px-6 md:px-6 lg:px-6"
              variant="secondary"
              asChild
            >
              <Link href="/service/dashboard">AI 견적 받아보기</Link>
            </Button>
            <Button
              className="h-[46px] md:h-[48px] lg:h-[60px] text-base md:text-base lg:text-lg font-bold px-6 md:px-6 lg:px-6"
              onClick={() => router.push("/#inquery")}
            >
              문의하기
            </Button>
          </div>
        </div>

        <div className="flex mb-24 md:mb-32 mt-3 md:mt-6 text-base md:text-lg lg:text-xl font-bold text-muted-foreground px-4 md:px-0 w-3/4">
          내 비즈니스에 꼭 맞는 Fellows 솔루션을 알아보세요.
        </div>

        <div className="flex items-center justify-between mb-12 md:mb-16 px-4 md:px-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-1.5 h-2.5 bg-orange-400" />
            <h2 className="text-3xl font-bold text-gray-900">{activeTab === "outsourcing" ? "외주" : activeTab === "subscription" ? "구독" : "Shopify"}</h2>
          </div>

          <div className="flex justify-center overflow-x-auto">
            <div className="flex bg-gray-100 rounded-md p-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentSlide(0);
                  }}
                  className={`px-2 md:px-3 h-[24px] md:h-[30px] rounded-sm text-sm font-medium transition-all duration-200 whitespace-nowrap focus-visible:border-0 ${
                    activeTab === tab.id ? "bg-white text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <PlanSection
          plans={currentPlans}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          carouselHeight={carouselHeight}
          hiddenRefs={hiddenRefs}
          slideRefs={slideRefs}
          buttonText={getButtonText()}
        />

        <div className="mt-24 md:mt-32 px-4 md:px-0">
          <div className="flex items-center space-x-2.5 mb-12 md:mb-16">
            <div className="w-1.5 h-2.5 bg-emerald-400" />
            <h2 className="text-3xl font-bold text-gray-900">자주 묻는 질문</h2>
          </div>

          <Accordion
            className="flex w-full flex-col"
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            variants={{
              expanded: {
                opacity: 1,
                scale: 1,
              },
              collapsed: {
                opacity: 0,
                scale: 0.7,
              },
            }}
          >
            <AccordionItem value="getting-started" className="py-3">
              <AccordionTrigger className="w-full pt-0.5 pb-1.5 md:pb-3 text-left text-zinc-950 dark:text-zinc-50">
                <div className="flex items-center">
                  <ChevronRight className="size-5 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
                  <div className="ml-2 text-zinc-950 dark:text-zinc-50 text-lg md:text-xl font-bold">Fellows에서 개발하면 좋은 점이 무엇인가요?</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="origin-left">
                <p className="pl-7 md:pl-6 pr-2 text-zinc-500 dark:text-zinc-400 text-base">
                  Fellows에서는 높은 수준의 말레이시아 및 인도네시아의 인하우스 개발자가 작업에 투입됩니다. 자체적으로 유닛, 단위 테스트를 통해 최종 납품시
                  메이저 이슈 1% 미만, 마이너 이슈 5% 미만의 기준을 충족시키고 있습니다.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="animation-properties" className="py-3">
              <AccordionTrigger className="w-full pt-0.5 pb-1.5 md:pb-3 text-left text-zinc-950 dark:text-zinc-50">
                <div className="flex items-center">
                  <ChevronRight className="size-5 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
                  <div className="ml-2 text-zinc-950 dark:text-zinc-50 text-lg md:text-xl font-bold">개발은 어떻게 의뢰할 수 있나요?</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="origin-left">
                <p className="pl-7 md:pl-6 pr-2 text-zinc-500 dark:text-zinc-400 text-base">
                  프로젝트를 만든 뒤 정보를 적고 전달 버튼을 누르면 매니저가 배치됩니다. 이후 최종 견적을 받아볼 수 있으며, 견적을 수락하면 개발팀이 작업을
                  시작합니다.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="advanced-features" className="py-3">
              <AccordionTrigger className="w-full pt-0.5 pb-1.5 md:pb-3 text-left text-zinc-950 dark:text-zinc-50">
                <div className="flex items-center">
                  <ChevronRight className="size-5 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
                  <div className="ml-2 text-zinc-950 dark:text-zinc-50 text-lg md:text-xl font-bold">AI 견적은 무료인가요?</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="origin-left">
                <p className="pl-7 md:pl-6 pr-2 text-zinc-500 dark:text-zinc-400 text-base">
                  AI 견적 서비스는 무료입니다. AI견적 결과와 실제 최종 견적 결과는 다를 수 있습니다.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex flex-col md:flex-row md:items-center space-y-8 md:space-y-0 md:justify-between mt-16 md:mt-24 mb-12 md:mb-24 px-4 md:px-0">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900">
            Software Integration
            <br />
            Platform — fellows
          </h1>

          <div className="w-full md:w-fit flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
            <Button
              className="h-[60px] md:h-[48px] lg:h-[60px] w-full md:w-fit text-lg md:text-base lg:text-lg font-bold px-3 md:px-4 lg:px-6"
              variant="secondary"
              asChild
            >
              <Link href="/service/dashboard">AI 견적 받아보기</Link>
            </Button>
            <Button
              className="h-[60px] md:h-[48px] lg:h-[60px] w-full md:w-fit text-lg md:text-base lg:text-lg font-bold px-3 md:px-4 lg:px-6"
              onClick={() => router.push("/#inquery")}
            >
              문의하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Pricing = Solutions;
