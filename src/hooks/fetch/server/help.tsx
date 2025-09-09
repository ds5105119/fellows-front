import { HelpRead, HelpsRead } from "@/@types/service/help";
import { HelpCircle, FolderOpen, Receipt, CheckSquare, FileBarChart, AlertCircle, CreditCard, MoreHorizontal } from "lucide-react";

export const helpCategories = [
  { value: "일반", label: "일반", icon: HelpCircle },
  { value: "프로젝트", label: "프로젝트", icon: FolderOpen },
  { value: "견적서", label: "견적서", icon: Receipt },
  { value: "테스크", label: "테스크", icon: CheckSquare },
  { value: "보고서", label: "보고서", icon: FileBarChart },
  { value: "이슈", label: "이슈", icon: AlertCircle },
  { value: "구독", label: "구독", icon: CreditCard },
  { value: "기타", label: "기타", icon: MoreHorizontal },
] as const;

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
