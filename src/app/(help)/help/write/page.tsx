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
      <HelpWriteForm session={session} />
    </div>
  );
}
