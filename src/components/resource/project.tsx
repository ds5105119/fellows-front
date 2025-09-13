import { CreateERPNextProject } from "@/@types/service/project";

export const categorizedFeatures = [
  {
    title: "회원/인증",
    items: [
      { icon: "🥳", title: "회원가입 및 로그인" },
      { icon: "👥", title: "소셜 로그인" },
      { icon: "🔐", title: "본인인증 로그인" },
      { icon: "🙍", title: "회원 정보" },
      { icon: "👋", title: "회원 탈퇴" },
      { icon: "🚩", title: "회원 신고" },
    ],
  },
  {
    title: "온보딩/초기화면",
    items: [
      { icon: "", title: "초기화면" },
      { icon: "", title: "팝업" },
      { icon: "", title: "온보딩" },
    ],
  },
  {
    title: "도구 및 기술",
    items: [
      { icon: "🌐", title: "다국어 지원" },
      { icon: "📁", title: "파일 업로드" },
      { icon: "🔎", title: "검색 기능" },
      { icon: "🗺️", title: "지도" },
      { icon: "📆", title: "예약 시스템" },
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

export const stepsMeta: {
  number: number;
  title: string;
  description: string;
  fields: (keyof CreateERPNextProject)[];
  uiRequiredFields?: (keyof CreateERPNextProject)[];
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
];

export const PROJECT_METHOD_MAPPING = {
  code: {
    title: "코드 개발",
    description:
      "원하는 대로 커스터마이징할 수 있어, 복잡한 로직이나 차별화된 기능이 필요한 서비스에 적합해요. " +
      "초기 개발 비용이 높고 유지 보수 인력이 필요할 수 있어요.",
    price: {
      idea: 1000,
      requirements: 900,
      wireframe: 800,
    },
  },
  nocode: {
    title: "노코드 개발",
    description: "개발 리소스가 부족한 초기 단계나 MVP 제작에 유리하지만, " + "기능 확장이나 사용자 정의에는 제약이 있어요.",
    price: {
      idea: 120,
      requirements: 90,
      wireframe: 80,
    },
  },
  shop: {
    title: "쇼핑몰",
    description: "상품 등록, 결제, 배송 등의 핵심 기능이 기본 제공되지만, " + "쇼핑몰 외의 고유 기능 추가는 제한적이에요.",
    price: {
      idea: 250,
      requirements: 220,
      wireframe: 200,
    },
  },
} as const;

export const NOCODE_PLATFORM_MAPPING = {
  shopify: {
    title: "Shopify",
    description: "쇼핑몰에 최적화된 노코드 플랫폼이에요. 글로벌 시장에 적합한 다양한 기능을 제공해요.",
  },
  imweb: {
    title: "아임웹",
    description: "디자인과 개발을 통합한 노코드 플랫폼으로, 반응형 웹사이트 제작에 최적화되어 있어요.",
  },
  cafe24: {
    title: "카페 24",
    description: "쇼핑몰에 최적화된 노코드 플랫폼으로, 빠른 구축이 가능해요.",
  },
  framer: {
    title: "Framer",
    description: "디자인 중심의 노코드 플랫폼으로, 빠른 프로토타입 제작과 인터랙티브한 UI 구현이 가능해요.",
  },
  webflow: {
    title: "Webflow",
    description: "디자인 자유도가 높은 노코드 플랫폼으로, 픽셀 단위 커스터마이징과 반응형 웹 제작에 강점이 있어요.",
  },
  wordpress: {
    title: "WordPress",
    description: "세계적으로 가장 널리 사용되는 CMS 기반 노코드 플랫폼으로, 다양한 플러그인과 테마로 확장성이 뛰어나요.",
  },
  bubble: {
    title: "Bubble",
    description: "웹 애플리케이션 제작에 특화된 노코드 플랫폼으로, 데이터베이스 연동과 복잡한 로직 구현도 가능해요.",
  },
};

export const READYNISS_MAPPING = {
  idea: { icon: "💡", title: "아이디어 구상 단계", description: "아이디어를 구상하고 있습니다." },
  requirements: { icon: "📋", title: "기획/요구사항 정의", description: "기획/요구사항을 정의하고 있습니다." },
  wireframe: { icon: "⚒️", title: "와이어프레임/디자인", description: "와이어프레임/디자인을 정의하고 있습니다." },
};

export const STATUS_MAPPING: Record<string, string> = {
  draft: "초안",
  "process:1": "견적 확인중",
  "process:2": "계약 진행중",
  "process:3": "진행중",
  maintenance: "유지보수",
  complete: "완료",
};

export const PLATFORM_MAPPING: Record<string, string> = {
  web: "웹",
  android: "안드로이드 앱",
  ios: "iOS 앱",
};

export const statusConfig = {
  Open: {
    color: "bg-blue-100 text-blue-600 border-blue-200",
    text: "열림",
  },
  Working: {
    color: "bg-yellow-100 text-yellow-600 border-yellow-200",
    text: "진행중",
  },
  "Pending Review": {
    color: "bg-purple-100 text-purple-600 border-purple-200",
    text: "리뷰 대기 중",
  },
  Overdue: {
    color: "bg-red-100 text-red-600 border-red-200",
    text: "지연",
  },
  Template: {
    color: "bg-gray-100 text-gray-600 border-gray-200",
    text: "초안",
  },
  Completed: {
    color: "bg-green-100 text-green-600 border-green-200",
    text: "완료",
  },
  Cancelled: {
    color: "bg-gray-100 text-gray-600 border-gray-200",
    text: "취소됨",
  },
};
