"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getEstimateInfo } from "@/hooks/fetch/project";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";

const suggestionButtons = [
  {
    label: "Cafe 24 쇼핑몰",
    description:
      "저희는 소규모 패션 브랜드를 운영하고 있는데, 온라인 판매 채널을 확장하려고 합니다. Cafe 24 플랫폼을 기반으로, 신상품 등록과 재고 관리, 결제와 배송 추적까지 한 번에 처리할 수 있는 쇼핑몰을 제작해주세요. 특히 모바일 사용자가 많아서 반응형 디자인과 간편 결제 기능이 꼭 필요합니다. 회원가입 시 쿠폰 발급, 리뷰 작성, 배너 이벤트 같은 마케팅 기능도 활용할 수 있으면 좋겠습니다. 관리자가 상품과 주문을 쉽게 관리할 수 있는 안정적인 쇼핑몰을 제작해주세요.",
  },
  {
    label: "Next.js 프로젝트",
    description:
      "회사에서 사내 프로젝트 관리와 자료 공유를 위한 웹 서비스를 만들고 싶습니다. Next.js를 기반으로 하고, 로그인과 회원별 권한 관리, 게시판과 자료실, 일정 공유 기능이 필요합니다. 빠른 로딩 속도와 SEO 최적화를 고려해 SSR을 적용하고, 나중에 기능을 확장할 수 있도록 API 라우팅도 구축해주세요. PC와 모바일 모두 사용 가능하도록 반응형 UI로 만들어주시고, 관리자가 데이터를 쉽게 추가·수정할 수 있는 현대적인 웹 애플리케이션을 제작해주세요.",
  },
  {
    label: "Framer 랜딩 페이지",
    description:
      "이번에 새로운 IT 교육 서비스를 런칭하게 되어, 잠재 고객에게 어필할 수 있는 랜딩 페이지가 필요합니다. Framer를 활용해 스크롤할 때마다 자연스럽게 움직이는 애니메이션과 인터랙션이 들어가면 좋겠습니다. 서비스 특징과 가격, 후기, 신청 버튼까지 한눈에 보이도록 배치하고, 광고나 SNS를 통해 들어온 방문자가 쉽게 신청까지 이어질 수 있도록 구성해주세요. 모바일에서도 시각적으로 매력적이고 브랜드 이미지를 잘 살릴 수 있는 랜딩 페이지를 제작해주세요.",
  },
  {
    label: "Shopify 쇼핑몰",
    description:
      "해외 고객을 대상으로 하는 한국 전통차 온라인 스토어를 운영하려고 합니다. Shopify를 활용해서 다국어 지원과 해외 결제가 가능한 쇼핑몰을 제작해주세요. 상품 카테고리, 상세 페이지, 장바구니, 결제, 배송 추적은 물론, 리뷰 작성과 할인 쿠폰 기능도 필요합니다. 인스타그램 연동과 소셜 로그인으로 접근성을 높이고, PC·모바일 모두 쾌적하게 사용할 수 있도록 디자인해주세요. 관리자가 쉽게 상품과 주문을 관리할 수 있는 글로벌 쇼핑몰을 제작해주세요.",
  },
  {
    label: "React Native 앱",
    description:
      "지역 카페와 식당 정보를 한눈에 볼 수 있는 지역 커뮤니티 앱을 만들고 싶습니다. React Native를 활용해 iOS와 Android에서 모두 동작하게 제작해주세요. 위치 기반으로 주변 매장을 보여주고, 즐겨찾기, 리뷰 작성, 푸시 알림 기능이 필요합니다. 사용자가 편리하게 이용할 수 있도록 간결한 UI/UX로 설계하고, 관리자가 매장 정보와 이벤트를 쉽게 업데이트할 수 있는 구조로 제작해주세요.",
  },
];

export default function MainSection({ session }: { session: Session | null }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  const handleSuggestionClick = (description: string) => {
    setDescription(description);
  };

  const handleSubmit = async (description: string) => {
    setIsLoading(true);
    const { info } = await getEstimateInfo({ project_summary: description });
    if (!info) return;
    sessionStorage.setItem("project_info", JSON.stringify({ description, info }));
    router.push(`/service/project/new?from=session`);
  };

  useEffect(() => {
    if (description && !session) {
      signIn("keycloak", { redirectTo: "/" });
    }
  });

  return (
    <div className="relative w-full h-full px-4">
      <div className="flex flex-col gap-8 items-center justify-center w-full h-full">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key="main-cta"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex w-full flex-col z-20 items-center justify-center rounded-2xl"
          >
            <div className="w-full pt-6 md:pt-2 flex flex-col gap-3 items-center justify-center">
              <div className="w-full flex flex-col col gap-1 md:gap-2.5 items-center justify-center text-foreground text-center">
                <h1 className="text-3xl xl:text-5xl font-bold tracking-normal">Web, App 개발</h1>
                <h1 className="text-3xl xl:text-5xl font-bold tracking-normal">Fellows℠에 문의하세요</h1>
              </div>

              <div className="w-full max-w-4xl mx-auto mt-3 md:mt-6 flex flex-col">
                {!isLoading ? (
                  <div className="w-full min-h-12 max-h-36 md:min-h-36 md:max-h-36 px-4 pr-1.5 md:pl-5 md:py-4 md:pr-3 md:pb-2 flex items-center md:items-end justify-center gap-2 relative rounded-[24px] md:rounded-2xl bg-black/5 backdrop-blur-xl border border-black/10 shadow-2xl shadow-black/10">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="의뢰하려는 사이트에 대해 설명해주세요."
                      className="grow py-0 px-0 min-h-6.5 md:min-h-full max-h-full bg-transparent border-none focus-visible:ring-0 outline-none shadow-none resize-none scrollbar-hide"
                    />
                    <div className="flex items-end h-full py-1.5">
                      <Button size="icon" variant="default" className="rounded-full" onClick={() => handleSubmit(description)}>
                        <ChevronRight />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Dashboard Loading
                  <motion.div
                    key="dashboard-loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="md:min-w-xl flex w-fit h-fit flex-col z-20 items-center justify-center rounded-2xl mx-auto"
                  >
                    <div className="w-full px-6 md:px-16 py-4 flex flex-col gap-2 items-center justify-center">
                      <Loader2Icon className="!size-6 text-muted-foreground animate-spin" />
                      <div className="flex text-center">
                        <p className="text-xs text-muted-foreground">분석중입니다...</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="w-full flex flex-col space-y-2 mt-4 px-2">
                  <div className="text-sm">추천 항목을 참고해보세요:</div>
                  <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-2">
                    {suggestionButtons.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.description)}
                        className="rounded-full text-sm px-5 py-1 border border-black/50 hover:bg-white/30 transition-colors duration-200"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Animated ChevronDown Button */}
        <motion.button
          className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full hover:bg-black/10 transition-colors duration-300 cursor-pointer"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          onClick={() => {
            window.scrollBy({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <ChevronDown />
        </motion.button>
      </div>
    </div>
  );
}
