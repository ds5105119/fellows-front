"use client";

import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import React, { useEffect, useRef } from "react";

// --- Props와 셰이더, 헬퍼 함수는 이전과 동일합니다 ---
type Vec2 = [number, number];

export interface FaultyTerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: number;
  gridMul?: Vec2;
  digitSize?: number;
  timeScale?: number;
  pause?: boolean;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number | boolean;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
}

const vertexShader = `attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;
const fragmentShader = `precision mediump float;varying vec2 vUv;uniform float iTime;uniform vec3 iResolution;uniform float uScale;uniform vec2 uGridMul;uniform float uDigitSize;uniform float uScanlineIntensity;uniform float uGlitchAmount;uniform float uFlickerAmount;uniform float uNoiseAmp;uniform float uChromaticAberration;uniform float uDither;uniform float uCurvature;uniform vec3 uTint;uniform vec2 uMouse;uniform float uMouseStrength;uniform float uUseMouse;uniform float uPageLoadProgress;uniform float uUsePageLoadAnimation;uniform float uBrightness;float time;float hash21(vec2 p){p=fract(p*234.56);p+=dot(p,p+34.56);return fract(p.x*p.y);}float noise(vec2 p){return sin(p.x*10.)*sin(p.y*(3.+sin(time*.090909)))+.2;}mat2 rotate(float angle){float c=cos(angle);float s=sin(angle);return mat2(c,-s,s,c);}float fbm(vec2 p){p*=1.1;float f=0.;float amp=.5*uNoiseAmp;mat2 modify0=rotate(time*.02);f+=amp*noise(p);p=modify0*p*2.;amp*=.454545;mat2 modify1=rotate(time*.02);f+=amp*noise(p);p=modify1*p*2.;amp*=.454545;mat2 modify2=rotate(time*.08);f+=amp*noise(p);return f;}float pattern(vec2 p,out vec2 q,out vec2 r){vec2 offset1=vec2(1.);vec2 offset0=vec2(0.);mat2 rot01=rotate(.1*time);mat2 rot1=rotate(.1);q=vec2(fbm(p+offset1),fbm(rot01*p+offset1));r=vec2(fbm(rot1*q+offset0),fbm(q+offset0));return fbm(p+r);}float digit(vec2 p){vec2 grid=uGridMul*15.;vec2 s=floor(p*grid)/grid;p=p*grid;vec2 q,r;float intensity=pattern(s*.1,q,r)*1.3-.03;if(uUseMouse>.5){vec2 mouseWorld=uMouse*uScale;float distToMouse=distance(s,mouseWorld);float mouseInfluence=exp(-distToMouse*8.)*uMouseStrength*10.;intensity+=mouseInfluence;float ripple=sin(distToMouse*20.-iTime*5.)*.1*mouseInfluence;intensity+=ripple;}if(uUsePageLoadAnimation>.5){float cellRandom=fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453);float cellDelay=cellRandom*.8;float cellProgress=clamp((uPageLoadProgress-cellDelay)/.2,0.,1.);float fadeAlpha=smoothstep(0.,1.,cellProgress);intensity*=fadeAlpha;}p=fract(p);p*=uDigitSize;float px5=p.x*5.;float py5=(1.-p.y)*5.;float x=fract(px5);float y=fract(py5);float i=floor(py5)-2.;float j=floor(px5)-2.;float n=i*i+j*j;float f=n*.0625;float isOn=step(.1,intensity-f);float brightness=isOn*(.2+y*.8)*(.75+x*.25);return step(0.,p.x)*step(p.x,1.)*step(0.,p.y)*step(p.y,1.)*brightness;}float onOff(float a,float b,float c){return step(c,sin(iTime+a*cos(iTime*b)))*uFlickerAmount;}float displace(vec2 look){float y=look.y-mod(iTime*.25,1.);float window=1./(1.+50.*y*y);return sin(look.y*20.+iTime)*.0125*onOff(4.,2.,.8)*(1.+cos(iTime*60.))*window;}vec3 getColor(vec2 p){float bar=step(mod(p.y+time*20.,1.),.2)*.4+1.;bar*=uScanlineIntensity;float displacement=displace(p);p.x+=displacement;if(uGlitchAmount!=1.){float extra=displacement*(uGlitchAmount-1.);p.x+=extra;}float middle=digit(p);const float off=.002;float sum=digit(p+vec2(-off,-off))+digit(p+vec2(0.,-off))+digit(p+vec2(off,-off))+digit(p+vec2(-off,0.))+digit(p+vec2(0.,0.))+digit(p+vec2(off,0.))+digit(p+vec2(-off,off))+digit(p+vec2(0.,off))+digit(p+vec2(off,off));vec3 baseColor=vec3(.9)*middle+sum*.1*vec3(1.)*bar;return baseColor;}vec2 barrel(vec2 uv){vec2 c=uv*2.-1.;float r2=dot(c,c);c*=1.+uCurvature*r2;return c*.5+.5;}void main(){time=iTime*.333333;vec2 uv=vUv;if(uCurvature!=0.){uv=barrel(uv);}vec2 p=uv*uScale;vec3 col=getColor(p);if(uChromaticAberration!=0.){vec2 ca=vec2(uChromaticAberration)/iResolution.xy;col.r=getColor(p+ca).r;col.b=getColor(p-ca).b;}col*=uTint;col*=uBrightness;if(uDither>0.){float rnd=hash21(gl_FragCoord.xy);col+=(rnd-.5)*(uDither*.003922);}gl_FragColor=vec4(col,1.);}`;
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const num = parseInt(h, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export default function FaultyTerminal({
  scale = 1,
  gridMul = [2, 1],
  digitSize = 1.5,
  timeScale = 0.3,
  pause = false,
  scanlineIntensity = 0.3,
  glitchAmount = 1,
  flickerAmount = 1,
  noiseAmp = 1,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0.2,
  tint = "#ffffff",
  mouseReact = true,
  mouseStrength = 0.2,
  dpr,
  pageLoadAnimation = true,
  brightness = 1,
  className,
  style,
  ...rest
}: FaultyTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeOffsetRef = useRef(Math.random() * 100);

  // --- 1. 초기화 (한 번만 실행되는 useEffect) ---
  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    // dpr 값을 브라우저 환경에서 안전하게 결정
    const finalDpr = dpr ?? Math.min(window.devicePixelRatio, 2);

    const renderer = new Renderer({ dpr: finalDpr, alpha: true });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(gl.canvas.width, gl.canvas.height, 1) },
        // 초기값 설정
        uScale: { value: scale },
        uGridMul: { value: new Float32Array(gridMul) },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uChromaticAberration: { value: chromaticAberration },
        uDither: { value: typeof dither === "boolean" ? (dither ? 1 : 0) : dither },
        uCurvature: { value: curvature },
        uTint: { value: new Color(...hexToRgb(tint)) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: mouseStrength },
        uUseMouse: { value: mouseReact ? 1 : 0 },
        uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
        uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
        uBrightness: { value: brightness },
      },
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });

    // 리사이즈 로직
    const resize = () => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 1);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(ctn);
    resize();

    // 마우스 이벤트 핸들러
    const handleMouseMove = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    if (mouseReact) ctn.addEventListener("mousemove", handleMouseMove);

    // 렌더링 루프
    let rafId: number;
    let frozenTime = 0;
    let animStartTime = 0;
    const update = (t: number) => {
      rafId = requestAnimationFrame(update);

      if (pageLoadAnimation && animStartTime === 0) animStartTime = t;

      if (!pause) {
        const elapsed = (t * 0.001 + timeOffsetRef.current) * timeScale;
        program.uniforms.iTime.value = elapsed;
        frozenTime = elapsed;
      } else {
        program.uniforms.iTime.value = frozenTime;
      }

      if (pageLoadAnimation) {
        const progress = Math.min((t - animStartTime) / 2000, 1);
        program.uniforms.uPageLoadProgress.value = progress;
      }

      if (mouseReact) {
        const smooth = smoothMouseRef.current;
        smooth.x += (mouseRef.current.x - smooth.x) * 0.08;
        smooth.y += (mouseRef.current.y - smooth.y) * 0.08;
        (program.uniforms.uMouse.value as Float32Array).set([smooth.x, smooth.y]);
      }

      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    ctn.appendChild(gl.canvas);

    // 클린업 함수
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (mouseReact) ctn.removeEventListener("mousemove", handleMouseMove);
      if (gl.canvas.parentElement) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // 의존성 배열을 비워서 이 effect가 한 번만 실행되도록 보장
  }, []);

  // --- 2. 프롭 변경에 따른 유니폼 업데이트 (여러 개의 작은 useEffect) ---

  // 변경 가능한 대부분의 props를 여기서 처리합니다.
  useEffect(() => {
    const program = programRef.current;
    if (!program) return;

    program.uniforms.uScale.value = scale;
    (program.uniforms.uGridMul.value as Float32Array).set(gridMul);
    program.uniforms.uDigitSize.value = digitSize;
    program.uniforms.uScanlineIntensity.value = scanlineIntensity;
    program.uniforms.uGlitchAmount.value = glitchAmount;
    program.uniforms.uFlickerAmount.value = flickerAmount;
    program.uniforms.uNoiseAmp.value = noiseAmp;
    program.uniforms.uChromaticAberration.value = chromaticAberration;
    program.uniforms.uCurvature.value = curvature;
    program.uniforms.uMouseStrength.value = mouseStrength;
    program.uniforms.uBrightness.value = brightness;
  }, [scale, gridMul, digitSize, scanlineIntensity, glitchAmount, flickerAmount, noiseAmp, chromaticAberration, curvature, mouseStrength, brightness]);

  // boolean 이나 특별한 계산이 필요한 props는 개별적으로 처리합니다.
  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    program.uniforms.uTint.value.set(...hexToRgb(tint));
  }, [tint]);

  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    program.uniforms.uDither.value = typeof dither === "boolean" ? (dither ? 1 : 0) : dither;
  }, [dither]);

  return <div ref={containerRef} className={`w-full h-full relative overflow-hidden ${className}`} style={style} {...rest} />;
}
