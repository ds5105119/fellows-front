"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { useTransform } from "framer-motion";
import ImageTrail from "@/components/resource/imagetrail";

export default function WorkMain4() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionBRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: sectionBProgress } = useScroll({
    target: sectionBRef,
    offset: ["start end", "start start"],
  });

  const circleCountDesktop = 13;
  const circleCountMobile = 7;

  const getAnimationOrder = (index: number, total: number) => {
    const middle = Math.floor(total / 2);
    if (index <= middle) {
      return index;
    } else {
      return total - 1 - index;
    }
  };

  const desktop0Order = getAnimationOrder(0, circleCountDesktop);
  const desktop0Start = (desktop0Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop0ScaleX = useTransform(sectionBProgress, [desktop0Start, desktop0Start + 0.05], [1, 1]);
  const desktop0ScaleY = useTransform(sectionBProgress, [desktop0Start, desktop0Start + 0.025, desktop0Start + 0.04], [0, 1.4, 1]);

  const desktop1Order = getAnimationOrder(1, circleCountDesktop);
  const desktop1Start = (desktop1Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop1ScaleX = useTransform(sectionBProgress, [desktop1Start, desktop1Start + 0.05], [1, 1]);
  const desktop1ScaleY = useTransform(sectionBProgress, [desktop1Start, desktop1Start + 0.025, desktop1Start + 0.04], [0, 1.4, 1]);

  const desktop2Order = getAnimationOrder(2, circleCountDesktop);
  const desktop2Start = (desktop2Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop2ScaleX = useTransform(sectionBProgress, [desktop2Start, desktop2Start + 0.05], [1, 1]);
  const desktop2ScaleY = useTransform(sectionBProgress, [desktop2Start, desktop2Start + 0.025, desktop2Start + 0.04], [0, 1.4, 1]);

  const desktop3Order = getAnimationOrder(3, circleCountDesktop);
  const desktop3Start = (desktop3Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop3ScaleX = useTransform(sectionBProgress, [desktop3Start, desktop3Start + 0.05], [1, 1]);
  const desktop3ScaleY = useTransform(sectionBProgress, [desktop3Start, desktop3Start + 0.025, desktop3Start + 0.04], [0, 1.4, 1]);

  const desktop4Order = getAnimationOrder(4, circleCountDesktop);
  const desktop4Start = (desktop4Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop4ScaleX = useTransform(sectionBProgress, [desktop4Start, desktop4Start + 0.05], [1, 1]);
  const desktop4ScaleY = useTransform(sectionBProgress, [desktop4Start, desktop4Start + 0.025, desktop4Start + 0.04], [0, 1.4, 1]);

  const desktop5Order = getAnimationOrder(5, circleCountDesktop);
  const desktop5Start = (desktop5Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop5ScaleX = useTransform(sectionBProgress, [desktop5Start, desktop5Start + 0.05], [1, 1]);
  const desktop5ScaleY = useTransform(sectionBProgress, [desktop5Start, desktop5Start + 0.025, desktop5Start + 0.04], [0, 1.4, 1]);

  const desktop6Order = getAnimationOrder(6, circleCountDesktop);
  const desktop6Start = (desktop6Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop6ScaleX = useTransform(sectionBProgress, [desktop6Start, desktop6Start + 0.05], [1, 1]);
  const desktop6ScaleY = useTransform(sectionBProgress, [desktop6Start, desktop6Start + 0.025, desktop6Start + 0.04], [0, 1.4, 1]);

  const desktop7Order = getAnimationOrder(7, circleCountDesktop);
  const desktop7Start = (desktop7Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop7ScaleX = useTransform(sectionBProgress, [desktop7Start, desktop7Start + 0.05], [1, 1]);
  const desktop7ScaleY = useTransform(sectionBProgress, [desktop7Start, desktop7Start + 0.025, desktop7Start + 0.04], [0, 1.4, 1]);

  const desktop8Order = getAnimationOrder(8, circleCountDesktop);
  const desktop8Start = (desktop8Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop8ScaleX = useTransform(sectionBProgress, [desktop8Start, desktop8Start + 0.05], [1, 1]);
  const desktop8ScaleY = useTransform(sectionBProgress, [desktop8Start, desktop8Start + 0.025, desktop8Start + 0.04], [0, 1.4, 1]);

  const desktop9Order = getAnimationOrder(9, circleCountDesktop);
  const desktop9Start = (desktop9Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop9ScaleX = useTransform(sectionBProgress, [desktop9Start, desktop9Start + 0.05], [1, 1]);
  const desktop9ScaleY = useTransform(sectionBProgress, [desktop9Start, desktop9Start + 0.025, desktop9Start + 0.04], [0, 1.4, 1]);

  const desktop10Order = getAnimationOrder(10, circleCountDesktop);
  const desktop10Start = (desktop10Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop10ScaleX = useTransform(sectionBProgress, [desktop10Start, desktop10Start + 0.05], [1, 1]);
  const desktop10ScaleY = useTransform(sectionBProgress, [desktop10Start, desktop10Start + 0.025, desktop10Start + 0.04], [0, 1.4, 1]);

  const desktop11Order = getAnimationOrder(11, circleCountDesktop);
  const desktop11Start = (desktop11Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop11ScaleX = useTransform(sectionBProgress, [desktop11Start, desktop11Start + 0.05], [1, 1]);
  const desktop11ScaleY = useTransform(sectionBProgress, [desktop11Start, desktop11Start + 0.025, desktop11Start + 0.04], [0, 1.4, 1]);

  const desktop12Order = getAnimationOrder(12, circleCountDesktop);
  const desktop12Start = (desktop12Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop12ScaleX = useTransform(sectionBProgress, [desktop12Start, desktop12Start + 0.05], [1, 1]);
  const desktop12ScaleY = useTransform(sectionBProgress, [desktop12Start, desktop12Start + 0.025, desktop12Start + 0.04], [0, 1.4, 1]);

  const mobile0Order = getAnimationOrder(0, circleCountMobile);
  const mobile0Start = (mobile0Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile0ScaleX = useTransform(sectionBProgress, [mobile0Start, mobile0Start + 0.05], [1, 1]);
  const mobile0ScaleY = useTransform(sectionBProgress, [mobile0Start, mobile0Start + 0.025, mobile0Start + 0.04], [0, 1.4, 1]);

  const mobile1Order = getAnimationOrder(1, circleCountMobile);
  const mobile1Start = (mobile1Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile1ScaleX = useTransform(sectionBProgress, [mobile1Start, mobile1Start + 0.05], [1, 1]);
  const mobile1ScaleY = useTransform(sectionBProgress, [mobile1Start, mobile1Start + 0.025, mobile1Start + 0.04], [0, 1.4, 1]);

  const mobile2Order = getAnimationOrder(2, circleCountMobile);
  const mobile2Start = (mobile2Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile2ScaleX = useTransform(sectionBProgress, [mobile2Start, mobile2Start + 0.05], [1, 1]);
  const mobile2ScaleY = useTransform(sectionBProgress, [mobile2Start, mobile2Start + 0.025, mobile2Start + 0.04], [0, 1.4, 1]);

  const mobile3Order = getAnimationOrder(3, circleCountMobile);
  const mobile3Start = (mobile3Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile3ScaleX = useTransform(sectionBProgress, [mobile3Start, mobile3Start + 0.05], [1, 1]);
  const mobile3ScaleY = useTransform(sectionBProgress, [mobile3Start, mobile3Start + 0.025, mobile3Start + 0.04], [0, 1.4, 1]);

  const mobile4Order = getAnimationOrder(4, circleCountMobile);
  const mobile4Start = (mobile4Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile4ScaleX = useTransform(sectionBProgress, [mobile4Start, mobile4Start + 0.05], [1, 1]);
  const mobile4ScaleY = useTransform(sectionBProgress, [mobile4Start, mobile4Start + 0.025, mobile4Start + 0.04], [0, 1.4, 1]);

  const mobile5Order = getAnimationOrder(5, circleCountMobile);
  const mobile5Start = (mobile5Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile5ScaleX = useTransform(sectionBProgress, [mobile5Start, mobile5Start + 0.05], [1, 1]);
  const mobile5ScaleY = useTransform(sectionBProgress, [mobile5Start, mobile5Start + 0.025, mobile5Start + 0.04], [0, 1.4, 1]);

  const mobile6Order = getAnimationOrder(6, circleCountMobile);
  const mobile6Start = (mobile6Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile6ScaleX = useTransform(sectionBProgress, [mobile6Start, mobile6Start + 0.05], [1, 1]);
  const mobile6ScaleY = useTransform(sectionBProgress, [mobile6Start, mobile6Start + 0.025, mobile6Start + 0.04], [0, 1.4, 1]);

  const desktopAnimations = [
    { scaleX: desktop0ScaleX, scaleY: desktop0ScaleY },
    { scaleX: desktop1ScaleX, scaleY: desktop1ScaleY },
    { scaleX: desktop2ScaleX, scaleY: desktop2ScaleY },
    { scaleX: desktop3ScaleX, scaleY: desktop3ScaleY },
    { scaleX: desktop4ScaleX, scaleY: desktop4ScaleY },
    { scaleX: desktop5ScaleX, scaleY: desktop5ScaleY },
    { scaleX: desktop6ScaleX, scaleY: desktop6ScaleY },
    { scaleX: desktop7ScaleX, scaleY: desktop7ScaleY },
    { scaleX: desktop8ScaleX, scaleY: desktop8ScaleY },
    { scaleX: desktop9ScaleX, scaleY: desktop9ScaleY },
    { scaleX: desktop10ScaleX, scaleY: desktop10ScaleY },
    { scaleX: desktop11ScaleX, scaleY: desktop11ScaleY },
    { scaleX: desktop12ScaleX, scaleY: desktop12ScaleY },
  ];

  const mobileAnimations = [
    { scaleX: mobile0ScaleX, scaleY: mobile0ScaleY },
    { scaleX: mobile1ScaleX, scaleY: mobile1ScaleY },
    { scaleX: mobile2ScaleX, scaleY: mobile2ScaleY },
    { scaleX: mobile3ScaleX, scaleY: mobile3ScaleY },
    { scaleX: mobile4ScaleX, scaleY: mobile4ScaleY },
    { scaleX: mobile5ScaleX, scaleY: mobile5ScaleY },
    { scaleX: mobile6ScaleX, scaleY: mobile6ScaleY },
  ];

  return (
    <div className="flex flex-col" ref={containerRef}>
      <section className="w-full h-48 bg-[#FFFFFF] relative"></section>

      <section className="w-full h-dvh bg-zinc-900 relative z-20" ref={sectionBRef}>
        <div className="absolute top-0 left-0 w-full -z-10 -translate-y-1/2">
          <div className="hidden md:flex flex-row w-full">
            {desktopAnimations.map((animation, i) => (
              <motion.div
                key={`circle-${i}`}
                className="bg-zinc-900"
                style={{
                  opacity: 1,
                  scaleX: animation.scaleX,
                  scaleY: animation.scaleY,
                  width: `calc(100vw / ${circleCountDesktop})`,
                  height: `calc(100vw / ${circleCountDesktop})`,
                  minWidth: "40px",
                  minHeight: "40px",
                  borderRadius: "50%",
                }}
                transition={{
                  type: "spring",
                }}
              />
            ))}
          </div>
          <div className="md:hidden flex flex-row w-full">
            {mobileAnimations.map((animation, i) => (
              <motion.div
                key={`circle-mobile-${i}`}
                className="bg-zinc-900"
                style={{
                  opacity: 1,
                  scaleX: animation.scaleX,
                  scaleY: animation.scaleY,
                  width: `calc(100vw / ${circleCountMobile})`,
                  height: `calc(100vw / ${circleCountMobile})`,
                  minWidth: "50px",
                  minHeight: "50px",
                  borderRadius: "50%",
                }}
                transition={{
                  type: "spring",
                }}
              />
            ))}
          </div>
        </div>

        <ImageTrail
          key="imagetrail"
          items={[
            "https://picsum.photos/id/287/300/300",
            "https://picsum.photos/id/1001/300/300",
            "https://picsum.photos/id/1025/300/300",
            "https://picsum.photos/id/1026/300/300",
            "https://picsum.photos/id/1027/300/300",
            "https://picsum.photos/id/1028/300/300",
            "https://picsum.photos/id/1029/300/300",
            "https://picsum.photos/id/1030/300/300",
          ]}
          variant={1}
        />
      </section>
    </div>
  );
}
