"use client";

import * as React from "react";

type Item = {
  value: number;
  label: string;
};

type WheelSelectProps = {
  items: Item[];
  value: number;
  onChange: (value: number) => void;
  itemHeight?: number;
  height?: number;
  "aria-label"?: string;
  /** Set true to scroll to current value on mount/open */
  active?: boolean;
};

/**
 * iOS-like wheel with smooth momentum and "pop-up" center item.
 * - CSS scroll-snap: proximity for smooth feels (no hard sticking).
 * - Inertial scroll is untouched; value is set after a short idle.
 * - Center item scales up, gets bolder/darker, and is rendered above the highlight.
 */
export default function WheelSelect({ items, value, onChange, itemHeight = 44, height = 220, "aria-label": ariaLabel, active = false }: WheelSelectProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollEndTimer = React.useRef<number | null>(null);
  const syncingRef = React.useRef(false);
  const tickingRef = React.useRef(false);

  // fractional center index for smooth visual interpolation
  const [scrollCenter, setScrollCenter] = React.useState(0);

  const indexOfValue = React.useMemo(() => {
    const idx = items.findIndex((i) => i.value === value);
    return idx >= 0 ? idx : 0;
  }, [items, value]);

  const padding = React.useMemo(() => Math.max(0, height / 2 - itemHeight / 2), [height, itemHeight]);

  const desiredScrollTopForIndex = React.useCallback((i: number) => i * itemHeight, [itemHeight]);

  const clampIndex = React.useCallback((i: number) => Math.max(0, Math.min(items.length - 1, i)), [items.length]);

  const computeNearestIndex = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return indexOfValue;
    const i = Math.round(el.scrollTop / itemHeight);
    return clampIndex(i);
  }, [clampIndex, indexOfValue, itemHeight]);

  // Sync to current value when opening
  React.useEffect(() => {
    if (!active) return;
    const el = containerRef.current;
    if (!el) return;
    syncingRef.current = true;
    const top = desiredScrollTopForIndex(indexOfValue);
    el.scrollTo({ top, behavior: "auto" });
    setScrollCenter(indexOfValue);
    window.setTimeout(() => {
      syncingRef.current = false;
    }, 60);
  }, [active, indexOfValue, desiredScrollTopForIndex]);

  const scheduleVisualUpdate = () => {
    const el = containerRef.current;
    if (!el) return;
    if (tickingRef.current) return;
    tickingRef.current = true;
    window.requestAnimationFrame(() => {
      const center = el.scrollTop / itemHeight;
      setScrollCenter(center);
      tickingRef.current = false;
    });
  };

  const onScroll = () => {
    if (syncingRef.current) return;
    scheduleVisualUpdate();
    if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
    // Wait for momentum and scroll-snap to settle
    scrollEndTimer.current = window.setTimeout(() => {
      const nearest = computeNearestIndex();
      const newVal = items[nearest]?.value;
      if (newVal != null && newVal !== value) {
        onChange(newVal);
      }
      // Ensure visuals are exactly centered after settle
      setScrollCenter(nearest);
    }, 160);
  };

  const handleClickItem = (i: number) => {
    const newVal = items[i]?.value;
    if (newVal == null) return;
    const el = containerRef.current;
    if (el) {
      syncingRef.current = true;
      el.scrollTo({ top: desiredScrollTopForIndex(i), behavior: "smooth" });
      // update visuals immediately so it "pops up"
      setScrollCenter(i);
      window.setTimeout(() => {
        syncingRef.current = false;
      }, 220);
    }
    if (newVal !== value) onChange(newVal);
  };

  // Visual interpolation for scale/opacity based on distance to center
  const getItemStyle = (i: number): React.CSSProperties => {
    const dist = Math.abs(i - scrollCenter); // 0 at center, 1 one row away
    const t = Math.max(0, 1 - Math.min(dist, 1));
    const scale = 1 + 0.18 * t; // up to 1.18 at center
    const opacity = 0.55 + 0.45 * t; // 1 at center, 0.55 far
    // Make color darker near center for crispness
    const color = dist < 0.25 ? "rgb(23 23 23)" : dist < 0.75 ? "rgb(82 82 82)" : "rgb(115 115 115)"; // neutral-900/600/500

    return {
      height: itemHeight,
      lineHeight: `${itemHeight}px`,
      transform: `scale(${scale})`,
      transformOrigin: "center",
      opacity,
      color,
      willChange: "transform",
      zIndex: dist < 0.6 ? 2 : 1, // bring center-ish items above highlight
      // avoid subpixel blur during transform on some devices
      backfaceVisibility: "hidden",
    };
  };

  // The center highlight: outline only so text isn't washed out
  const highlightStyle: React.CSSProperties = {
    top: height / 2 - itemHeight / 2,
    height: itemHeight,
    backdropFilter: "blur(2px)",
  };

  // Edge fade mask for nice depth effect
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
    maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
  };

  return (
    <div className="relative">
      {/* Center highlight behind text to avoid washing it out */}
      <div aria-hidden="true" className="pointer-events-none absolute left-2 right-2 z-10 rounded-xl ring-1 ring-black/10 bg-white/20" style={highlightStyle} />
      <div
        ref={containerRef}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        className="relative z-20 overflow-y-auto overscroll-contain"
        style={{
          height,
          paddingTop: padding,
          paddingBottom: padding,
          scrollSnapType: "y proximity",
          WebkitOverflowScrolling: "touch",
          ...maskStyle,
        }}
        onScroll={onScroll}
      >
        <ul className="relative">
          {items.map((item, i) => {
            const isSelectedValue = item.value === value;
            return (
              <li
                key={item.value}
                role="option"
                aria-selected={isSelectedValue}
                className="select-none cursor-default rounded-lg px-4 text-center transition-transform"
                style={{
                  ...getItemStyle(i),
                  // Ensure snap center without hard sticking
                  scrollSnapAlign: "center",
                }}
                onClick={() => handleClickItem(i)}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
