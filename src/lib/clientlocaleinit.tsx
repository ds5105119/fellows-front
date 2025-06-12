"use client";

import { useEffect } from "react";
import { setDayjsLocale } from "@/lib/dayjs";

export default function ClientLocaleInit() {
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setDayjsLocale(navigator.language); // ex: "ko-KR"
    }
  }, []);

  return null; // 렌더링 없음
}
