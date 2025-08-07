"use client";

import { useState, useLayoutEffect, RefObject, useEffect, useRef } from "react";
import DecryptedText from "@/components/resource/decryptedtext";
import FaultyTerminal from "@/components/resource/faultyterminal";
import { useLenis } from "lenis/react";

interface Size {
  width: number;
  height: number;
}

function useContainerSize(ref: RefObject<HTMLElement | null>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}

export default function WorkMain1() {
  const lenis = useLenis();
  const [visibility, setVisibility] = useState("visible");

  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(terminalContainerRef);
  const aspectRatio = width > 0 && height > 0 ? width / height : 1;
  const gridMul: [number, number] = [aspectRatio, 1];
  const curvature = width > height ? 0.06 : 0.04;

  const handleTransitionEnd = () => {
    if (visibility === "hiding") {
      lenis?.start();
      setVisibility("hidden");
    }
  };

  useEffect(() => {
    lenis?.stop();

    const timer = setTimeout(() => {
      setVisibility("hiding");
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [lenis]);

  if (visibility === "hidden") {
    return null;
  }

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`
        fixed inset-0 top-0 z-[100] w-full h-full flex flex-col items-center justify-center
        transition-transform duration-1000 ease-in-out
        ${visibility === "hiding" ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      {/* ... 이하 나머지 JSX 코드는 동일합니다 ... */}
      <div className="relative z-10 hidden md:flex flex-col items-center space-y-0">
        <DecryptedText
          speed={60}
          maxIterations={20}
          sequential={true}
          animateOn="view"
          parentClassName="text-white font-medium text-3xl lg:text-4xl xl:text-5xl tracking-tighter"
          text="Fellows is Lead Web Designer with a background in branding,"
        />
        <DecryptedText
          speed={60}
          maxIterations={20}
          sequential={true}
          animateOn="view"
          parentClassName="text-white font-medium text-3xl lg:text-4xl xl:text-5xl tracking-tighter"
          text="UX, and web design. Now building AI-powered tools,"
        />
        <DecryptedText
          speed={60}
          maxIterations={20}
          sequential={true}
          animateOn="view"
          parentClassName="text-white font-medium text-3xl lg:text-4xl xl:text-5xl tracking-tighter"
          text="coding with AI, and leading AI-driven product innovation."
        />
      </div>
      <div className="relative z-10 flex md:hidden flex-col items-center space-y-0">
        <DecryptedText
          speed={60}
          maxIterations={20}
          sequential={true}
          animateOn="view"
          parentClassName="text-white font-semibold text-2xl tracking-tighter"
          text="Fellows is Lead Web Designer"
        />
        <DecryptedText
          speed={60}
          maxIterations={20}
          sequential={true}
          animateOn="view"
          parentClassName="text-white font-semibold text-2xl tracking-tighter"
          text="with a background in branding,"
        />
        <DecryptedText
          speed={60}
          maxIterations={20}
          sequential={true}
          animateOn="view"
          parentClassName="text-white font-semibold text-2xl tracking-tighter"
          text="UX, and web design."
        />
      </div>
      <div ref={terminalContainerRef} className="absolute inset-0 brightness-75">
        {width > 0 && (
          <FaultyTerminal
            key={aspectRatio > 1 ? "desktop" : "mobile"}
            gridMul={gridMul}
            curvature={curvature}
            scale={2}
            digitSize={1.2}
            timeScale={1}
            pause={false}
            scanlineIntensity={1}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            tint="#A8EF9E"
            mouseReact={true}
            mouseStrength={0.5}
            pageLoadAnimation={false}
            brightness={1}
          />
        )}
      </div>
    </div>
  );
}
