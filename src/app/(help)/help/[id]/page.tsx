import { auth } from "@/auth";
import HelpToolbar from "@/components/section/help/help-toolbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { HelpRead } from "@/@types/service/help";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

async function getHelp(id: string): Promise<HelpRead | null> {
  const helpUrl = process.env.NEXT_PUBLIC_HELP_URL;

  if (!helpUrl) {
    console.error("NEXT_PUBLIC_HELP_URL environment variable is not set");
    return null;
  }

  try {
    const response = await fetch(`${helpUrl}/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch help: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching help:", error);
    return null;
  }
}

export default async function HelpDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const help = await getHelp(params.id);

  if (!session?.user?.groups?.includes("/manager")) {
    redirect("/help");
  }

  if (!help) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
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
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: help.content }} />
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

      <HelpToolbar session={session} helpId={params.id} />
    </div>
  );
}
