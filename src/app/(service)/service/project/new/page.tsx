import { Metadata } from "next";
import { auth } from "@/auth";
import CreateProject from "@/components/section/service/project/new/createproject";
import { ProjectInfoEstimateResponse } from "@/@types/service/project";

export const metadata: Metadata = {
  title: "프로젝트 만들기",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth();
  if (!session) return null;

  const params = await searchParams;

  // 단일 string 반환
  const toSingle = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v ?? "");

  // string 배열 반환
  const toArray = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

  // 안전한 enum 값 체크 함수들
  const isMethod = (v: unknown): v is ProjectInfoEstimateResponse["custom_project_method"] =>
    typeof v === "string" && (v === "code" || v === "nocode" || v === "shop");

  const isNocode = (v: unknown): v is ProjectInfoEstimateResponse["custom_nocode_platform"] =>
    typeof v === "string" && ["cafe24", "godo", "framer", "imweb", "shopify"].includes(v);

  const isPlatform = (v: unknown): v is "web" | "android" | "ios" => typeof v === "string" && (v === "web" || v === "android" || v === "ios");

  const methodRaw = toSingle(params.method);
  const method = isMethod(methodRaw) ? methodRaw : null;

  const nocodeRaw = toSingle(params.nocode);
  const nocode = isNocode(nocodeRaw) ? nocodeRaw : null;

  const platformArray = toArray(params.platform).filter(isPlatform);

  const info: ProjectInfoEstimateResponse = {
    custom_project_title: toSingle(params.title),
    custom_readiness_level: toSingle(params.readiness ?? "requirements"),
    custom_project_method: method,
    custom_nocode_platform: nocode,
    custom_platforms: platformArray,
  };

  return <CreateProject description={toSingle(params.description)} info={info} />;
}
