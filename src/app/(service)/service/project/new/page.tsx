import { Metadata } from "next";
import { auth } from "@/auth";
import CreateProject from "@/components/section/service/project/new/createproject";

export const metadata: Metadata = {
  title: "프로젝트",
  description: "이메일로 회원가입하고 맞춤형 복지 정책 정보를 받아보세요.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth();
  if (!session) return null;

  const rawTitle = (await searchParams).title;
  const title = Array.isArray(rawTitle) ? rawTitle[0] : rawTitle;

  return <CreateProject title={title} />;
}
