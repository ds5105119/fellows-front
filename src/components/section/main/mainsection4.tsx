"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function calculateScale(width: number): number {
  if (width > 1536) return 1;
  return 0.3 + (width / 1536) * 0.7;
}

const fixedIcons = [
  { id: "google-drive", alt: "Google Drive", x: 6, y: 15, size: 120, delay: 0.1, src: "/main-section-4-3.png" },
  { id: "box", alt: "Box", x: 67, y: 8, size: 144, delay: 0.2, src: "/main-section-4-2.png" },
  { id: "canva", alt: "Canva", x: 32, y: 25, size: 112, delay: 0.3, src: "/main-section-4-4.png" },
  { id: "figma", alt: "Figma", x: 57, y: 35, size: 115, delay: 0.4, src: "/main-section-4-8.jpg" },
  { id: "notion", alt: "Notion", x: 10, y: 60, size: 115, delay: 0.5, src: "/main-section-4-5.png" },
  { id: "word", alt: "Microsoft Word", x: 35, y: 50, size: 88, delay: 0.6, src: "/main-section-4-7.png" },
  { id: "excel", alt: "Excel", x: 55, y: 70, size: 112, delay: 0.8, src: "/main-section-4-6.png" },
  { id: "powerpoint", alt: "PowerPoint", x: 80, y: 60, size: 88, delay: 1.0, src: "/main-section-4-1.png" },
] as const;

const features = [
  "실시간 진행 상황 추적",
  "GPS 기반 위치 기록",
  "자동 견적 생성",
  "계약서 PDF 자동화",
  "프로젝트별 이슈 트래킹",
  "전자결제 시스템 연동",
  "글로벌 인력 매칭",
  "출근·퇴근 자동 기록",
  "팀 단위 협업 지원",
  "SaaS 기반 확장 구조",
  "Webhook 기반 알림",
  "자동 세금계산서 발행",
  "역할 기반 권한 관리",
  "모바일 최적화 UI",
  "소셜 로그인 통합",
  "Slack 연동 가능",
  "이메일 자동 발송",
  "프로젝트 간 비교 분석",
  "간편한 팀 초대 링크",
  "견적서 버전 관리",
  "프로젝트 히스토리 보존",
  "실시간 변경 추적",
  "ERP 통합 회계 처리",
  "공수 산정 자동화",
  "외주 계약서 자동 생성",
  "클라이언트 승인 관리",
  "진행률 시각화",
  "디자인 시안 공유",
  "글로벌 기준 시차 동기화",
  "협업자 변경 내역 추적",
  "모바일 푸시 알림",
  "팀별 근무 시간 분석",
  "해외 개발자 DB 연동",
  "자동 백업 설정",
  "보고서 PDF 내보내기",
  "인보이스 자동 생성",
  "작업자별 KPI 분석",
  "피드백 수집 툴",
  "단가 기준 견적 조정",
  "실시간 화상 회의 연결",
  "ERPNext 기반 강력한 백엔드",
  "워크플로우 정의 가능",
  "디자인 하우스 연계",
  "메일 발송 이력 추적",
  "공지사항 자동 전파",
  "고객 요구사항 기록",
  "프로젝트 복제 기능",
  "대시보드 커스터마이징",
  "다국어 지원 예정",
  "팀별 지표 시각화",
  "외부 고객 계정 초대",
  "소셜 미디어 캠페인 추적",
  "반응형 디자인",
  "리소스 배정 자동화",
  "오토스케일링 인프라",
  "API 키 관리 시스템",
  "정산 금액 자동 계산",
  "프로젝트 진행 알림",
  "데이터 기반 의사결정",
  "실시간 채팅 모듈",
  "사용자 행동 분석",
  "CI/CD 배포 자동화",
  "견적 요청 이력 관리",
  "개발사-디자인사 매칭",
  "유휴 리소스 탐지",
  "주간 리포트 이메일 전송",
  "이메일 도메인 인증",
  "서비스 이용현황 분석",
  "기술스택 기준 태깅",
  "사용자 만족도 측정",
  "외부 컨설턴트 연결",
  "PDF 미리보기 기능",
  "협업 시간 자동 누적",
  "기술 지원 채팅 연동",
  "KPI 목표 설정",
  "사용자 정의 태그",
  "프로젝트 우선순위 설정",
  "버그 추적 시스템 통합",
  "모바일 앱 푸시 알림",
  "실시간 문서 공동 편집",
  "자동 로그 분석 및 보고",
  "사용자 맞춤 대시보드",
  "자동 이메일 템플릿 관리",
  "외부 API 연동 확장성",
  "자동 데이터 동기화",
  "클라우드 스토리지 연동",
  "컨텐츠 배포 네트워크 지원",
  "작업 우선순위 자동 분배",
  "통합 캘린더 관리",
  "사용자 권한 세분화",
  "팀 내 역할 분담 관리",
  "실시간 고객 지원 채팅",
  "작업 타임라인 시각화",
  "알림 우선순위 설정",
  "협업 메모 공유 기능",
  "자동 작업 상태 업데이트",
  "문서 버전 관리 시스템",
  "인공지능 기반 견적 추천",
  "사용자 접속 이력 분석",
  "협업 회의록 자동 생성",
  "비용 예측 및 관리",
  "프로젝트 일정 자동 조정",
  "외부 파트너사 관리",
  "팀 생산성 분석 리포트",
];

export default function MainSection4() {
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale(window.innerWidth));
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="col-span-full px-4 flex flex-col space-y-4 md:space-y-6 pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">다른 업체와는 비교 불허</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            Fellows는 글로벌 개발 파트너사, 디자인 하우스 등<br />
            100명 이상의 전문가들과 협력하고 있습니다.
          </h4>
        </div>
      </div>

      <div className="col-span-1 md:pr-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0">
        <div className="w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden relative bg-white">
          {/* 텍스트 - 최상위 레이어 */}
          <div className="pt-6 px-6 md:pt-10 md:px-10 flex flex-col space-y-1.5 z-50 w-full">
            <div className="flex flex-col space-y-2">
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Team</p>
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                각 분야 전문가로 구성된 팀이
                <br />
                프로젝트 완수를 위해
              </p>
            </div>
          </div>

          {/* 고정 위치 앱 아이콘들 - Floating 효과 */}
          <div className="grow w-full relative">
            {fixedIcons.map((icon) => (
              <motion.div
                key={icon.id}
                className="absolute select-none"
                style={{
                  left: `${icon.x}%`,
                  top: `${icon.y}%`,
                }}
                animate={{
                  y: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                  x: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
                }}
                transition={{
                  x: {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={icon.size}
                  height={icon.size}
                  className="rounded-xl md:rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.12)] shrink-0 object-cover"
                  style={{
                    width: `${icon.size * scale}px`,
                    height: `${icon.size * scale}px`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-1 md:pl-4 aspect-[7/9] md:aspect-[8/9] mb-10 md:mb-0">
        <div className="w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden relative bg-white">
          {/* 텍스트 - 최상위 레이어 */}
          <div className="pt-6 px-6 md:pt-10 md:px-10 flex flex-col space-y-1.5 z-50 w-full">
            <div className="flex flex-col space-y-2">
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-emerald-500">/Team</p>
              <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                강력하게 조합된 인프라로
                <br />
                최대 효율 달성
              </p>
            </div>
          </div>

          {/* 고정 위치 앱 아이콘들 - Floating 효과 */}
          <div className="grow my-6 w-full relative overflow-hidden">
            <div className="absolute -inset-x-25 inset-y-0 flex flex-wrap gap-3">
              {features.map((val, idx) => {
                return (
                  <div key={idx} className="flex items-center justify-center px-5 py-1 rounded-full bg-black h-fit text-white text-lg md:text-xl font-semibold">
                    {val}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
