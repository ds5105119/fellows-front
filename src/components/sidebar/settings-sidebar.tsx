"use client";

import type React from "react";
import Link from "next/link";
import SettingHeader from "@/components/header/settingheader";

import { signOut } from "next-auth/react";
import { User, Bell, CreditCard, Shield, Smartphone, Download, Building2, LogOut, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SettingsItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function SettingsSidebar() {
  const pathname = usePathname();

  const settingsSections: SettingsSection[] = [
    {
      title: "계정",
      items: [
        {
          id: "profile",
          label: "프로필 관리",
          href: "/service/settings/profile",
          icon: User,
          description: "이름, 사진, 소개 편집",
        },
        {
          id: "business",
          label: "비즈니스 관리",
          href: "/service/settings/data/business",
          icon: Building2,
          description: "계정 공개 범위 설정",
        },
        {
          id: "security",
          label: "보안 설정",
          href: "/service/settings/security",
          icon: Shield,
          description: "비밀번호 및 2단계 인증",
        },
      ],
    },
    {
      title: "알림",
      items: [
        {
          id: "notifications",
          label: "알림 설정",
          href: "/service/settings/notifications",
          icon: Bell,
          description: "푸시, 이메일 알림 관리",
        },
        {
          id: "devices",
          label: "연결된 기기",
          href: "/service/settings/devices",
          icon: Smartphone,
          description: "로그인된 기기 관리",
        },
      ],
    },
    {
      title: "결제",
      items: [
        {
          id: "billing",
          label: "청구 정보",
          href: "/service/settings/billing",
          icon: CreditCard,
          description: "결제 수단 및 요금제",
        },
        {
          id: "downloads",
          label: "다운로드",
          href: "/service/settings/downloads",
          icon: Download,
          description: "내 데이터 다운로드",
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        "h-full overflow-y-auto bg-white border-r border-gray-200 shrink-0 w-full lg:w-[24rem]",
        pathname === "/service/settings" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
      )}
    >
      {/* Header */}
      <SettingHeader />
      <div className="p-6 border-b border-gray-100 hidden md:block">
        <h2 className="text-xl font-semibold text-gray-900">설정</h2>
        <p className="text-sm text-gray-500 mt-1">계정 및 앱 설정을 관리하세요</p>
      </div>

      {/* Settings Sections */}
      <div className="grow">
        <div className="px-4 py-6 md:p-4 space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`
                        group flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
                        ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"}
                      `}
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <Icon
                          className={`
                            w-5 h-5 flex-shrink-0
                            ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}
                          `}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={`
                            text-sm font-medium
                            ${isActive ? "text-blue-700" : "text-gray-900"}
                          `}
                          >
                            {item.label}
                          </div>
                          {item.description && <div className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</div>}
                        </div>
                      </div>
                      <ChevronRight
                        className={`
                          w-4 h-4 flex-shrink-0 transition-transform duration-200
                          ${
                            isActive
                              ? "text-blue-600 transform rotate-90"
                              : "text-gray-300 group-hover:text-gray-400 group-hover:transform group-hover:translate-x-1"
                          }
                        `}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 w-full px-4 h-20 min-h-20 flex items-center border-t border-gray-100 bg-background">
        <button
          className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
          onClick={() => signOut({ redirectTo: "/" })}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  );
}
