export const headerData = {
  navMain: [
    { title: "대시보드", url: "/service/dashboard", icon: "FcNews" },
    {
      title: "프로젝트",
      url: "/service/project",
      icon: "FcOpenedFolder",
      items: [
        { title: "프로젝트", url: "/service/project", icon: "FcOpenedFolder" },
        { title: "계약서", url: "/service/project/contracts", icon: "FcRules" },
      ],
    },
    {
      title: "작업 현황",
      url: "/service/project/task",
      icon: "FcTodoList",
      items: [
        { title: "테스크", url: "/service/project/task", icon: "FcTodoList" },
        { title: "보고서", url: "/service/project/task/report", icon: "FcNews" },
      ],
    },
    { title: "이슈", url: "/service/project/issue", icon: "FcTreeStructure" },
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
    { title: "알림", url: "/service/notification", icon: "FcInfo" },
    { title: "고객센터", url: "#", icon: "FcOnlineSupport" },
  ],
};
