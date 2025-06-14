export const settingsTitles = {
  "/service/settings/profile": "프로필 설정",
  "/service/settings/data/business": "비즈니스 설정",
} as const;

type SettingsPath = keyof typeof settingsTitles;

export function getSettingsTitle(pathname: string): string {
  return settingsTitles[pathname as SettingsPath] ?? "설정";
}
