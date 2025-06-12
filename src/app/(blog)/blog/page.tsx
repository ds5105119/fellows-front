import { auth } from "@/auth";
import { BlogHeader } from "@/components/blog/blog-header";
import { FeaturedSection } from "@/components/blog/featured-section";
import { BlogSection } from "@/components/blog/blog-section";
import type { BlogPostDtoType } from "@/@types/service/blog";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  // Mock data
  const mockPosts: BlogPostDtoType[] = [
    {
      title: "2025년 최저임금 이렇게 바뀝니다!",
      title_image: "https://object.iihus.com/172ca88c58c89.jpg",
      content: `# 2025년 최저임금 인상 분석

2025년 최저임금이 대폭 인상되면서 많은 기업들이 대응 방안을 모색하고 있습니다.

## 주요 변경사항

- 시급 기준 10,030원으로 인상
- 월급 기준 약 209만원 수준
- 전년 대비 3.0% 인상

## 기업 대응 방안

기업들은 다음과 같은 방안을 검토해야 합니다:

1. **인건비 예산 재조정**
2. **업무 효율성 개선**
3. **자동화 시스템 도입**

> 최저임금 인상은 단순히 비용 증가가 아닌, 조직 운영 방식을 재검토하는 기회로 활용해야 합니다.

## 결론

체계적인 준비와 대응을 통해 최저임금 인상을 성장의 기회로 만들어 나가시기 바랍니다.

# 최저임금 인상의 영향

지난 7월 12일, 고용노동부는 최저임금 인상안을 발표하였는데요. 그 결과, 2025년 최저임금은 최종 1만 30원으로 결정되었습니다. 또다시 최저임금이 1만원 대를 돌파한 것인데요.

## 산업별 영향 분석

서비스업, 제조업, IT 산업 등 각 산업별로 최저임금 인상이 미치는 영향은 상이합니다.

### 서비스업 영향

서비스업은 인건비 비중이 높아 최저임금 인상의 영향을 크게 받습니다.

### 제조업 영향

제조업은 자동화를 통해 일부 영향을 상쇄할 수 있습니다.

## 중소기업 지원 정책

정부는 중소기업의 부담을 완화하기 위해 다양한 지원 정책을 마련하고 있습니다.`,
      summary: "2025년 최저임금 인상에 따른 기업의 대응 방안과 준비사항을 알아보세요.",
      is_published: true,
      published_at: new Date("2024-07-22"),
      author: { sub: "1", name: "김인사", bio: "HR 전문가" },
      category: { name: "인사이트", description: "인사 관련 인사이트" },
      tags: [{ name: "최저임금" }, { name: "인사관리" }, { name: "2025" }],
    },
    {
      title: "중소기업 관리, 기존 방법 버리고 (+예제, 지문인식기, 모바일 앱)",
      title_image: "https://object.iihus.com/172ca88c58c89.jpg",
      content: `# 중소기업을 위한 새로운 관리 방식

기존의 관리 방식을 버리고 새로운 기술을 도입한 중소기업의 성공 사례를 소개합니다.

## 지문인식기의 활용

- 정확한 출퇴근 기록
- 보안 강화
- 관리 효율성 증대

## 모바일 앱 연동

언제 어디서나 실시간으로 관리할 수 있는 모바일 앱의 장점을 알아봅니다.`,
      summary: "중소기업에 적합한 최신 관리 기술과 그 활용 방안을 소개합니다.",
      is_published: true,
      published_at: new Date("2025-06-05"),
      author: { sub: "2", name: "이기술", bio: "기술 컨설턴트" },
      category: { name: "인사이트", description: "인사 관련 인사이트" },
      tags: [{ name: "중소기업" }, { name: "지문인식" }, { name: "모바일앱" }],
    },
    {
      title: "해외 직원과 함께 일하는 방법",
      title_image: "https://object.iihus.com/172ca88c58c89.jpg",
      content: `# 글로벌 팀 관리 가이드

해외 직원과의 협업은 현대 기업에게 필수적인 역량이 되었습니다.

## 효과적인 소통 방법

- 명확한 커뮤니케이션 채널 구축
- 시차를 고려한 회의 일정 조정
- 문화적 차이에 대한 이해

## 도구 활용

다양한 협업 도구를 활용하여 원활한 업무 진행이 가능합니다.`,
      summary: "글로벌 팀과의 효과적인 협업 방법을 알아보세요.",
      is_published: true,
      published_at: new Date("2025-06-01"),
      author: { sub: "3", name: "박글로벌", bio: "국제업무 전문가" },
      category: { name: "고객 사례", description: "고객 성공 사례" },
      tags: [{ name: "글로벌" }, { name: "협업" }, { name: "원격근무" }],
    },
    {
      title: "노사관계의 안전 노하우를 위한 대화법",
      title_image: "https://object.iihus.com/172ca88c58c89.jpg",
      content: `# 건전한 노사관계 구축하기

안정적인 노사관계는 기업 성장의 핵심 요소입니다.

## 대화의 기본 원칙

1. 상호 존중
2. 투명한 소통
3. 공정한 절차

## 갈등 해결 방법

체계적인 접근을 통해 갈등을 건설적으로 해결할 수 있습니다.`,
      summary: "건전한 노사관계 구축을 위한 실용적인 대화법을 소개합니다.",
      is_published: true,
      published_at: new Date("2025-05-28"),
      author: { sub: "4", name: "이노사", bio: "노무 전문가" },
      category: { name: "인사이트", description: "인사 관련 인사이트" },
      tags: [{ name: "노사관계" }, { name: "소통" }, { name: "갈등해결" }],
    },
    {
      title: "여름 휴가철 대비 인력 관리 방안",
      title_image: "https://object.iihus.com/172ca88c58c89.jpg",
      content: `# 휴가철 인력 운영 가이드

여름 휴가철을 대비한 체계적인 인력 관리 방안을 제시합니다.

## 휴가 계획 수립

- 부서별 휴가 일정 조율
- 필수 업무 연속성 확보
- 대체 인력 운영 방안

효과적인 휴가 관리로 직원 만족도와 업무 효율성을 동시에 확보하세요.`,
      summary: "여름 휴가철 인력 관리를 위한 체계적인 접근 방법을 알아보세요.",
      is_published: true,
      published_at: new Date("2025-05-20"),
      author: { sub: "5", name: "최휴가", bio: "인력 관리 전문가" },
      category: { name: "협동팀", description: "팀 협업 관련" },
      tags: [{ name: "휴가관리" }, { name: "인력운영" }, { name: "여름" }],
    },
    {
      title: "5S 정리법과 정돈법 활용하기",
      title_image: "https://object.iihus.com/172ca88c58c89.jpg",
      content: `# 5S 정리법 완벽 가이드

일본의 5S 정리법을 활용하여 업무 환경을 개선하는 방법을 알아보겠습니다.

## 5S의 구성 요소

1. **정리(Seiri)** - 필요한 것과 불필요한 것 구분
2. **정돈(Seiton)** - 필요한 것을 쉽게 찾을 수 있도록 배치
3. **청소(Seiso)** - 깨끗한 상태 유지
4. **청결(Seiketsu)** - 표준화된 상태 유지
5. **습관(Shitsuke)** - 지속적인 개선 문화 정착

## 실무 적용 방법

각 단계별로 체계적인 접근을 통해 업무 효율성을 크게 향상시킬 수 있습니다.`,
      summary: "5S 정리법을 통한 업무 환경 개선 방법을 소개합니다.",
      is_published: true,
      published_at: new Date("2025-05-15"),
      author: { sub: "6", name: "정정리", bio: "업무 효율성 전문가" },
      category: { name: "협동팀", description: "팀 협업 관련" },
      tags: [{ name: "5S" }, { name: "정리정돈" }, { name: "업무효율" }],
    },
  ];

  const session = await auth();

  return (
    <div className="w-full h-fuil pt-24 md:pt-24">
      <div className="px-6 md:px-0 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
        <BlogHeader />
      </div>

      <div className="bg-white pt-10 pb-20">
        <div className="px-6 md:px-0 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
          <FeaturedSection posts={mockPosts} />
        </div>
      </div>

      <div className="bg-gray-100 py-20">
        <div className="px-6 md:px-0 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
          <BlogSection title="인사이트" posts={mockPosts.slice(0, 5)} />
        </div>
      </div>

      {session?.user.groups.includes("/manager") && (
        <Link
          href="/blog/write"
          className="sticky bottom-36 md:bottom-16 mx-auto z-40 size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-blue-500 bg-blue-200 hover:bg-blue-300"
        >
          <Plus />
        </Link>
      )}
    </div>
  );
}
