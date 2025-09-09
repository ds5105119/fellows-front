import { auth } from "@/auth";
import HelpPageClient from "@/components/section/help/help-main";
import HelpToolbar from "@/components/section/help/help-toolbar";
import { redirect } from "next/navigation";
import { getHelps } from "@/hooks/fetch/server/help";

export default async function HelpPage() {
  const [session, helps] = await Promise.all([auth(), getHelps()]);

  if (!session?.user?.groups?.includes("/manager")) {
    redirect("/help");
  }

  return (
    <>
      <HelpPageClient helps={helps} />
      <HelpToolbar session={session} />
    </>
  );
}
