import { auth } from "@/auth";
import HelpToolbar from "@/components/section/help/help-toolbar";
import { notFound, redirect } from "next/navigation";
import HelpSidebar from "@/components/section/help/help-sidebar";
import { getHelp, getHelps } from "@/hooks/fetch/server/help";
import MarkdownPreview from "@/components/ui/markdownpreview";

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

  return (
    <div className="flex h-full">
      <HelpSidebar helps={helps} help={help} />
      <div className="mt-12 md:mt-0 md:ml-48 w-full flex flex-col items-center p-5 h-full overflow-y-auto">
        <div className="mb-4 md:mb-6 w-full">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 text-balance">{help.title}</h2>
          {help.summary && <p className="text-sm md:text-base text-gray-600 text-pretty">{help.summary}</p>}
        </div>

        {help.arcade && (
          <div style={{ position: "relative", height: 0, width: "100%" }} className="pb-[calc(66%)] md:pb-[calc(52.32142857142858%)]">
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
        )}

        {help.content && (
          <div className="w-full mt-4 md:mt-6">
            <MarkdownPreview loading={false} className="prose-h1:text-3xl prose-h1:font-extrabold [&_p]:my-1">
              {help.content.replace(/\\n/g, "\n")}
            </MarkdownPreview>
          </div>
        )}
      </div>

      <HelpToolbar session={session} helpId={id} />
    </div>
  );
}
