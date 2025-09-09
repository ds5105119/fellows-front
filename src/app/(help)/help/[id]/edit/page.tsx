import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HelpWriteForm from "@/components/section/help/help-write-form";
import { getHelp } from "@/hooks/fetch/server/help";

export default async function HelpEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const help = await getHelp(id);

  if (!session?.user?.groups?.includes("/manager")) {
    redirect("/help");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <HelpWriteForm session={session} help={help} />
    </div>
  );
}
