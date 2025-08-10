"use client";

import * as React from "react";
import { motion, useMotionValue, animate, useMotionValueEvent, type PanInfo } from "framer-motion";

export type InertiaItem = {
  value: number;
  label: string;
  disabled?: boolean;
};

type InertiaWheelProps = {
  items: InertiaItem[];
  value: number;
  onChange: (value: number) => void;
  itemHeight?: number;
  height?: number;
  "aria-label"?: string;
  active?: boolean;
  spring?: { stiffness?: number; damping?: number; mass?: number };
};

function useScrollShield<T extends HTMLElement = HTMLElement>(ref: React.RefObject<T | null>, enabled = true) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    el.addEventListener("wheel", preventWheel, { passive: false });
    el.addEventListener("touchmove", preventTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", preventWheel);
      el.removeEventListener("touchmove", preventTouchMove);
    };
  }, [ref, enabled]);
}

/**
 * InertiaWheel
 * - Drag/Wheel inertial scroll with spring snap to the nearest enabled item.
 * - Exact center alignment with highlight.
 * - 2-tier contrast around the selected item; disabled items dimmed and non-interactive.
 * - Blocks body/page scroll only while pointer is over the wheel (no global lock).
 */
export default function InertiaWheel({
  items,
  value,
  onChange,
  itemHeight = 44,
  height = 220,
  "aria-label": ariaLabel,
  active = false,
  spring = { stiffness: 420, damping: 38, mass: 0.9 },
}: InertiaWheelProps) {
  const len = items.length;
  const centerOffset = height / 2 - itemHeight / 2;

  // y = translateY of the list wrapper
  const y = useMotionValue(0);
  const [centerIndex, setCenterIndex] = React.useState(0);
  const snapTimer = React.useRef<number | null>(null);
  const syncingRef = React.useRef(false);

  const indexOfValue = React.useMemo(() => {
    const idx = items.findIndex((i) => i.value === value);
    return idx >= 0 ? idx : 0;
  }, [items, value]);

  const clamp = React.useCallback((n: number, min: number, max: number) => Math.max(min, Math.min(max, n)), []);

  // Mapping between translateY and centered index
  const toIndex = React.useCallback(
    (yy: number) => {
      const idx = Math.round((centerOffset - yy) / itemHeight);
      return clamp(idx, 0, Math.max(0, len - 1));
    },
    [centerOffset, itemHeight, len, clamp]
  );

  const toY = React.useCallback((idx: number) => centerOffset - idx * itemHeight, [centerOffset, itemHeight]);

  // Drag constraints (last/first item centered)
  const minY = React.useMemo(() => toY(len - 1), [toY, len]);
  const maxY = React.useMemo(() => toY(0), [toY]);

  const nearestEnabledIndex = React.useCallback(
    (idx: number) => {
      if (!items[idx]) return idx;
      if (!items[idx].disabled) return idx;
      for (let d = 1; d < len; d++) {
        const down = idx - d;
        const up = idx + d;
        if (down >= 0 && items[down] && !items[down].disabled) return down;
        if (up < len && items[up] && !items[up].disabled) return up;
      }
      return idx;
    },
    [items, len]
  );

  // Keep center index in sync with motion
  useMotionValueEvent(y, "change", (val) => {
    setCenterIndex(toIndex(val));
  });

  // Sync to current value when opened/activated
  React.useEffect(() => {
    if (!active) return;
    syncingRef.current = true;
    const target = clamp(toY(indexOfValue), minY, maxY);
    y.set(target);
    setCenterIndex(indexOfValue);
    const id = window.setTimeout(() => {
      syncingRef.current = false;
    }, 40);
    return () => window.clearTimeout(id);
  }, [active, indexOfValue, toY, clamp, minY, maxY, y]);

  // Shield body scroll for events occurring over the wheel container only
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  useScrollShield(containerRef, true);

  // Wheel scrolling inside the picker
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (syncingRef.current) return;
    // We already preventDefault at the native listener; keep logic here.
    const next = clamp(y.get() - e.deltaY, minY, maxY);
    y.set(next);

    if (snapTimer.current) window.clearTimeout(scrollEndTimer.current as any);
    // debounce snap after momentum-like wheel deltas
    scrollEndTimer.current = window.setTimeout(() => {
      const projectedIdx = toIndex(y.get());
      const idx = nearestEnabledIndex(projectedIdx);
      const target = clamp(toY(idx), minY, maxY);
      animate(y, target, { type: "spring", ...spring });
      const v = items[idx]?.value;
      if (v != null && v !== value) onChange(v);
    }, 120);
  };

  // Separate timer ref (fix small TS nuance above)
  const scrollEndTimer = React.useRef<number | null>(null);

  // Drag end with projected inertia and snap
  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const current = y.get();
    const projected = current + info.velocity.y * 0.2;
    const projectedIdx = toIndex(projected);
    const idx = nearestEnabledIndex(projectedIdx);
    const target = clamp(toY(idx), minY, maxY);
    animate(y, target, { type: "spring", ...spring });
    const v = items[idx]?.value;
    if (v != null && v !== value) onChange(v);
  };

  const handleClickItem = (i: number) => {
    const idx = nearestEnabledIndex(i);
    const target = clamp(toY(idx), minY, maxY);
    animate(y, target, { type: "spring", ...spring });
    const v = items[idx]?.value;
    if (v != null && v !== value) onChange(v);
  };

  // 2-step visual contrast + disabled
  function getItemStyle(i: number): React.CSSProperties {
    const dist = Math.abs(i - centerIndex);
    const disabled = !!items[i]?.disabled;
    const level = disabled ? 3 : dist < 0.5 ? 0 : dist < 1.5 ? 1 : 2;

    let scale = 1;
    let opacity = 1;
    let color = "rgb(23 23 23)";
    let fontWeight: React.CSSProperties["fontWeight"] = 700;
    let zIndex = 3;

    if (disabled) {
      scale = 1;
      opacity = 0.35;
      color = "rgb(163 163 163)";
      fontWeight = 500;
      zIndex = 1;
    } else if (level === 0) {
      scale = 1.16;
      opacity = 1;
      color = "rgb(23 23 23)";
      fontWeight = 700;
      zIndex = 3;
    } else if (level === 1) {
      scale = 1.06;
      opacity = 0.85;
      color = "rgb(64 64 64)";
      fontWeight = 600;
      zIndex = 2;
    } else {
      scale = 1.0;
      opacity = 0.6;
      color = "rgb(115 115 115)";
      fontWeight = 500;
      zIndex = 1;
    }

    return {
      height: itemHeight,
      lineHeight: `${itemHeight}px`,
      transform: `scale(${scale})`,
      transformOrigin: "center",
      opacity,
      color,
      fontWeight,
      willChange: "transform,opacity",
      backfaceVisibility: "hidden",
      pointerEvents: disabled ? "none" : "auto",
      zIndex,
    };
  }

  // Center highlight + edge fade
  const highlightStyle: React.CSSProperties = {
    top: centerOffset,
    height: itemHeight,
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(1.5px)",
  };
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
    maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
  };

  return (
    <div className="relative select-none">
      <div aria-hidden="true" className="pointer-events-none absolute left-2 right-2 z-10 rounded-xl" style={highlightStyle} />
      <div
        ref={containerRef}
        role="listbox"
        aria-label={ariaLabel}
        className="relative z-20 overflow-hidden rounded-xl"
        style={{
          height,
          ...maskStyle,
          // Prevent scroll chaining to page while keeping outside scroll working
          overscrollBehaviorY: "contain",
          overscrollBehaviorX: "none",
        }}
        onWheel={onWheel}
      >
        <motion.div
          style={{ y, touchAction: "none" }}
          drag="y"
          dragConstraints={{ top: minY, bottom: maxY }}
          dragElastic={0.12}
          dragMomentum
          onDragEnd={onDragEnd}
          className="cursor-grab active:cursor-grabbing"
        >
          <ul>
            {items.map((item, i) => (
              <li
                key={item.value}
                role="option"
                aria-selected={item.value === value}
                className="px-4 text-center transition-all duration-200 ease-out"
                style={getItemStyle(i)}
                onClick={() => handleClickItem(i)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
