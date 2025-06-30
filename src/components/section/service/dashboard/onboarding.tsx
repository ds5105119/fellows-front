import { auth, signIn } from "@/auth";
import type { Session } from "next-auth";
import { projectsPaginatedResponseSchema, type UserERPNextProject } from "@/@types/service/project";
import { getUser, updateUser } from "@/hooks/fetch/server/user";
import { userData } from "@/@types/accounts/userdata";
import { OnboardingClient } from "./onboarding-client";

interface OnboardingProps {
  onboarding: boolean;
  hasProject: boolean;
  hasInquery: boolean;
  dashboard_1_2_end: boolean;
  project?: UserERPNextProject;
}

const getOnboarding = async ({ session }: { session: Session }): Promise<OnboardingProps> => {
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}`;

  try {
    // 프로젝트가 하나라도 존재하는가
    const projectResponse = await fetch(`${url}?size=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!projectResponse.ok) {
      const errorData = await projectResponse.json();
      throw new Error(errorData.message || `HTTP error! status: ${projectResponse.status}`);
    }

    const projectResponseResponseData = await projectResponse.json();
    const projectResponseParsedData = projectsPaginatedResponseSchema.parse(projectResponseResponseData);
    const hasProject = projectResponseParsedData.items.length > 0;

    // 진행중인 프로젝트가 하나라도 존재하는가
    const inQueryResponse = await fetch(`${url}?size=1&status=process`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      redirect: "follow",
      credentials: "include",
    });

    if (!inQueryResponse.ok) {
      const errorData = await inQueryResponse.json();
      throw new Error(errorData.message || `HTTP error! status: ${inQueryResponse.status}`);
    }

    const inQueryResponseResponseData = await inQueryResponse.json();
    const inQueryResponseParsedData = projectsPaginatedResponseSchema.parse(inQueryResponseResponseData);
    const hasInQuery = inQueryResponseParsedData.items.length > 0;

    // 온보딩 2가 진행되었는가?
    const user = await getUser();
    const rawUserData = JSON.parse(user.attributes.userData ? user.attributes.userData[0] : "{}");
    const user_data = userData.parse(rawUserData);

    return {
      onboarding: user_data.dashboard_1_open ?? true,
      hasProject: hasProject,
      hasInquery: hasInQuery,
      dashboard_1_2_end: user_data.dashboard_1_2_end ?? false,
      project: inQueryResponseParsedData.items[0],
    };
  } catch (error) {
    throw error;
  }
};

export default async function Onboarding() {
  const session = await auth();

  if (!session) return signIn("keycloak", { redirectTo: "/service/dashboard" });

  const { onboarding, hasProject, hasInquery, dashboard_1_2_end, project } = await getOnboarding({ session });

  return (
    <OnboardingClient
      initialOnboarding={onboarding}
      hasProject={hasProject}
      hasInquery={hasInquery}
      dashboard_1_2_end={dashboard_1_2_end}
      project={project}
      updateUser={updateUser}
    />
  );
}
