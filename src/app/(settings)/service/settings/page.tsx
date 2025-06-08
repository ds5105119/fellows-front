"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/service/settings") {
      if (window.innerWidth >= 768) {
        router.push("/service/settings/profile");
      }
    }
  }, [pathname, router]);

  return null;
}
