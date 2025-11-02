"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useCursor } from "@/components/ui/cursor-controller";

export default function WorkMain2() {
  const { setCursor, resetCursor } = useCursor();

  const secondRef = useRef(null);
  const thirdRef = useRef(null);

  const { scrollYProgress: secondScrollYProgress } = useScroll({
    target: secondRef,
    offset: ["start end", "end end"],
  });
  const { scrollYProgress: thridScrollYProgress } = useScroll({
    target: thirdRef,
    offset: ["start end", "end end"],
  });

  const secondSpring = useSpring(secondScrollYProgress);
  const thirdSpring = useSpring(thridScrollYProgress);

  const secondMargin = useTransform(secondSpring, [0, 1], ["100px", "0px"]);
  const thirdMargin = useTransform(thirdSpring, [0, 1], ["100px", "0px"]);

  return (
    <div className="relative w-full flex flex-col mt-[calc(96svh+4px)] md:mt-[calc(96vh+4px)]">
      <div>
        <div className="mx-4 hidden md:block">
          <div
            className="relative w-full aspect-[23/9] overflow-hidden rounded-xl group
          transition-[border-radius] will-change-[border-radius]
          duration-1000 ease-in-out
          hover:duration-1000 hover:ease-in-out
          hover:rounded-[512px]"
          >
            <img
              src="/sulwhasoo2.png"
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
              onMouseEnter={() =>
                setCursor(
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="px-2 py-1 rounded bg-black/80 text-white text-xs"
                  >
                    Click me!
                  </motion.div>
                )
              }
              onMouseLeave={resetCursor}
            ></img>
          </div>
        </div>
        <div className="mx-4 block md:hidden">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl hover:rounded-[512px] transition-all duration-1000">
            <img src="/sulwhasoo2.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>

        <div className="mx-4 px-1 mt-2">
          <div className="text-sm font-light">
            <p>Sulwhasoo, Amorepacific</p>
            <p>Shopify 구축</p>
          </div>
        </div>
      </div>

      <motion.div className="flex flex-col md:flex-row mt-6 space-y-6 md:spance-y-0 md:justify-between md:mt-20">
        <motion.div ref={secondRef} className="md:ml-4 md:h-[450px] md:w-2/6 px-4 md:px-0" style={{ marginTop: secondMargin }}>
          <motion.div className="w-full h-full hidden md:block">
            <div
              className="relative w-full h-full overflow-hidden rounded-xl group
              transition-[border-radius] will-change-[border-radius]
              duration-1000 ease-in-out
              hover:duration-1000 hover:ease-in-out
              hover:rounded-[512px]"
            >
              <img
                src="/sixshop1.png"
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
              ></img>
            </div>
          </motion.div>

          <div className="block md:hidden relative w-full aspect-[4/3] overflow-hidden rounded-xl hover:rounded-[512px] transition-all duration-1000">
            <img src="/sixshop1.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>

          <motion.div className="mx-1 mt-2">
            <div className="text-sm font-light">
              <p>Sixshop</p>
              <p>Template 제작</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div ref={thirdRef} className="md:mr-4 md:h-[710px] md:w-3/6 px-4 md:px-0 md:mt-[300px]" style={{ paddingTop: thirdMargin }}>
          <div className="w-full h-full hidden md:block">
            <div
              className="relative w-full h-full overflow-hidden rounded-xl group
              transition-[border-radius] will-change-[border-radius]
              duration-1000 ease-in-out
              hover:duration-1000 hover:ease-in-out
              hover:rounded-[512px]"
            >
              <img
                src="/Laneige1.png"
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
              ></img>
            </div>
          </div>

          <div className="block md:hidden relative w-full aspect-[4/3] overflow-hidden rounded-xl hover:rounded-[512px] transition-all duration-1000">
            <img src="/Laneige1.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>

          <div className="mx-1 mt-2">
            <div className="text-sm font-light">
              <p>LANEIGE, Amorepacific</p>
              <p>Shopify 구축</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
