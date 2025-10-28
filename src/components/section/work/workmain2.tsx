"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export default function WorkMain2() {
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
  const thirdMargin = useTransform(thirdSpring, [0, 1], ["400px", "300px"]);

  return (
    <div className="relative w-full flex flex-col mt-[calc(96vh+4px)] md:mt-[calc(96vh+4px)]">
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
            ></img>
          </div>
        </div>
        <div className="mx-4 block md:hidden">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl hover:rounded-[512px] transition-all duration-1000">
            <img src="/sulwhasoo2.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>

        <div className="mx-5 mt-2">
          <div className="text-sm font-light">
            <p>Sulwhasoo, Amorepacific</p>
            <p>Shopify 구축</p>
          </div>
        </div>
      </div>

      <motion.div className="hidden md:flex justify-between mt-20">
        <motion.div ref={secondRef} className="ml-4 h-[450px] w-2/6" style={{ marginTop: secondMargin }}>
          <div className="w-full h-full">
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
          </div>

          <div className="mx-1 mt-2">
            <div className="text-sm font-light">
              <p>Sixshop</p>
              <p>Template 제작</p>
            </div>
          </div>
        </motion.div>

        <motion.div ref={thirdRef} className="mr-4 h-[710px] w-3/6" style={{ marginTop: thirdMargin }}>
          <div className="w-full h-full">
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
