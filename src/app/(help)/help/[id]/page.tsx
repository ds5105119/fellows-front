import { auth } from "@/auth";
import HelpToolbar from "@/components/section/help/help-toolbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import HelpSidebar from "@/components/section/help/help-sidebar";
import { getHelp, getHelps } from "@/hooks/fetch/server/help";

export default async function HelpDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const helps = await getHelps();
  const help = await getHelp(id);

  if (!session?.user?.groups?.includes("/manager")) {
    redirect("/help");
  }

  if (!help) {
    notFound();
  }

  if (help.arcade) {
    return (
      <div className="flex h-full">
        <HelpSidebar helps={helps} help={help} />
        <div className="ml-48 w-full flex flex-col items-center justify-center p-6">
          <div style={{ position: "relative", paddingBottom: "calc(52.32142857142858%)", height: 0, width: "100%" }}>
            <iframe
              src={help.arcade}
              title="새 프로젝트 생성하기"
              frameBorder="0"
              loading="lazy"
              allowFullScreen
              allow="clipboard-write"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", colorScheme: "light" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {help.category}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">{help.title}</h1>
          {help.summary && <p className="text-xl text-gray-600 text-pretty">{help.summary}</p>}
        </div>

        {/* Title Image */}
        {help.title_image && (
          <div className="mb-8">
            <img src={help.title_image || "/placeholder.svg"} alt={help.title} className="w-full h-64 object-cover rounded-lg shadow-lg" />
          </div>
        )}

        {/* Content */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">도움말 내용</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap" />
            </div>
          </CardContent>
        </Card>

        {/* Back to Help List */}
        <div className="mt-8 text-center">
          <Link href="/help" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            ← 도움말 목록으로 돌아가기
          </Link>
        </div>
      </div>

      <HelpToolbar session={session} helpId={id} />
    </div>
  );
}
