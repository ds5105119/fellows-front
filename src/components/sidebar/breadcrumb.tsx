"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const nameMapping: Record<string, string> = {
  project: "프로젝트",
  dashboard: "대시보드",
  welfare: "지원사업",
  service: "서비스",
  data: "데이터",
  report: "리포트",
  development: "개발상황",
  library: "라이브러리",
  settings: "설정",
  information: "정보",
  group: "그룹",
  user: "사용자",
  documents: "문서",
  profile: "프로필",
};

export default function BreadCrumb() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathNames.map((segment, index) => {
          const href = "/" + pathNames.slice(0, index + 1).join("/");
          const name = nameMapping[segment];

          if (!name) {
            return null;
          }

          return index === pathNames.length - 1 ? (
            <BreadcrumbPage key={index}>{name}</BreadcrumbPage>
          ) : (
            <div className="flex items-center gap-2" key={index}>
              <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
              <BreadcrumbSeparator />
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

//               {index !== pathNames.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
