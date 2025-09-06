"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "outsourcing", label: "외주" },
  { id: "subscription", label: "구독" },
  { id: "shopify", label: "Shopify" },
];

const shopifyPlans = [
  {
    name: "Growth Boost",
    subtitle: "사업 초기",
    description: "합리적인 금액으로 쇼피파이 스토어 구축을 진행할 수 있습니다. 빠른 스토어 구축을 통해서 매출 발생이후 스토어를 고도화 해보세요.",
    features: [
      { title: "반응형 디자인", bold: false },
      { title: "스토어 테마 제공", bold: false },
      { title: "스토어 기본 세팅", bold: false },
      { title: "상품수 20개 이하 등록지원", bold: false },
      { title: "상품진열 및 가이드 개발", bold: false },
      { title: "검색 엔진 최적화", bold: false },
      { title: "글로벌 결제 모듈(페이팔) 세팅 지원", bold: false },
      { title: "구글 애널리틱스, 페이스북 픽셀 탑재", bold: false },
      { title: "다국어 운영 앱 세팅 지원", bold: false },
      { title: "쇼피파이 운영 교육", bold: false },
    ],
  },
  {
    name: "Standard Plan",
    subtitle: "중소기업용",
    description: "전반적인 구축에 대한 가이드라인과 개발 지원을 받을 수 있습니다. 중소기업용 플랜입니다. 가장 핵심적인 서비스로 구성되어 있습니다.",
    features: [
      { title: "반응형 디자인", bold: false },
      { title: "스토어 테마 제공", bold: false },
      { title: "스토어 기본 세팅", bold: false },
      { title: "상품 리스트, 상품 상세 제한적 테마커스텀", bold: true },
      { title: "상품수 40개 이하 등록 지원", bold: false },
      { title: "상품 진열 및 가이드 제안", bold: false },
      { title: "검색 엔진 최적화", bold: false },
      { title: "글로벌 결제 모듈(페이팔) 세팅 지원", bold: false },
      { title: "구글 애널리틱스, 페이스북 픽셀 탑재", bold: false },
      { title: "다국어 운영 앱 세팅 지원", bold: false },
      { title: "리뷰앱 세팅 지원", bold: false },
      { title: "운영시 필요 앱 컨설팅 제공", bold: false },
      { title: "쇼피파이 운영 교육", bold: false },
    ],
  },
  {
    name: "Advanced Plan",
    subtitle: "브랜딩 커스텀",
    description: "브랜딩에 따른 커스텀 및 개발을 제공합니다. 독자적인 브랜딩을 통해서 차별화된 스토어를 구축하고 운영에 필요한 앱에 대한 세팅을 지원합니다.",
    features: [
      { title: "반응형 디자인", bold: false },
      { title: "스토어 테마 제공", bold: false },
      { title: "스토어 기본 세팅", bold: false },
      { title: "테마 기반 제한적 테마커스텀", bold: true },
      { title: "상품수 100개 이하 등록 지원", bold: false },
      { title: "상품 진열 및 가이드 제안", bold: false },
      { title: "검색 엔진 최적화", bold: false },
      { title: "글로벌 결제 모듈(페이팔)/PG 세팅 지원", bold: false },
      { title: "구글 애널리틱스, 페이스북 픽셀 탑재", bold: false },
      { title: "다국어 운영 앱 세팅", bold: false },
      { title: "리뷰앱 세팅", bold: false },
      { title: "마케팅 앱(이메일, 로열티 프로그램) 세팅", bold: false },
      { title: "고객사 맞춤 앱 컨설팅 및 세팅 지원", bold: false },
      { title: "쇼피파이 운영 교육", bold: false },
      { title: "마케팅 컨설팅 및 마케팅 운영 지원", bold: false },
      { title: "구글 쇼핑 연동 지원", bold: false },
    ],
  },
  {
    name: "Brand Master",
    subtitle: "풀커스텀",
    description:
      "브랜딩에 따른 기능 개발은 물론 서드파티 앱들과 테마의 유기적인 UX/UI 통합을 지원합니다. 오픈 이후 1개월까지 운영에 따른 개발 지원 서비스를 제공합니다.",
    features: [
      { title: "반응형 디자인", bold: false },
      { title: "스토어 테마 제공", bold: false },
      { title: "스토어 기본 세팅", bold: false },
      { title: "테마 풀커스텀", bold: true },
      { title: "상품수 협의 등록 지원", bold: false },
      { title: "상품 진열 및 가이드 제안", bold: false },
      { title: "검색 엔진 최적화", bold: false },
      { title: "글로벌 결제 모듈(페이팔)/PG 세팅 지원", bold: false },
      { title: "구글 애널리틱스, 페이스북 픽셀 탑재", bold: false },
      { title: "다국어 운영 앱 세팅", bold: false },
      { title: "리뷰앱 세팅", bold: false },
      { title: "마케팅 앱(이메일, 로열티 프로그램) 세팅", bold: false },
      { title: "고객사 맞춤 앱 컨설팅 및 세팅 지원", bold: false },
      { title: "쇼피파이 운영 교육", bold: false },
      { title: "마케팅 컨설팅 및 마케팅 운영 지원", bold: false },
      { title: "구글 쇼핑 연동 지원", bold: false },
      { title: "오픈 이후 1개월 기술컨설팅", bold: false },
    ],
  },
];

const subscriptionPlans = [
  {
    name: "FREE",
    price: "0",
    unit: "만원",
    period: "/월",
    description: "신규 사업을 준비하는 팀",
    features: ["실시간 소통 채널 운영", "정기 비지니스 멘토링 제공(월 1회)", "사업 계획서 기술 검토"],
  },
  {
    name: "BASIC",
    price: "75",
    unit: "만원",
    period: "/월",
    description: "MVP 서비스 운영 유지보수가 필요한 팀",
    features: [
      "실시간 소통 채널 운영",
      "서버 운영 및 관리(유지보수)",
      "월간 운용보고서 제공",
      "정기 비지니스 멘토링 제공(격주 1회)",
      "분야별 전담팀 배정 (개발자)",
    ],
  },
  {
    name: "BUSINESS",
    price: "420",
    unit: "만원",
    period: "/월",
    description: "서비스 운영에 개발 인력이 필요한 팀",
    features: [
      "실시간 소통 채널 운영",
      "서버 운영 및 관리(유지보수)",
      "월간 운용보고서 제공",
      "추가 기능 개발",
      "정기 비지니스 멘토링 제공(격주 1회)",
      "분야별 전담팀 배정 (기획, 디자이너, 개발자)",
    ],
  },
  {
    name: "ENTERPRISE",
    price: "1,000",
    unit: "만원",
    period: "/월",
    description: "사업개발에 주도적인 개발팀이 필요한 기업",
    features: [
      "실시간 소통 채널 운영",
      "서버 운영 및 관리(유지보수)",
      "월간 운용보고서 제공",
      "추가 기능 개발",
      "정기 비지니스 멘토링 제공(격주 1회)",
      "분야별 전담팀 배정 (기획, 디자이너, 개발자 2명, 마케터)",
    ],
  },
];

export function Solutions() {
  const [activeTab, setActiveTab] = useState("outsourcing");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState<number | null>(null);
  const [subscriptionHeights, setSubscriptionHeights] = useState<number[]>([]);
  const [shopifyHeights, setShopifyHeights] = useState<number[]>([]);

  const nocodeHiddenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subscriptionHiddenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shopifyHiddenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subscriptionSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shopifySlideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const nextSlide = (dataLength: number) => {
    setCurrentSlide((prev) => (prev + 1) % dataLength);
  };

  const prevSlide = (dataLength: number) => {
    setCurrentSlide((prev) => (prev - 1 + dataLength) % dataLength);
  };

  useEffect(() => {
    const measureAllHeights = () => {
      if (activeTab === "subscription") {
        const heights: number[] = [];
        subscriptionHiddenRefs.current.forEach((ref, index) => {
          if (ref) {
            const height = ref.scrollHeight;
            heights[index] = height;
          }
        });
        setSubscriptionHeights(heights);
        setCarouselHeight(heights[currentSlide] || null);
      } else if (activeTab === "shopify") {
        const heights: number[] = [];
        shopifyHiddenRefs.current.forEach((ref, index) => {
          if (ref) {
            const height = ref.scrollHeight;
            heights[index] = height;
          }
        });
        setShopifyHeights(heights);
        setCarouselHeight(heights[currentSlide] || null);
      } else if (activeTab === "outsourcing") {
        const heights: number[] = [];
        nocodeHiddenRefs.current.forEach((ref, index) => {
          if (ref) {
            const height = ref.scrollHeight;
            heights[index] = height;
          }
        });
        setSubscriptionHeights(heights);
        setCarouselHeight(heights[currentSlide] || null);
      }
    };

    const timer = setTimeout(measureAllHeights, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "subscription" && subscriptionHeights.length > 0) {
      setCarouselHeight(subscriptionHeights[currentSlide]);
    } else if (activeTab === "shopify" && shopifyHeights.length > 0) {
      setCarouselHeight(shopifyHeights[currentSlide]);
    } else if (activeTab === "outsourcing" && subscriptionHeights.length > 0) {
      setCarouselHeight(subscriptionHeights[currentSlide]);
    }
  }, [currentSlide, activeTab, subscriptionHeights, shopifyHeights]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 pt-32 md:pt-64">
      <div className="fixed -top-[9999px] left-0 w-full opacity-0 pointer-events-none">
        <div className="w-full px-4">
          {subscriptionPlans.map((plan, index) => (
            <div
              key={`subscription-hidden-${index}`}
              ref={(el) => {
                subscriptionHiddenRefs.current[index] = el;
              }}
              className="w-full"
            >
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-lg text-gray-600">{plan.unit}</span>
                  <span className="text-lg text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">VAT 별도</p>
                <p className="text-gray-700 font-medium mb-4">{plan.description}</p>
              </div>
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full">
          {shopifyPlans.map((plan, index) => (
            <div
              key={`shopify-hidden-${index}`}
              ref={(el) => {
                shopifyHiddenRefs.current[index] = el;
              }}
              className="w-full"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm font-medium">{plan.subtitle}</p>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{plan.description}</p>
              </div>
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className={cn("text-sm", feature.bold ? "font-extrabold" : "")}>{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-full md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 py-12">
        <div className="flex items-center justify-between mb-56 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">솔루션</h1>

          <div className="flex items-center space-x-4">
            <Button
              className="hidden md:inline-flex h-[46px] md:h-[48px] lg:h-[60px] text-base md:text-base lg:text-lg font-bold px-6 md:px-6 lg:px-6"
              variant="secondary"
              asChild
            >
              <Link href="/service/dashboard">AI 견적 받아보기</Link>
            </Button>
            <Button className="h-[46px] md:h-[48px] lg:h-[60px] text-base md:text-base lg:text-lg font-bold px-6 md:px-6 lg:px-6" asChild>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#inquery">문의하기</a>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-24 px-4 md:px-0">
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
                  className={`px-2 md:px-3 h-[24px] md:h-[30px] rounded-sm text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap focus-visible:border-0 ${
                    activeTab === tab.id ? "bg-white text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === "outsourcing" && (
          <div className="px-4 md:px-0">
            <div className="bg-zinc-100 rounded-xl p-12 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-8">코드 & 노코드 개발 지원</div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                우리는 코드와 노코드 개발을 모두 지원합니다. 프로젝트의 특성과 요구사항에 맞는 최적의 솔루션을 제공합니다.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">코드 개발</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>완전 맞춤형 개발</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>복잡한 기능 구현</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>확장성과 성능 최적화</span>
                    </li>
                  </ul>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">노코드 개발</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>빠른 프로토타입 개발</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>비용 효율적인 솔루션</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>쉬운 유지보수</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="px-4 md:px-0">
            <div className="hidden lg:block bg-zinc-100 rounded-xl">
              <div className="grid grid-cols-4 divide-x-3 divide-background">
                {subscriptionPlans.map((plan, index) => (
                  <div key={index} className="p-6">
                    <div className="mb-6">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-lg text-gray-600">{plan.unit}</span>
                        <span className="text-lg text-gray-600">{plan.period}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">VAT 별도</p>
                      <Button className="w-full mb-4 bg-transparent" variant="outline">
                        구독 결제하기
                      </Button>
                      <p className="text-gray-700 font-medium mb-4">이런 분들에게 추천해요!</p>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden">
              <div className="relative">
                <div className="flex items-center justify-between mt-8">
                  <div className="flex space-x-3">
                    {subscriptionPlans.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? "bg-gray-800" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <button onClick={() => prevSlide(subscriptionPlans.length)} className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button onClick={() => nextSlide(subscriptionPlans.length)} className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    height: carouselHeight ? `${carouselHeight}px` : "auto",
                  }}
                >
                  <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {subscriptionPlans.map((plan, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 px-4"
                        ref={(el) => {
                          subscriptionSlideRefs.current[index] = el;
                        }}
                      >
                        <div className="mb-6">
                          <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                            <span className="text-lg text-gray-600">{plan.unit}</span>
                            <span className="text-lg text-gray-600">{plan.period}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">VAT 별도</p>
                          <Button className="w-full mb-4 bg-transparent" variant="outline">
                            구독 결제하기
                          </Button>
                          <p className="text-gray-700 font-medium mb-4">이런 분들에게 추천해요!</p>
                          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                        </div>
                        <div className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "shopify" && (
          <div>
            <div className="hidden lg:block bg-zinc-100 rounded-xl">
              <div className="grid grid-cols-4 divide-x-3 divide-background">
                {shopifyPlans.map((plan, index) => (
                  <div key={index} className="p-6">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-500 text-sm font-medium mb-4">{plan.subtitle}</p>
                      <Button className="w-full mb-4 bg-white" variant="outline">
                        문의하기
                      </Button>
                      <p className="text-gray-600 text-sm mt-3 leading-relaxed">{plan.description}</p>
                    </div>
                    <div className="space-y-1.5">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="text-gray-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className={cn("text-sm", feature.bold ? "font-extrabold" : "")}>{feature.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden px-4 md:px-0">
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex space-x-3">
                    {shopifyPlans.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? "bg-gray-800" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <button onClick={() => prevSlide(shopifyPlans.length)} className="bg-black/5 hover:bg-gray-200 rounded-full p-3 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button onClick={() => nextSlide(shopifyPlans.length)} className="bg-black/5 hover:bg-gray-200 rounded-full p-3 transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    height: carouselHeight ? `${carouselHeight}px` : "auto",
                  }}
                >
                  <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {shopifyPlans.map((plan, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0"
                        ref={(el) => {
                          shopifySlideRefs.current[index] = el;
                        }}
                      >
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-gray-500 text-sm font-medium">{plan.subtitle}</p>
                          <p className="text-gray-600 text-sm mt-3 leading-relaxed">{plan.description}</p>
                        </div>
                        <div className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className={cn("text-sm", feature.bold ? "font-extrabold" : "")}>{feature.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-20 px-4 md:px-0">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">자주 묻는 질문</h2>
          <div className="space-y-4">
            <details className="py-6">
              <summary className="cursor-pointer font-semibold text-gray-900 text-lg">서비스 제공 기간은 어떻게 되나요?</summary>
              <p className="mt-4 text-gray-600 leading-relaxed">프로젝트 규모에 따라 2-8주 소요됩니다.</p>
            </details>
            <details className="py-6">
              <summary className="cursor-pointer font-semibold text-gray-900 text-lg">유지보수는 어떻게 진행되나요?</summary>
              <p className="mt-4 text-gray-600 leading-relaxed">월 단위 유지보수 계약을 통해 지속적인 지원을 제공합니다.</p>
            </details>
            <details className="py-6">
              <summary className="cursor-pointer font-semibold text-gray-900 text-lg">결제는 어떻게 진행되나요?</summary>
              <p className="mt-4 text-gray-600 leading-relaxed">계약금 50%, 완료 후 50% 분할 결제가 가능합니다.</p>
            </details>
            <details className="py-6">
              <summary className="cursor-pointer font-semibold text-gray-900 text-lg">맞춤 개발이 가능한가요?</summary>
              <p className="mt-4 text-gray-600 leading-relaxed">네, 고객의 요구사항에 맞춘 완전 맞춤 개발이 가능합니다.</p>
            </details>
            <details className="py-6">
              <summary className="cursor-pointer font-semibold text-gray-900 text-lg">호스팅 및 도메인 지원이 포함되나요?</summary>
              <p className="mt-4 text-gray-600 leading-relaxed">플랜에 따라 호스팅 설정 및 도메인 연결 지원이 포함됩니다.</p>
            </details>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center space-y-8 md:space-y-0 md:justify-between mt-24 mb-12 px-4 md:px-0">
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
            <Button className="h-[60px] md:h-[48px] lg:h-[60px] w-full md:w-fit text-lg md:text-base lg:text-lg font-bold px-3 md:px-4 lg:px-6" asChild>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#inquery">문의하기</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Pricing = Solutions;
