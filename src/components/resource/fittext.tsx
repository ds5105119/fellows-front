"use client";

import {
  useState,
  useLayoutEffect,
  useRef,
  RefObject,
  CSSProperties,
  Ref, // Ref 타입을 import 합니다.
} from "react";

// rem 단위를 px로 변환하는 헬퍼 함수
const remToPx = (rem: number): number => {
  if (typeof window === "undefined") {
    return rem * 16; // SSR 환경의 기본값 (1rem = 16px)
  }
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/**
 * useFitText 훅의 옵션 인터페이스
 */
interface UseFitTextOptions {
  containerRef?: RefObject<HTMLElement>;
  paddingRem?: number;
  scaleFactor?: number;
}

/**
 * useFitText 훅이 반환하는 값의 타입 인터페이스
 */
interface FitTextResult<T extends HTMLElement> {
  // 1. ref의 타입을 React.Ref<T>로 변경하여 호환성 문제를 해결합니다.
  ref: Ref<T>;
  style: CSSProperties;
}

/**
 * 텍스트를 부모 컨테이너 너비에 맞게 자동으로 조절하는 React 훅입니다.
 */
export const useFitText = <T extends HTMLElement>(options: UseFitTextOptions = {}): FitTextResult<T> => {
  const { containerRef, paddingRem = 0, scaleFactor = 1 } = options;
  const [fontSize, setFontSize] = useState<string | number>(0);
  const elementRef = useRef<T>(null);

  useLayoutEffect(() => {
    // el을 effect 밖에서 선언하여 클린업 함수에서도 접근 가능하게 합니다.
    const el = elementRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      const containerWidth = containerRef?.current ? containerRef.current.offsetWidth : window.innerWidth;
      const paddingPx = remToPx(paddingRem);
      const targetWidth = containerWidth - paddingPx;

      el.style.fontSize = "1px";
      el.style.whiteSpace = "nowrap";

      const widthAt1px = el.scrollWidth;

      if (widthAt1px === 0) return;

      const baseFontSize = targetWidth / widthAt1px;
      const newFontSize = baseFontSize * scaleFactor;

      setFontSize(`${newFontSize}px`);
    });

    // 관찰할 대상을 배열로 관리
    const elementsToObserve = [el, containerRef?.current].filter((e): e is HTMLElement => e != null);
    elementsToObserve.forEach((e) => resizeObserver.observe(e));

    // 초기 렌더링 시에도 리사이즈 로직을 한 번 실행
    // ResizeObserver가 비동기적으로 동작하므로, 초기값을 빠르게 설정합니다.
    const initialContainerWidth = containerRef?.current ? containerRef.current.offsetWidth : window.innerWidth;
    const paddingPx = remToPx(paddingRem);
    const targetWidth = initialContainerWidth - paddingPx;
    const widthAt1px = el.scrollWidth || targetWidth; // 0으로 나눠지는 것 방지
    const baseFontSize = targetWidth / widthAt1px;
    setFontSize(`${baseFontSize * scaleFactor}px`);

    return () => resizeObserver.disconnect();
  }, [containerRef, paddingRem, scaleFactor]);

  // 2. 반환 객체는 이제 FitTextResult<T> 타입과 완벽하게 호환됩니다.
  return {
    ref: elementRef,
    style: { fontSize },
  };
};
