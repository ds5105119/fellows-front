"use client";

import type React from "react";

import { useEffect } from "react";

export interface GradientBackgroundProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export function GradientBackground({ style, className = "", children, ...props }: GradientBackgroundProps) {
  useEffect(() => {
    document.body.classList.add("opacity-100");
  }, []);

  return (
    <div
      {...props}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -10,
        width: "100%",
        height: "100%",
        background: `
          radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 20%, transparent 40%),
          radial-gradient(ellipse at 85% 85%, rgb(255, 159, 122) 0%, rgb(240, 196, 166) 30%, rgb(220, 200, 190) 50%, transparent 70%),
          rgb(200, 195, 210)
        `,
        ...style,
      }}
      className={`${className}`}
    >
      {children}
    </div>
  );
}
