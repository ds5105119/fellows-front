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
    { title: "구독", url: "#", icon: "FcConferenceCall" },
  ],
  navSecondary: [
    { title: "설정", url: "/service/settings", icon: "FcSettings" },
    { title: "고객센터", url: "#", icon: "FcOnlineSupport" },
  ],
};
