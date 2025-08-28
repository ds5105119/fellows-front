// app/actions.ts

"use server";

import { ProjectInfoEstimateResponse, projectInfoEstimateResponseSchema } from "@/@types/service/project";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export type EstimateFormState =
  | {
      success: true;
      description: string;
      info: ProjectInfoEstimateResponse;
      error?: undefined;
    }
  | {
      success?: undefined;
      error: string;
    }
  | null;

export async function getEstimateInfo(description: string): Promise<EstimateFormState> {
  const session = await auth();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  if (!description?.trim()) {
    return { error: "내용이 비어있습니다." };
  }

  const params = new URLSearchParams();
  params.append("project_summary", description);

  try {
    const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/estimate/info?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (response.ok) {
      const infoJson = await response.json();
      const info = projectInfoEstimateResponseSchema.parse(infoJson);

      const cookieStore = await cookies();
      cookieStore.delete("pendingDescription");

      // 성공 시, 정의된 타입에 맞는 객체를 반환합니다.
      return { success: true, description, info };
    }

    if (response.status === 429) {
      return { error: "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." };
    }

    return { error: `견적 생성에 실패했습니다. (오류 코드: ${response.status})` };
  } catch (e) {
    console.error("getEstimateInfo Action Error:", e);
    return { error: "알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요." };
  }
}

export async function getEstimateInfoAction(_prevState: EstimateFormState, formData: FormData): Promise<EstimateFormState> {
  const session = await auth();
  if (!session) {
    return { error: "로그인이 필요합니다." };
  }

  const description = formData.get("description") as string;
  if (!description?.trim()) {
    return { error: "내용이 비어있습니다." };
  }

  const params = new URLSearchParams();
  params.append("project_summary", description);

  try {
    const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/estimate/info?${params.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (response.ok) {
      const infoJson = await response.json();
      const info = projectInfoEstimateResponseSchema.parse(infoJson);

      const cookieStore = await cookies();
      cookieStore.delete("pendingDescription");

      // 성공 시, 정의된 타입에 맞는 객체를 반환합니다.
      return { success: true, description, info };
    }

    if (response.status === 429) {
      return { error: "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." };
    }

    return { error: `견적 생성에 실패했습니다. (오류 코드: ${response.status})` };
  } catch (e) {
    console.error("getEstimateInfo Action Error:", e);
    return { error: "알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요." };
  }
}
