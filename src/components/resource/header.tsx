export const headerData = {
  navMain: [
    { title: "대시보드", url: "/service/dashboard", icon: "FcNews" },
    {
      title: "프로젝트",
      url: "/service/project",
      icon: "FcOpenedFolder",
      items: [
        { title: "개요", url: "/service/project" },
        { title: "작업 현황", url: "/service/project/task" },
      ],
    },
    { title: "조달사업", url: "#", icon: "FcList" },
    { title: "지원사업", url: "/service/welfare", icon: "FcList" },
    { title: "구독", url: "#", icon: "FcConferenceCall" },
  ],
  documents: [
    { title: "데이터 라이브러리", url: "#", icon: "FcDatabase" },
    { title: "리포트", url: "#", icon: "FcBarChart" },
    { title: "개발 상황", url: "#", icon: "FcCableRelease" },
  ],
  navSecondary: [
    { title: "설정", url: "/service/settings", icon: "FcSettings" },
    { title: "고객센터", url: "#", icon: "FcOnlineSupport" },
  ],
};
