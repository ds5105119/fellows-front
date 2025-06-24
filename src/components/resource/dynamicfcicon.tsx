"use client";

import type React from "react";

import {
  FcHome,
  FcSettings,
  FcDocument,
  FcFolder,
  FcBusinessman,
  FcServices,
  FcSupport,
  FcAbout,
  FcContacts,
  FcMenu,
  FcSearch,
  FcPlus,
  FcCheckmark,
  FcCancel,
  FcNews,
  FcInfo,
  FcList,
  FcCalendar,
  FcBarChart,
  FcLineChart,
  FcPieChart,
  FcStatistics,
  FcDataSheet,
  FcTemplate,
  FcWorkflow,
  FcProcess,
  FcTimeline,
  FcTodoList,
  FcPlanner,
  FcBriefcase,
  FcDepartment,
  FcOrganization,
  FcCollaboration,
  FcConferenceCall,
  FcCustomerSupport,
  FcFeedback,
  FcSurvey,
  FcApproval,
  FcInspection,
  FcRules,
  FcPrivacy,
  FcLock,
  FcUnlock,
  FcKey,
  FcSafe,
  FcSynchronize,
  FcRefresh,
  FcUpload,
  FcDownload,
  FcImport,
  FcExport,
  FcOpenedFolder,
  FcDatabase,
  FcCableRelease,
  FcOnlineSupport,
} from "react-icons/fc";
import type { IconBaseProps } from "react-icons/lib";

type Props = {
  name: string;
  className?: string;
};

// 아이콘 매핑 테이블 - 필요한 아이콘들을 여기에 추가
const iconMap: Record<string, React.ComponentType<IconBaseProps>> = {
  FcHome,
  FcSettings,
  FcDocument,
  FcFolder,
  FcBusinessman,
  FcServices,
  FcSupport,
  FcAbout,
  FcContacts,
  FcMenu,
  FcSearch,
  FcPlus,
  FcCheckmark,
  FcCancel,
  FcNews,
  FcInfo,
  FcList,
  FcCalendar,
  FcBarChart,
  FcLineChart,
  FcPieChart,
  FcStatistics,
  FcDataSheet,
  FcTemplate,
  FcWorkflow,
  FcProcess,
  FcTimeline,
  FcTodoList,
  FcPlanner,
  FcBriefcase,
  FcDepartment,
  FcOrganization,
  FcCollaboration,
  FcConferenceCall,
  FcCustomerSupport,
  FcFeedback,
  FcSurvey,
  FcApproval,
  FcInspection,
  FcRules,
  FcPrivacy,
  FcLock,
  FcUnlock,
  FcKey,
  FcSafe,
  FcSynchronize,
  FcRefresh,
  FcUpload,
  FcDownload,
  FcImport,
  FcExport,
  FcOpenedFolder,
  FcDatabase,
  FcCableRelease,
  FcOnlineSupport,
};

export default function DynamicFcIcon({ name, className }: Props) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Icon ${name} not found. Available icons:`, Object.keys(iconMap));
    }

    return (
      <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
        <span className="text-xs text-gray-500 font-mono">?</span>
      </div>
    );
  }

  return <IconComponent className={className} />;
}
