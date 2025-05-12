export const headerData = {
  navMain: [
    { title: "대시보드", url: "/service/dashboard", icon: "LayoutDashboardIcon" },
    { title: "프로젝트", url: "/service/project", icon: "ListIcon" },
    { title: "조달사업", url: "#", icon: "BarChartIcon" },
    { title: "지원사업", url: "/service/welfare", icon: "FolderIcon" },
    { title: "구독", url: "#", icon: "UsersIcon" },
  ],
  documents: [
    { name: "데이터 라이브러리", url: "#", icon: "DatabaseIcon" },
    { name: "리포트", url: "#", icon: "ClipboardListIcon" },
    { name: "개발 상황", url: "#", icon: "FileIcon" },
  ],
  navSecondary: [
    {
      title: "설정",
      url: "#",
      icon: "SettingsIcon",
      items: [
        { title: "정보 관리", url: "#" },
        { title: "그룹 관리", url: "#" },
        { title: "결제 관리", url: "#" },
        { title: "구독 설정", url: "#" },
        { title: "알림 설정", url: "#" },
      ],
    },
    { title: "고객센터", url: "#", icon: "HelpCircleIcon" },
  ],
  development: [{ title: "홈", url: "/devloper", icon: "House" }],
};
