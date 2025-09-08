import { auth } from "@/auth";
import HelpPageClient from "@/components/section/help/help-main";
import type { HelpsRead } from "@/@types/service/help";
import HelpToolbar from "@/components/section/help/help-toolbar";
import { redirect } from "next/navigation";

async function getHelps(): Promise<HelpsRead> {
  try {
    const helpUrl = process.env.NEXT_PUBLIC_HELP_URL;

    if (!helpUrl) {
      console.error("NEXT_PUBLIC_HELP_URL environment variable is not set");
      return { items: [] };
    }

    const response = await fetch(helpUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HelpsRead = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch helps:", error);
    return { items: [] };
  }
}

export default async function HelpPage() {
  const [session, helps] = await Promise.all([auth(), getHelps()]);

  if (!session?.user?.groups?.includes("/manager")) {
    redirect("/help");
  }

  return (
    <div>
      <HelpPageClient session={session} helps={helps} />
      <HelpToolbar session={session} />
    </div>
  );
}
