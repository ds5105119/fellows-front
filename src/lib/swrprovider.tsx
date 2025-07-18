"use client";
import { SWRConfig } from "swr";
export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 30000,
      }}
    >
      {children}
    </SWRConfig>
  );
};
