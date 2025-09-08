import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HelpWriteForm from "@/components/section/help/help-write-form";

export default async function HelpWritePage() {
  const session = await auth();

  if (!session?.user?.groups?.includes("/manager")) {
    redirect("/help");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">새 도움말 작성</h1>
        <p className="text-gray-600">사용자들에게 도움이 될 새로운 가이드를 작성해보세요.</p>
      </div>

      <HelpWriteForm session={session} />
    </div>
  );
}
