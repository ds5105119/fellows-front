"use client";

import { useEffect, useRef } from "react";

export function useScrollLock(isLocked: boolean) {
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (isLocked) {
      // 현재 스크롤 위치 저장
      scrollPositionRef.current = window.scrollY;

      // body 스크롤 방지
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
    } else {
      // 스크롤 복원
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      // 저장된 위치로 스크롤
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      // cleanup
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isLocked]);
}
