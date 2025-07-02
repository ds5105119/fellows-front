"use client";

import { MeshGradient, MeshGradientProps } from "@paper-design/shaders-react";
import { useEffect } from "react";

export function MeshGradientComponent({ style, className, ...props }: MeshGradientProps) {
  useEffect(() => {
    document.body.classList.add("opacity-100");
  }, []);

  return (
    <MeshGradient
      {...props}
      speed={0.25}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -10,
        width: "100%",
        height: "100%",
        ...style,
      }}
      className={className}
    />
  );
}
