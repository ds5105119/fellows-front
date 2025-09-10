interface Plan {
  name: string;
  subtitle: string;
  description: string;
  price?: number;
  period?: string;
  features: { title: string; bold: boolean }[];
}

export const tabs = [
  { id: "outsourcing", label: "외주" },
  { id: "subscription", label: "구독" },
  { id: "shopify", label: "Shopify" },
];

export const shopifyPlans: Plan[] = [
  {
    name: "Growth Boost",
    subtitle: "사업 초기",
    description: "합리적인 금액으로 쇼피파이 스토어 구축을 진행할 수 있습니다. 빠른 스토어 구축을 통해서 매출 발생이후 스토어를 고도화 해보세요.",
    features: [
      { title: "반응형 디자인", bold: false },
      { title: "스토어 테마 제공", bold: false },
      { title: "스토어 기본 세팅", bold: false },
      { title: "상품수 20개 이하 등록지원", bold: true },
      { title: "상품진열 및 가이드 개발", bold: false },
      { title: "검색 엔진 최적화", bold: false },
      { title: "글로벌 결제모듈(페이팔) 세팅 지원", bold: true },
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
      { title: "상품수 40개 이하 등록 지원", bold: true },
      { title: "상품 진열 및 가이드 제안", bold: false },
      { title: "검색 엔진 최적화", bold: false },
      { title: "글로벌 결제모듈(페이팔) 세팅 지원", bold: true },
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
      { title: "상품수 100개 이하 등록 지원", bold: true },
      { title: "상품 진열 및 가이드 제안", bold: false },
      { title: "검색 엔진 최적화", bold: false },
      { title: "글로벌 결제모듈(페이팔)/PG세팅 지원", bold: true },
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
    description: "브랜딩에 따른 기능 개발은 물론 서드파티 앱들과 테마의 유기적인 UX/UI 통합을 지원합니다. 개발 지원 서비스를 제공합니다.",
    features: [
      { title: "반응형 디자인", bold: false },
      { title: "스토어 테마 제공", bold: false },
      { title: "스토어 기본 세팅", bold: false },
      { title: "테마 풀커스텀", bold: true },
      { title: "상품수 협의 등록 지원", bold: true },
      { title: "상품 진열 및 가이드 제안", bold: false },
      { title: "검색 엔진 최적화", bold: false },
      { title: "글로벌 결제모듈(페이팔)/PG세팅 지원", bold: true },
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
];

export const subscriptionPlans: Plan[] = [
  {
    name: "Free",
    subtitle: "사업 초기",
    price: 0,
    description: "사업 초기 무료 혜택으로 Fellows의 기술 제휴를 받아볼 수 있습니다.",
    features: [
      { title: "정기 비지니스 멘토링 제공(월 1회)", bold: false },
      { title: "사업 계획서 기술 검토", bold: false },
    ],
  },
  {
    name: "Basic",
    subtitle: "유지보수",
    price: 100,
    description: "개발 이후 Fellows에서 유지보수만 필요한 경우 합리적인 가격으로 지속적인 지원을 받을 수 있습니다.",
    features: [
      { title: "실시간 소통 채널 운영", bold: false },
      { title: "Fellows SaaS를 통한 WBS를 통한 개발 상황 추적", bold: false },
      { title: "Fellows SaaS를 통한 일별 월별 보고서 생성 가능", bold: false },
      { title: "서버 운영 및 관리(유지보수)", bold: true },
      { title: "24시간 이내 SW 1차 장애 대응 진행", bold: true },
      { title: "분야별 전담팀 배정 (개발자)", bold: false },
      { title: "월 15시간 개발 크레딧 제공", bold: true },
    ],
  },
  {
    name: "Business",
    subtitle: "개발 인력이 필요한 팀",
    price: 250,
    description: "구독형 개발로 Fellows에서 안정적으로 유지관리를 하는 동시에 새로운 개발 비용을 절감할 수 있습니다.",
    features: [
      { title: "실시간 소통 채널 운영", bold: false },
      { title: "Fellows SaaS를 통한 WBS를 통한 개발 상황 추적", bold: false },
      { title: "Fellows SaaS를 통한 일별 월별 보고서 생성 가능", bold: false },
      { title: "Fellows SaaS를 통한 프로젝트 모니터링", bold: false },
      { title: "서버 운영 및 관리(유지보수)", bold: true },
      { title: "24시간 이내 SW 1차 장애 대응 진행", bold: true },
      { title: "분야별 전담팀 배정 (개발자, 기획, 디자인)", bold: false },
      { title: "Fellows Project Manager 1명", bold: true },
      { title: "월 100시간 개발 크레딧 제공", bold: true },
    ],
  },
  {
    name: "Enterprise",
    subtitle: "개발팀이 필요한 기업",
    description: "주도적인 개발팀이 필요한 경우, 스프린트 단위로 지속적인 개발이 필요한 경우, 인하우스와 같이 긴밀하게 협업할 개발팀이 필요한 경우 적합합니다.",
    features: [
      { title: "실시간 소통 채널 운영", bold: false },
      { title: "Fellows SaaS를 통한 WBS를 통한 개발 상황 추적", bold: false },
      { title: "Fellows SaaS를 통한 프로젝트 모니터링", bold: false },
      { title: "서버 운영 및 관리(유지보수)", bold: true },
      { title: "24시간 이내 SW 1차 장애 대응 진행", bold: true },
      { title: "분야별 전담팀 배정 (개발자, 기획, 디자인)", bold: false },
      { title: "Fellows Project Manager 1명", bold: true },
      { title: "협의 개발 크레딧 제공", bold: true },
    ],
  },
];

export const outsourcingPlans: Plan[] = [
  {
    name: "노코드 Standard",
    subtitle: "합리적인 맞춤형 패키지",
    description: "랜딩 페이지 제작 등에 특화된 솔루션입니다. 빠른 시간 내에 메인 1페이지를 최대 6섹션까지 커스터마이즈 할 수 있습니다.",
    features: [
      { title: "브랜드 맞춤 기획 & 카피라이팅 & 맞춤형 디자인", bold: false },
      { title: "반응형 웹디자인(PC+Mobile)", bold: false },
      { title: "기본 SEO설정", bold: false },
      { title: "문의폼 1개 + HTML/CSS 커스터마이징", bold: true },
      { title: "파비콘 제작", bold: false },
      { title: "2회 수정", bold: true },
    ],
  },
  {
    name: "노코드 Deluxe",
    subtitle: "브랜드 정체성 강화",
    description: "간단한 기업 소개 페이지 등에 특화된 솔루션입니다. 메인 1페이지와 서브 4페이지까지 커스터마이즈 할 수 있습니다.",
    features: [
      { title: "브랜드 맞춤 기획 & 카피라이팅 & 맞춤형 디자인", bold: false },
      { title: "반응형 웹디자인 + 기본 애니메이션", bold: false },
      { title: "SEO설정 + 게시판/문의폼 커스텀", bold: true },
      { title: "게시판/문의폼 커스텀", bold: false },
      { title: "SNS연동(인스타그램, 유튜브 등)", bold: true },
      { title: "HTML/CSS/JS 커스터마이징", bold: false },
      { title: "3회 수정", bold: true },
      { title: "1개월 무료 유지보수(텍스트/이미지 수정)", bold: false },
      { title: "파비콘 제작", bold: false },
    ],
  },
  {
    name: "노코드 Premium",
    subtitle: "예약, 결제 맞춤 기능",
    description: "호텔 예약, 결제 연동 등이 필요한 사이트에 적합한 솔루션입니다. 메인 1페이지와 서브 8페이지까지 커스터마이즈 할 수 있습니다.",
    features: [
      { title: "브랜드 맞춤 기획 & 카피라이팅 & 맞춤 디자인", bold: false },
      { title: "커스텀 반응형 + 고급 인터랙션/애니메이션", bold: false },
      { title: "SNS/외부 플랫폼 연동", bold: true },
      { title: "맞춤형 기능 개발(예약, 결제 등)", bold: true },
      { title: "고급 SEO 최적화", bold: false },
      { title: "HTML/CSS/JS 커스터마이징", bold: false },
      { title: "5회 수정", bold: true },
      { title: "2개월 무료 유지보수(텍스트/이미지 수정)", bold: false },
      { title: "이미지, 파비콘 제작", bold: false },
    ],
  },
  {
    name: "코드",
    subtitle: "완전 맞춤형 개발",
    description: "기능과 확장성이 필요한 프로젝트에 적합한 솔루션입니다. 전문적인 웹 또는 앱이 필요한 경우 적합합니다.",
    features: [
      { title: "완전 맞춤형 개발", bold: true },
      { title: "복잡한 기능 구현", bold: true },
      { title: "확장성과 성능 최적화", bold: false },
      { title: "데이터베이스 설계 및 구축", bold: false },
      { title: "API 개발 및 연동", bold: true },
      { title: "사용자 인증 및 권한 관리", bold: false },
      { title: "실시간 기능 구현", bold: false },
      { title: "클라우드 인프라 구축", bold: false },
    ],
  },
];
