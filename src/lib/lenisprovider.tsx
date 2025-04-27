// lib/LenisProvider.tsx
"use client";

import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { frame, cancelFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // Framer Motion의 단일 RAF 루프에 Lenis.raf() 훅킹
  useEffect(() => {
    if (!mounted) return;
    const unsubscribe = frame.update(({ timestamp }) => {
      lenisRef.current?.lenis?.raf(timestamp);
    }, /* immediate */ true);
    return () => {
      cancelFrame(unsubscribe);
    };
  }, [mounted]);

  // 경로 변경 시 스크롤 최상단으로 리셋
  useEffect(() => {
    if (!mounted) return;
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, [pathname, mounted]);

  // SSR 시엔 Lenis 감싸지 않고 바로 렌더
  if (!mounted) return <>{children}</>;

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        autoRaf: false, // autoRaf 끄고 위의 frame.update 로만 돌림
      }}
    >
      {children}
    </ReactLenis>
  );
}
