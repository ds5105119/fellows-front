"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tabs = [
  { id: "code", label: "코드" },
  { id: "nocode", label: "노코드" },
  { id: "shopify", label: "Shopify" },
];

const nocodeData = [
  {
    name: "Basic",
    features: ["반응형 디자인 구축", "기본 템플릿 커스터마이징", "페이지 15개 이하", "기본 SEO 설정", "관리자 교육", "1개월 무료 지원"],
  },
  {
    name: "Standard",
    features: [
      "프리미엄 템플릿 커스터마이징",
      "페이지 30개 이하",
      "고급 SEO 설정 및 최적화",
      "예약 시스템 연동",
      "인터랙티브 요소 구현",
      "관리자 교육 및 가이드",
      "2개월 무료 지원",
    ],
  },
  {
    name: "Premium",
    features: [
      "완전 커스텀 디자인",
      "무제한 페이지",
      "고급 기능 구현",
      "회원 시스템 구축",
      "결제 시스템 연동",
      "마케팅 도구 제공",
      "전담 매니저 배정",
      "3개월 무료 지원",
    ],
  },
];

const shopifyPlans = [
  {
    name: "Growth Boost",
    subtitle: "사업 초기",
    description: "합리적인 금액으로 쇼피파이 스토어 구축을 진행할 수 있습니다. 빠른 스토어 구축을 통해서 매출 발생이후 스토어를 고도화 해보세요.",
    features: [
      "반응형 디자인",
      "스토어 테마 제공",
      "스토어 기본 세팅",
      "상품수 20개 이하 등록지원",
      "상품진열 및 가이드 개발",
      "검색 엔진 최적화",
      "글로벌 결제 모듈(페이팔) 세팅 지원",
      "구글 애널리틱스, 페이스북 픽셀 탑재",
      "다국어 운영 관련 앱 세팅 지원",
      "쇼피파이 운영 교육",
      "물류 컨설팅 지원",
      "물류 솔루션 운영 교육",
    ],
  },
  {
    name: "Standard Plan",
    subtitle: "중소기업용",
    description: "전반적인 구축에 대한 가이드라인과 개발 지원을 받을 수 있습니다. 중소기업용 플랜입니다. 가장 핵심적인 서비스로 구성되어 있습니다.",
    features: [
      "반응형 디자인",
      "스토어 테마 제공",
      "스토어 기본 세팅",
      "상품 리스트, 상품 상세 제한적 테마커스텀",
      "상품수 40개 이하 등록 지원",
      "상품 진열 및 가이드 제안",
      "검색 엔진 최적화",
      "글로벌 결제 모듈(페이팔) 세팅 지원",
      "구글 애널리틱스, 페이스북 픽셀 탑재",
      "다국어 운영 앱 세팅 지원",
      "리뷰앱 세팅 지원",
      "운영시 필요 앱 컨설팅 제공",
      "쇼피파이 운영 교육",
      "물류 컨설팅 지원",
    ],
  },
  {
    name: "Advanced Plan",
    subtitle: "브랜딩 커스텀",
    description:
      "브랜딩에 따른 커스텀 및 개발을 제공합니다. 독자적인 브랜딩을 통해서 차별화된 스토어를 구축하고 운영에 필요한 앱에 대한 컨설팅과 세팅을 지원합니다.",
    features: [
      "반응형 디자인",
      "스토어 테마 제공",
      "스토어 기본 세팅",
      "테마 기반 제한적 테마커스텀",
      "상품수 100개 이하 등록 지원",
      "상품 진열 및 가이드 제안",
      "검색 엔진 최적화",
      "글로벌 결제 모듈(페이팔)/PG 세팅 지원",
      "구글 애널리틱스, 페이스북 픽셀 탑재",
      "다국어 운영 앱 세팅",
      "리뷰앱 세팅",
      "마케팅 앱(이메일, 로열티 프로그램) 세팅",
      "고객사 맞춤 앱 컨설팅 및 세팅 지원",
      "쇼피파이 운영 교육",
      "물류 컨설팅 지원",
      "물류 솔루션 운영 교육",
      "1:1 물류 케어 서비스",
      "마케팅 컨설팅 및 마케팅 운영 지원",
      "구글 쇼핑 연동 지원",
    ],
  },
  {
    name: "Brand Master",
    subtitle: "풀커스텀",
    description:
      "브랜딩에 따른 기능 개발은 물론 서드파티 앱들과 테마의 유기적인 UX/UI 통합을 지원합니다. 오픈 이후 1개월까지 운영에 따른 개발 지원 서비스를 제공합니다.",
    features: [
      "반응형 디자인",
      "스토어 테마 제공",
      "스토어 기본 세팅",
      "테마 풀커스텀",
      "상품수 협의 등록 지원",
      "상품 진열 및 가이드 제안",
      "검색 엔진 최적화",
      "글로벌 결제 모듈(페이팔)/PG 세팅 지원",
      "구글 애널리틱스, 페이스북 픽셀 탑재",
      "다국어 운영 앱 세팅",
      "리뷰앱 세팅",
      "마케팅 앱(이메일, 로열티 프로그램)세팅",
      "고객사 맞춤 앱 컨설팅 및 세팅 지원",
      "쇼피파이 운영 교육",
      "물류 컨설팅 지원",
      "물류 솔루션 운영 교육",
      "1:1 물류 케어 서비스",
      "마케팅 컨설팅 및 마케팅 운영 지원",
      "구글 쇼핑 연동 지원",
      "오픈 이후 2개월 기술컨설팅",
    ],
  },
];

export function Pricing() {
  const [activeTab, setActiveTab] = useState("code");

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 pt-48">
      {/* Main Content */}
      <div className="col-span-full md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 py-12">
        {/* Title */}
        <div className="flex items-center justify-between mb-30 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">가격</h1>

          <div className="flex items-center space-x-4">
            <Button className="h-[36px] md:h-[48px] lg:h-[60px] text-sm md:text-base lg:text-lg font-bold px-3 md:px-4 lg:px-6" variant="secondary" asChild>
              <Link href="/service/dashboard">AI 견적 받아보기</Link>
            </Button>
            <Button className="h-[36px] md:h-[48px] lg:h-[60px] text-sm md:text-base lg:text-lg font-bold px-3 md:px-4 lg:px-6" asChild>
              <a href="/#inquery">문의하기</a>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-18 px-4 md:px-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-1.5 h-2.5 bg-orange-400" />
            <h2 className="text-3xl font-bold text-gray-900">{activeTab === "code" ? "Code" : activeTab === "nocode" ? "NoCode" : "Shopify"}</h2>
          </div>

          <div className="flex justify-center overflow-x-auto">
            <div className="flex bg-gray-100 rounded-lg p-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 h-[30px] rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id ? "bg-white text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "code" && (
          <div className="px-4 md:px-0">
            <div className="p-12 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-8">견적 문의</div>
              <p className="text-lg text-gray-600 leading-relaxed">
                맞춤형 웹 개발 서비스를 제공합니다. 프로젝트 규모와 요구사항에 따라 개별 견적을 제공합니다.
              </p>
            </div>
          </div>
        )}

        {activeTab === "nocode" && (
          <div className="px-4 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nocodeData.map((plan, index) => (
                <div key={index}>
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
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
        )}

        {activeTab === "shopify" && (
          <div className="px-4 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {shopifyPlans.map((plan, index) => (
                <div key={index}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 text-sm font-medium">{plan.subtitle}</p>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">{plan.description}</p>
                  </div>
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
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

        {/* Bottom CTA */}
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
              <a href="/#inquery">문의하기</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
