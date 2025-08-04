"use client";

import { useEffect, useState, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2Icon } from "lucide-react";
import { EstimateFormState, getEstimateInfo } from "@/hooks/fetch/server/project";

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

function SubmitButton({ isParentLoading }: { isParentLoading: boolean }) {
  const { pending } = useFormStatus();
  const isLoading = pending || isParentLoading;

  return (
    <Button size="icon" type="submit" variant="default" className="rounded-full size-8 md:size-9" disabled={isLoading}>
      {isLoading ? <Loader2Icon className="animate-spin" /> : <ChevronRight />}
    </Button>
  );
}

export default function MainSection1Form({ session, initialDescription }: { session: Session | null; initialDescription: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [description, setDescription] = useState(initialDescription);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);

  const [state, formAction] = useActionState<EstimateFormState, FormData>(getEstimateInfo, null);
  const isParentLoading = isNavigating || isAutoSubmitting;

  const handleSuggestionClick = (text: string) => {
    setDescription(text);
  };

  const handleFormSubmit = (formData: FormData) => {
    if (!session) {
      document.cookie = `pendingDescription=${encodeURIComponent(description)}; path=/; max-age=300; SameSite=Lax`;
      signIn("keycloak", { redirectTo: "/?from=cookie" });
      return;
    }
    formAction(formData);
  };

  useEffect(() => {
    if (state?.success) {
      setIsNavigating(true);
      toast.success("견적 생성에 성공했습니다!");
      sessionStorage.setItem("project_info", JSON.stringify({ description: state.description, info: state.info }));
      router.push(`/service/project/new`);
    } else if (state?.error) {
      setIsNavigating(false);
      setIsAutoSubmitting(false);
      toast.error(state.error);
    }
  }, [state, router]);

  useEffect(() => {
    const fromCookie = searchParams.get("from") === "cookie";
    if (session && initialDescription && fromCookie) {
      setIsAutoSubmitting(true);
      const formData = new FormData();
      formData.append("description", initialDescription);
      formAction(formData);
      router.replace("/", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, initialDescription, searchParams, formAction, router]);

  // 🔹 KEY CHANGE: 가장 표준적이고 안정적인 높이 조절 로직으로 변경
  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;

      if (window.innerWidth >= 768) {
        el.style.height = "100%";
        return;
      }

      // --- 모바일 뷰 ---
      const MAX_HEIGHT_PX = 144;

      // 1. 높이를 'auto'로 초기화하여 textarea가 스스로 줄어들 수 있도록 합니다. (가장 중요!)
      el.style.height = "auto";

      // 2. 초기화된 상태에서 계산된 scrollHeight를 기반으로 새로운 높이를 설정합니다.
      el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
    }
  }, [description]);

  return (
    <form action={handleFormSubmit} className="w-full max-w-4xl mx-auto mt-3 md:mt-6 flex flex-col gap-4">
      <div
        className="w-full min-h-10 max-h-36 md:min-h-36 md:max-h-36 px-4 pr-1.5 md:pl-5 md:py-4 md:pr-3
        flex items-center md:items-stretch justify-center gap-2 
        relative rounded-[24px] md:rounded-2xl 
        bg-foreground/2 backdrop-blur-xl border border-foreground/10 shadow-2xl shadow-foreground/10"
      >
        <Textarea
          ref={textareaRef}
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={1}
          placeholder="의뢰하려는 사이트에 대해 설명해주세요."
          onWheel={(e) => e.stopPropagation()}
          className="w-full grow self-center md:self-auto p-0 min-h-0 bg-transparent border-none focus-visible:ring-0 outline-none 
                     shadow-none resize-none scrollbar-hide leading-snug text-foreground
                     md:h-full 
                     overflow-y-auto
                     overscroll-behavior-contain"
          spellCheck="false"
        />
        <div className="flex items-end h-full py-1.5 md:py-0">
          <SubmitButton isParentLoading={isParentLoading} />
        </div>
      </div>

      <div className="w-full flex flex-col space-y-2 px-2 pt-1 md:pt-0">
        <div className="text-sm text-foreground">추천 항목을 참고해보세요:</div>
        <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-2">
          {suggestionButtons.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion.description)}
              className="rounded-full text-sm text-foreground px-5 py-1 border border-foreground/50 hover:bg-foreground/10 transition-colors duration-200"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
