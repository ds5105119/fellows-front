import { HelpRead, HelpsRead } from "@/@types/service/help";

export async function getHelps(): Promise<HelpsRead> {
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

export async function getHelp(id: string): Promise<HelpRead | null> {
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
