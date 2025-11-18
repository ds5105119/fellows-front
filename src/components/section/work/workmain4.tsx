"use client";

import { motion, useScroll, useSpring, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import ImageTrail from "@/components/resource/imagetrail";
import Typewriter from "@/components/fancy/text/typewriter";

export default function WorkMain4() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionBRef = useRef<HTMLDivElement>(null);

  const textItems = ["CREATING", "DESIGN", "THAT", "EXCITES", "AND", "MOVE", "PEOPLE."];

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
  const desktop0ScaleX = useSpring(useTransform(sectionBProgress, [desktop0Start, desktop0Start + 0.05], [1, 1]));
  const desktop0ScaleY = useSpring(useTransform(sectionBProgress, [desktop0Start, desktop0Start + 0.025, desktop0Start + 0.04], [0, 1.4, 1]));

  const desktop1Order = getAnimationOrder(1, circleCountDesktop);
  const desktop1Start = (desktop1Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop1ScaleX = useSpring(useTransform(sectionBProgress, [desktop1Start, desktop1Start + 0.05], [1, 1]));
  const desktop1ScaleY = useSpring(useTransform(sectionBProgress, [desktop1Start, desktop1Start + 0.025, desktop1Start + 0.04], [0, 1.4, 1]));

  const desktop2Order = getAnimationOrder(2, circleCountDesktop);
  const desktop2Start = (desktop2Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop2ScaleX = useSpring(useTransform(sectionBProgress, [desktop2Start, desktop2Start + 0.05], [1, 1]));
  const desktop2ScaleY = useSpring(useTransform(sectionBProgress, [desktop2Start, desktop2Start + 0.025, desktop2Start + 0.04], [0, 1.4, 1]));

  const desktop3Order = getAnimationOrder(3, circleCountDesktop);
  const desktop3Start = (desktop3Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop3ScaleX = useSpring(useTransform(sectionBProgress, [desktop3Start, desktop3Start + 0.05], [1, 1]));
  const desktop3ScaleY = useSpring(useTransform(sectionBProgress, [desktop3Start, desktop3Start + 0.025, desktop3Start + 0.04], [0, 1.4, 1]));

  const desktop4Order = getAnimationOrder(4, circleCountDesktop);
  const desktop4Start = (desktop4Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop4ScaleX = useSpring(useTransform(sectionBProgress, [desktop4Start, desktop4Start + 0.05], [1, 1]));
  const desktop4ScaleY = useSpring(useTransform(sectionBProgress, [desktop4Start, desktop4Start + 0.025, desktop4Start + 0.04], [0, 1.4, 1]));

  const desktop5Order = getAnimationOrder(5, circleCountDesktop);
  const desktop5Start = (desktop5Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop5ScaleX = useSpring(useTransform(sectionBProgress, [desktop5Start, desktop5Start + 0.05], [1, 1]));
  const desktop5ScaleY = useSpring(useTransform(sectionBProgress, [desktop5Start, desktop5Start + 0.025, desktop5Start + 0.04], [0, 1.4, 1]));

  const desktop6Order = getAnimationOrder(6, circleCountDesktop);
  const desktop6Start = (desktop6Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop6ScaleX = useSpring(useTransform(sectionBProgress, [desktop6Start, desktop6Start + 0.05], [1, 1]));
  const desktop6ScaleY = useSpring(useTransform(sectionBProgress, [desktop6Start, desktop6Start + 0.025, desktop6Start + 0.04], [0, 1.4, 1]));

  const desktop7Order = getAnimationOrder(7, circleCountDesktop);
  const desktop7Start = (desktop7Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop7ScaleX = useSpring(useTransform(sectionBProgress, [desktop7Start, desktop7Start + 0.05], [1, 1]));
  const desktop7ScaleY = useSpring(useTransform(sectionBProgress, [desktop7Start, desktop7Start + 0.025, desktop7Start + 0.04], [0, 1.4, 1]));

  const desktop8Order = getAnimationOrder(8, circleCountDesktop);
  const desktop8Start = (desktop8Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop8ScaleX = useSpring(useTransform(sectionBProgress, [desktop8Start, desktop8Start + 0.05], [1, 1]));
  const desktop8ScaleY = useSpring(useTransform(sectionBProgress, [desktop8Start, desktop8Start + 0.025, desktop8Start + 0.04], [0, 1.4, 1]));

  const desktop9Order = getAnimationOrder(9, circleCountDesktop);
  const desktop9Start = (desktop9Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop9ScaleX = useSpring(useTransform(sectionBProgress, [desktop9Start, desktop9Start + 0.05], [1, 1]));
  const desktop9ScaleY = useSpring(useTransform(sectionBProgress, [desktop9Start, desktop9Start + 0.025, desktop9Start + 0.04], [0, 1.4, 1]));

  const desktop10Order = getAnimationOrder(10, circleCountDesktop);
  const desktop10Start = (desktop10Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop10ScaleX = useSpring(useTransform(sectionBProgress, [desktop10Start, desktop10Start + 0.05], [1, 1]));
  const desktop10ScaleY = useSpring(useTransform(sectionBProgress, [desktop10Start, desktop10Start + 0.025, desktop10Start + 0.04], [0, 1.4, 1]));

  const desktop11Order = getAnimationOrder(11, circleCountDesktop);
  const desktop11Start = (desktop11Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop11ScaleX = useSpring(useTransform(sectionBProgress, [desktop11Start, desktop11Start + 0.05], [1, 1]));
  const desktop11ScaleY = useSpring(useTransform(sectionBProgress, [desktop11Start, desktop11Start + 0.025, desktop11Start + 0.04], [0, 1.4, 1]));

  const desktop12Order = getAnimationOrder(12, circleCountDesktop);
  const desktop12Start = (desktop12Order / Math.ceil(circleCountDesktop / 2)) * 0.7;
  const desktop12ScaleX = useSpring(useTransform(sectionBProgress, [desktop12Start, desktop12Start + 0.05], [1, 1]));
  const desktop12ScaleY = useSpring(useTransform(sectionBProgress, [desktop12Start, desktop12Start + 0.025, desktop12Start + 0.04], [0, 1.4, 1]));

  const mobile0Order = getAnimationOrder(0, circleCountMobile);
  const mobile0Start = (mobile0Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile0ScaleX = useSpring(useTransform(sectionBProgress, [mobile0Start, mobile0Start + 0.05], [1, 1]));
  const mobile0ScaleY = useSpring(useTransform(sectionBProgress, [mobile0Start, mobile0Start + 0.025, mobile0Start + 0.04], [0, 1.4, 1]));

  const mobile1Order = getAnimationOrder(1, circleCountMobile);
  const mobile1Start = (mobile1Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile1ScaleX = useSpring(useTransform(sectionBProgress, [mobile1Start, mobile1Start + 0.05], [1, 1]));
  const mobile1ScaleY = useSpring(useTransform(sectionBProgress, [mobile1Start, mobile1Start + 0.025, mobile1Start + 0.04], [0, 1.4, 1]));

  const mobile2Order = getAnimationOrder(2, circleCountMobile);
  const mobile2Start = (mobile2Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile2ScaleX = useSpring(useTransform(sectionBProgress, [mobile2Start, mobile2Start + 0.05], [1, 1]));
  const mobile2ScaleY = useSpring(useTransform(sectionBProgress, [mobile2Start, mobile2Start + 0.025, mobile2Start + 0.04], [0, 1.4, 1]));

  const mobile3Order = getAnimationOrder(3, circleCountMobile);
  const mobile3Start = (mobile3Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile3ScaleX = useSpring(useTransform(sectionBProgress, [mobile3Start, mobile3Start + 0.05], [1, 1]));
  const mobile3ScaleY = useSpring(useTransform(sectionBProgress, [mobile3Start, mobile3Start + 0.025, mobile3Start + 0.04], [0, 1.4, 1]));

  const mobile4Order = getAnimationOrder(4, circleCountMobile);
  const mobile4Start = (mobile4Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile4ScaleX = useSpring(useTransform(sectionBProgress, [mobile4Start, mobile4Start + 0.05], [1, 1]));
  const mobile4ScaleY = useSpring(useTransform(sectionBProgress, [mobile4Start, mobile4Start + 0.025, mobile4Start + 0.04], [0, 1.4, 1]));

  const mobile5Order = getAnimationOrder(5, circleCountMobile);
  const mobile5Start = (mobile5Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile5ScaleX = useSpring(useTransform(sectionBProgress, [mobile5Start, mobile5Start + 0.05], [1, 1]));
  const mobile5ScaleY = useSpring(useTransform(sectionBProgress, [mobile5Start, mobile5Start + 0.025, mobile5Start + 0.04], [0, 1.4, 1]));

  const mobile6Order = getAnimationOrder(6, circleCountMobile);
  const mobile6Start = (mobile6Order / Math.ceil(circleCountMobile / 2)) * 0.7;
  const mobile6ScaleX = useSpring(useTransform(sectionBProgress, [mobile6Start, mobile6Start + 0.05], [1, 1]));
  const mobile6ScaleY = useSpring(useTransform(sectionBProgress, [mobile6Start, mobile6Start + 0.025, mobile6Start + 0.04], [0, 1.4, 1]));

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

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
      <section className="w-full h-48 bg-[#FFFFFF] relative -z-10"></section>

      <section className="w-full bg-zinc-900 relative z-20 pb-25" ref={sectionBRef}>
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

        <div className="px-4">
          <div>
            <div
              className="text-sm md:text-base text-white pt-16"
              style={{ fontFamily: "var(--font-leaguegothic), var(--font-geist-sans), Helvetica, Arial, sans-serif" }}
            >
              ABOUT
            </div>
            <motion.div
              className="text-9xl md:text-[180px] text-white md:flex md:flex-wrap md:gap-x-4 pb-2 md:pb-16 leading-[0.9em]"
              style={{ fontFamily: "var(--font-leaguegothic), var(--font-geist-sans), Helvetica, Arial, sans-serif" }}
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {textItems.map((word, i) => (
                <motion.span key={i} className="block md:inline" variants={item}>
                  {word}
                </motion.span>
              ))}
            </motion.div>

            <div className="flex flex-col md:items-end px-1 md:px-0">
              <div className="text-white md:w-160 md:text-2xl md:font-normal">
                위대한 브랜드는 존재만으로 시선을 끕니다. Fellows는 대담하고, 오래 남고, 전환을 만들어내는 웹사이트가 될 수 있게 세심하게 다듬습니다.
                <br />
                탁월한 판단력과 몰입력을 가진 디자이너와 엔지니어들이 당신의 비즈니스가 성장에 집중할 수 있게 도와드리겠습니다.
              </div>

              <div className="md:w-160 text-2xl flex flex-row items-start justify-start font-normal overflow-hidden pt-8 md:pt-16 text-white">
                <p className="whitespace-pre-wrap">
                  <span>{"Fellows와 함께하면 더 "}</span>
                  <span className="md:hidden">
                    <br />
                  </span>
                  <Typewriter
                    text={["정확합니다.", "간단합니다.", "효과적입니다.", "창의적입니다."]}
                    speed={70}
                    className="text-yellow-500 text-pretty"
                    waitTime={1500}
                    deleteSpeed={40}
                    cursorChar={"_"}
                  />
                </p>
              </div>
            </div>
          </div>

          <div>
            <div
              className="text-sm md:text-base text-white pt-16"
              style={{ fontFamily: "var(--font-leaguegothic), var(--font-geist-sans), Helvetica, Arial, sans-serif" }}
            >
              PROCESS
            </div>

            <div className="flex flex-col space-y-24 lg:space-y-2">
              <div className="flex flex-col lg:flex-row text-white">
                <motion.div
                  className="text-9xl md:text-[180px] md:flex md:flex-wrap md:gap-x-4 pb-2 md:pb-16 leading-[0.9em]"
                  style={{ fontFamily: "var(--font-leaguegothic), var(--font-geist-sans), Helvetica, Arial, sans-serif" }}
                  variants={container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <motion.span className="block md:inline" variants={item}>
                    01/
                  </motion.span>
                </motion.div>

                <div className="flex lg:items-start lg:justify-center grow py-10 lg:py-0">DISCOVER</div>

                <div className="lg:w-96 lg:mr-32">
                  Kicking off with a discovery to learn in (more detail) about your brand, clients, goals, personality, services, ethos and more. We want to
                  know you and your business inside and out. The goal here is to gather as much information as possible to help us understand your brand as
                  thoroughly as possible, so there is no second-guessing. We want to know your goals, dislikes, and expectations.
                </div>
              </div>

              <div className="flex flex-col lg:flex-row text-white">
                <motion.div
                  className="text-9xl md:text-[180px] md:flex md:flex-wrap md:gap-x-4 pb-2 md:pb-16 leading-[0.9em]"
                  style={{ fontFamily: "var(--font-leaguegothic), var(--font-geist-sans), Helvetica, Arial, sans-serif" }}
                  variants={container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <motion.span className="block md:inline" variants={item}>
                    02/
                  </motion.span>
                </motion.div>

                <div className="flex lg:items-start lg:justify-center grow py-10 lg:py-0">DISCOVER</div>

                <div className="lg:w-96 lg:mr-32">
                  Kicking off with a discovery to learn in (more detail) about your brand, clients, goals, personality, services, ethos and more. We want to
                  know you and your business inside and out. The goal here is to gather as much information as possible to help us understand your brand as
                  thoroughly as possible, so there is no second-guessing. We want to know your goals, dislikes, and expectations.
                </div>
              </div>

              <div className="flex flex-col lg:flex-row text-white">
                <motion.div
                  className="text-9xl md:text-[180px] md:flex md:flex-wrap md:gap-x-4 pb-2 md:pb-16 leading-[0.9em]"
                  style={{ fontFamily: "var(--font-leaguegothic), var(--font-geist-sans), Helvetica, Arial, sans-serif" }}
                  variants={container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <motion.span className="block md:inline" variants={item}>
                    03/
                  </motion.span>
                </motion.div>

                <div className="flex lg:items-start lg:justify-center grow py-10 lg:py-0">DISCOVER</div>

                <div className="lg:w-96 lg:mr-32">
                  Kicking off with a discovery to learn in (more detail) about your brand, clients, goals, personality, services, ethos and more. We want to
                  know you and your business inside and out. The goal here is to gather as much information as possible to help us understand your brand as
                  thoroughly as possible, so there is no second-guessing. We want to know your goals, dislikes, and expectations.
                </div>
              </div>
            </div>
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
