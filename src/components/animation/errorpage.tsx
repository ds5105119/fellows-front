"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function generateErrorCodes(count: number): string[] {
  const codes = [];
  for (let i = 1; i <= count; i++) {
    codes.push(i.toString().padStart(3, "0"));
  }
  return codes;
}

const colorClasses = [
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
  "text-red-400",
  "text-green-400",
  "text-blue-400",
  "text-yellow-400",
  "text-purple-400",
  "text-pink-400",
  "text-indigo-400",
  "text-cyan-400",
  "text-orange-400",
  "text-emerald-400",
];

interface ErrorCodeProps {
  code: string;
  index: number;
}

function ErrorCode({ code, index }: ErrorCodeProps) {
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState("");

  useEffect(() => {
    // Set random color
    const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    setColor(randomColor);

    // Set rotation based on screen size
    const updateRotation = () => {
      const isMobile = window.innerWidth < 768; // md breakpoint
      if (isMobile) {
        // Mobile: 0, 90, 180, 270 degrees
        const angles = [0, 90, 180, 270];
        setRotation(angles[Math.floor(Math.random() * angles.length)]);
      } else {
        // Desktop: 0-360 degrees
        setRotation(Math.floor(Math.random() * 360));
      }
    };

    updateRotation();
    window.addEventListener("resize", updateRotation);

    return () => window.removeEventListener("resize", updateRotation);
  }, []);

  return (
    <span
      className={`inline-block font-mono text-sm md:text-base ${color} transition-transform duration-300`}
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {code}
    </span>
  );
}

export default function ErrorPage() {
  const [displayCodes, setDisplayCodes] = useState<string[]>([]);

  useEffect(() => {
    const updateDisplayCodes = () => {
      const width = window.innerWidth;
      let codeCount = 42; // default for mobile

      if (width >= 1024) {
        // Large screens: ~12-14 rows × 21 columns = ~250-290 codes
        codeCount = 280;
      } else if (width >= 768) {
        // Medium screens: ~8-10 rows × 14 columns = ~110-140 codes
        codeCount = 126;
      } else {
        // Small screens: ~6 rows × 7 columns = 42 codes
        codeCount = 100;
      }

      setDisplayCodes(generateErrorCodes(codeCount));
    };

    updateDisplayCodes();
    window.addEventListener("resize", updateDisplayCodes);

    return () => window.removeEventListener("resize", updateDisplayCodes);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Main Content */}
      <main className="flex flex-col items-start justify-center px-4 md:px-6 lg:px-8 max-w-4xl pt-64 pb-24 md:pb-16">
        <div className="w-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-balance">Not Fellows!</h1>

          <div className="text-base md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-12 max-w-2xl text-pretty">
            For one reason or another, this page returned a <span className="bg-muted px-2 py-1 rounded font-mono">error</span>
          </div>
        </div>
      </main>

      {/* Error Codes Grid */}
      <div className="px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-7 md:grid-cols-14 lg:grid-cols-21 gap-2 md:gap-3 lg:gap-4 max-w-full overflow-hidden">
          {displayCodes.map((code, index) => (
            <div key={`${code}-${index}`} className="flex items-center justify-center h-8 md:h-10">
              <ErrorCode code={code} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
