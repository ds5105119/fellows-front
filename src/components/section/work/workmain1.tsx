"use client";

import { useState, useEffect } from "react";
import DecryptedText from "@/components/resource/decryptedtext";
import FaultyTerminal from "@/components/resource/faultyterminal";
import { useLenis } from "lenis/react";

export default function WorkMain1() {
  const lenis = useLenis();
  const [visibility, setVisibility] = useState("visible");

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

  const handleTransitionEnd = () => {
    if (visibility === "hiding") {
      lenis?.start();
      setVisibility("hidden");
    }
  };

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`
        fixed inset-0 z-50 w-full h-full flex flex-col items-center justify-center
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
      <div className="absolute inset-0 brightness-75 md:block hidden">
        <FaultyTerminal
          scale={2}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.06}
          tint="#A8EF9E"
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={false}
          brightness={1}
        />
      </div>
      <div className="absolute inset-0 brightness-75 block md:hidden">
        <FaultyTerminal
          scale={2}
          gridMul={[1, 2]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.04}
          tint="#A8EF9E"
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={false}
          brightness={1}
        />
      </div>
    </div>
  );
}
