import { UserERPNextProjectType } from "@/@types/service/project";

export const categorizedFeatures = [
  {
    title: "도구 및 기술",
    items: [
      { icon: "✏️", title: "노코드 웹", description: "비용을 크게 절감할 수 있지만 커스터마이징이 제한됩니다." },
      { icon: "🌐", title: "다국어 지원" },
      { icon: "📁", title: "파일 업로드" },
      { icon: "🔎", title: "검색 기능" },
      { icon: "🗺️", title: "지도" },
      { icon: "📆", title: "예약 시스템" },
    ],
  },
  {
    title: "회원/인증",
    items: [
      { icon: "🔐", title: "회원가입 및 로그인" },
      { icon: "👥", title: "소셜 로그인" },
      { icon: "🙍", title: "회원 관리" },
    ],
  },
  {
    title: "운영/관리자",
    items: [
      { icon: "🛠️", title: "관리자 페이지", description: "운영자가 상품, 회원, 게시글을 관리할 수 있어요." },
      { icon: "📈", title: "관리자 통계", description: "GA 또는 관리자 페이지에 각종 지표를 시각화해 제공해요." },
      { icon: "💾", title: "데이터 백업", description: "주기적으로 데이터 백업을 하고 복구할 수 있어요." },
    ],
  },
  {
    title: "쇼핑몰 기능",
    items: [
      { icon: "🛒", title: "상품관리", description: "상품 등록, 수정, 카테고리 관리가 가능해요." },
      { icon: "📦", title: "배송관리", description: "주문 처리 및 송장 등록이 가능해요." },
      { icon: "💳", title: "PG 연동", description: "결제 시스템을 연동해 사용자 결제를 처리할 수 있어요." },
      { icon: "🧾", title: "세금계산서/영수증" },
    ],
  },
  {
    title: "사용자 인터페이스",
    items: [
      { icon: "📱", title: "마이페이지" },
      { icon: "⚙️", title: "설정 페이지" },
      { icon: "🚀", title: "온보딩", description: "처음 접속한 사용자에게 앱 소개와 사용법을 안내해요." },
      { icon: "📞", title: "고객센터" },
      { icon: "📚", title: "문서/헬프 센터", description: "사용자 가이드를 문서로 제공할 수 있어요." },
      { icon: "🔔", title: "알림", description: "웹 알림이나 이메일, 푸시 알림 기능을 제공해요." },
      { icon: "💬", title: "채팅 기능" },
      { icon: "📝", title: "게시물" },
      { icon: "🚩", title: "신고 기능" },
    ],
  },
  {
    title: "프리미엄 기능",
    items: [
      { icon: "📱", title: "네이티브 앱", description: "LiDAR과 같은 휴대폰의 고급 기능을 활용할 수 있지만 개발 비용이 높아집니다." },
      { icon: "🧩", title: "플러그인 시스템", description: "추가 기능을 쉽게 붙일 수 있는 구조를 제공합니다." },
      { icon: "🌐", title: "고급 다국어 지원", description: "문화적 특성을 고려한 수준으로 현지화합니다." },
      { icon: "🚀", title: "고급 파일 관리", description: "대용량 처리, CDN 활용 등 전문적인 파일 관리 시스템을 제공합니다." },
      { icon: "🔎", title: "지능형 검색", description: "오타 보정, 연관 검색어, 개인화 결과 등 AI 기반의 스마트 검색 기능을 제공합니다." },
      { icon: "🗺️", title: "고급 위치 기반 서비스", description: "실시간 경로 안내, 주변 추천 등 다양한 위치 기반 서비스를 제공합니다." },
      { icon: "🛡️", title: "고도화된 권한 관리", description: "팀별, 직책별 등 역할 및 접근 제어 시스템을 구축합니다." },
      { icon: "🧠", title: "AI 기능", description: "AI 챗봇, AI 모델 학습, AI 기반의 자동화된 작업 등을 제공합니다." },
      { icon: "💬", title: "다기능 실시간 채팅", description: "파일 공유, 읽음 확인, 실시간 번역 등 풍부한 기능을 갖춘 고급 채팅 환경을 제공합니다." },
    ],
  },
];

export const readinessLevelLabels = {
  idea: { icon: "💡", title: "아이디어 구상 단계", description: "아이디어를 구상하고 있습니다." },
  requirements: { icon: "📋", title: "기획/요구사항 정의", description: "기획/요구사항을 정의하고 있습니다." },
  wireframe: { icon: "⚒️", title: "와이어프레임/디자인", description: "와이어프레임/디자인을 정의하고 있습니다." },
};

export const stepsMeta: {
  number: number;
  title: string;
  description: string;
  fields: (keyof UserERPNextProjectType)[];
  uiRequiredFields?: (keyof UserERPNextProjectType)[];
}[] = [
  {
    number: 1,
    title: "필수 정보를 입력해주세요.",
    description: "꼼꼼히 읽고 프로젝트에 필요한 기능을 자동으로 추천해드릴께요.",
    fields: ["custom_project_title", "custom_project_summary", "custom_platforms", "custom_readiness_level"],
    uiRequiredFields: ["custom_project_title", "custom_project_summary", "custom_platforms", "custom_readiness_level"],
  },
  {
    number: 2,
    title: "필요한 기능을 선택해주세요.",
    description: "나중에 프로젝트 컨설턴트가 직접 프로젝트를 확인하고, \n부족한 기능은 보완해 드릴께요.",
    fields: [
      "custom_features",
      "custom_content_pages",
      "custom_preferred_tech_stacks",
      "expected_start_date",
      "expected_end_date",
      "custom_maintenance_required",
    ],
  },
] as const;
