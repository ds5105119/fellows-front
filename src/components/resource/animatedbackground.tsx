"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { Uniform, Vector2, WebGLRenderer, WebGLRenderTarget, Texture } from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { Effect } from "postprocessing";

// ========================================================================
// 1. 마우스 인터랙티브 픽셀레이션 효과 (Custom Effect)
// ========================================================================

const pixelationFragmentShader = `
    uniform float uPixelSize;
    uniform vec2 uMouse;
    uniform float uRadius;
    uniform vec2 uResolution;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 mouseUV = uMouse / uResolution;
        float aspectRatio = uResolution.x / uResolution.y;
        vec2 distVec = vec2((uv.x - mouseUV.x) * aspectRatio, uv.y - mouseUV.y);
        float dist = length(distVec);
        vec2 pixelatedUV = floor(uv * uResolution / uPixelSize) * uPixelSize / uResolution;
        float mixFactor = smoothstep(uRadius, uRadius + 0.1, dist);
        vec2 finalUV = mix(pixelatedUV, uv, mixFactor);
        outputColor = texture2D(inputBuffer, finalUV);
    }
`;

interface CustomPixelationEffectProps {
  pixelSize?: number;
  radius?: number;
  mouse?: Vector2;
  resolution?: Vector2;
}

class CustomPixelationEffect extends Effect {
  constructor({ pixelSize = 10.0, radius = 0.2, mouse = new Vector2(), resolution = new Vector2() }: CustomPixelationEffectProps = {}) {
    super("CustomPixelationEffect", pixelationFragmentShader, {
      uniforms: new Map<string, Uniform<any>>([
        ["uPixelSize", new Uniform(pixelSize)],
        ["uRadius", new Uniform(radius)],
        ["uMouse", new Uniform(mouse)],
        ["uResolution", new Uniform(resolution)],
      ]),
    });
  }

  // Effect 클래스와의 충돌을 피하기 위해 메서드 이름을 변경합니다.
  public updateUniforms(mouse: { x: number; y: number }, resolution: { width: number; height: number }) {
    (this.uniforms.get("uMouse") as Uniform<Vector2>).value.set(mouse.x, mouse.y);
    (this.uniforms.get("uResolution") as Uniform<Vector2>).value.set(resolution.width, resolution.height);
  }
}

// ========================================================================
// 2. 물결 배경 효과 (Shader Material)
// ========================================================================

const WaveMaterial = shaderMaterial(
  { u_time: 0, u_colorA: new THREE.Color("#000000"), u_colorB: new THREE.Color("#0047ab") },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `
    uniform float u_time;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    varying vec2 vUv;
    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
    float noise(in vec2 st) {
        vec2 i = floor(st); vec2 f = fract(st);
        float a = random(i); float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    float fbm(in vec2 st) {
        float value = 0.0; float amplitude = .5;
        for (int i = 0; i < 4; i++) {
            value += amplitude * noise(st); st *= 2.; amplitude *= .5;
        }
        return value;
    }
    void main() {
        vec2 st = vUv * 2.0;
        vec2 q = vec2(0.); q.x = fbm(st + u_time * 0.1); q.y = fbm(st + vec2(1.0));
        vec2 r = vec2(0.); r.x = fbm(st + q + u_time * 0.15); r.y = fbm(st + q + u_time * 0.126);
        float f = fbm(st + r);
        vec3 color = mix(u_colorA, u_colorB, clamp((f*f)*2.0, 0.0, 1.0));
        color = mix(color, u_colorA, clamp(length(q), 0.0, 1.0));
        color = mix(color, u_colorB, clamp(length(r.x), 0.0, 1.0));
        gl_FragColor = vec4((f*f*f + .6*f*f + .5*f) * color, 1.0);
    }
  `
);
extend({ WaveMaterial });

// ========================================================================
// 3. React 컴포넌트
// ========================================================================

interface InteractiveBackgroundProps {
  style?: React.CSSProperties;
  className?: string;
  speed?: number;
  pixelSize?: number;
  effectRadius?: number;
}

const Scene = ({ speed = 0.25 }) => {
  const materialRef = useRef<any>(null);
  useFrame((state) => {
    if (materialRef.current) materialRef.current.u_time = state.clock.getElapsedTime() * speed;
  });
  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      {/* @ts-ignore */}
      <waveMaterial ref={materialRef} key={(WaveMaterial as any).key} />
    </mesh>
  );
};

const Effects = ({ pixelSize, effectRadius }: { pixelSize: number; effectRadius: number }) => {
  const { size, pointer } = useThree();
  const effect = useMemo(() => new CustomPixelationEffect({ pixelSize, radius: effectRadius }), [pixelSize, effectRadius]);

  useFrame(() => {
    const screenPointer = {
      x: (pointer.x * size.width) / 2 + size.width / 2,
      y: (-pointer.y * size.height) / 2 + size.height / 2,
    };
    // 변경된 이름의 메서드를 호출합니다.
    effect.updateUniforms(screenPointer, size);
  });

  return (
    <EffectComposer>
      <primitive object={effect} />
    </EffectComposer>
  );
};

export default function AnimatedBackground({ style, className, speed = 0.25, pixelSize = 12.0, effectRadius = 0.15 }: InteractiveBackgroundProps) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: -1, ...style }} className={className}>
      <Canvas
        dpr={[0.5, 1]}
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: "low-power",
        }}
      >
        <Scene speed={speed} />
        <Effects pixelSize={pixelSize} effectRadius={effectRadius} />
      </Canvas>
    </div>
  );
}
