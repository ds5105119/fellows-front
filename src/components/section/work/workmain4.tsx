"use client";

import { motion, useScroll, useSpring, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import Typewriter from "@/components/fancy/text/typewriter";
import ImageTrail from "@/components/resource/imagetrail";

const sections = [
  {
    number: "01",
    title: "DISCOVER",
    description:
      "Kicking off with a discovery to learn in more detail about your brand, clients, goals, personality, services, and ethos. We want to know you and your business inside and out.",
  },
  {
    number: "02",
    title: "DEFINE",
    description:
      "We define the vision, strategy, and scope based on insights gathered. Creating clarity and focus to align design and development with your goals.",
  },
  {
    number: "03",
    title: "DELIVER",
    description:
      "Execution of designs and implementation of web solutions that excite and move people. We ensure every pixel and interaction is crafted to perfection.",
  },
];

export default function WorkMain4() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionBRef = useRef<HTMLDivElement>(null);

  const textItems = ["CREATING", "DESIGN", "THAT", "EXCITES", "AND", "MOVE", "PEOPLE."];
  const circleCountDesktop = 13;
  const circleCountMobile = 7;

  const { scrollYProgress } = useScroll({
    target: sectionBRef,
    offset: ["start end", "start start"],
  });

  const createCircleAnimations = (count: number) => {
    const middle = Math.floor(count / 2);

    return Array.from({ length: count }).map((_, i) => {
      const order = i <= middle ? i : count - 1 - i;
      const start = (order / Math.ceil(count / 2)) * 0.7;
      const scaleX = useSpring(useTransform(scrollYProgress, [start, start + 0.05], [1, 1]));
      const scaleY = useSpring(useTransform(scrollYProgress, [start, start + 0.025, start + 0.04], [0, 1.4, 1]));

      return { scaleX, scaleY };
    });
  };

  const desktopAnimations = createCircleAnimations(circleCountDesktop);
  const mobileAnimations = createCircleAnimations(circleCountMobile);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, when: "beforeChildren" },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col" ref={containerRef}>
      <section className="w-full h-48 bg-[#FFFFFF] relative -z-10"></section>
      <section className="w-full bg-zinc-900 relative z-20 pb-25" ref={sectionBRef}>
        <div className="absolute top-0 left-0 w-full -z-10 -translate-y-1/2">
          <div className="hidden md:flex flex-row w-full">
            {desktopAnimations.map((anim, i) => (
              <motion.div
                key={i}
                className="bg-zinc-900"
                style={{
                  scaleX: anim.scaleX,
                  scaleY: anim.scaleY,
                  width: `calc(100vw / ${circleCountDesktop})`,
                  height: `calc(100vw / ${circleCountDesktop})`,
                  minWidth: 40,
                  minHeight: 40,
                  borderRadius: "50%",
                }}
              />
            ))}
          </div>

          <div className="md:hidden flex flex-row w-full">
            {mobileAnimations.map((anim, i) => (
              <motion.div
                key={i}
                className="bg-zinc-900"
                style={{
                  scaleX: anim.scaleX,
                  scaleY: anim.scaleY,
                  width: `calc(100vw / ${circleCountMobile})`,
                  height: `calc(100vw / ${circleCountMobile})`,
                  minWidth: 50,
                  minHeight: 50,
                  borderRadius: "50%",
                }}
              />
            ))}
          </div>
        </div>

        <div className="px-4 pb-25">
          <div className="text-sm md:text-base text-white pt-16 font-[var(--font-leaguegothic)]">ABOUT</div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-9xl md:text-[180px] text-white flex flex-wrap leading-[0.9em]"
            style={{ fontFamily: "var(--font-leaguegothic)" }}
          >
            {textItems.map((word, i) => (
              <motion.span key={i} variants={item} className="mr-4">
                {word}
              </motion.span>
            ))}
          </motion.div>

          <div className="flex flex-col md:items-end px-1 md:px-0 text-white">
            <div className="md:w-160 md:text-2xl">
              위대한 브랜드는 존재만으로 시선을 끕니다. Fellows는 대담하고, 오래 남고, 전환을 만들어내는 웹사이트가 될 수 있게 세심하게 다듬습니다.
              <br />
              탁월한 판단력과 몰입력을 가진 디자이너와 엔지니어들이 당신의 비즈니스가 성장에 집중할 수 있게 도와드리겠습니다.
            </div>
            <div className="md:w-160 text-2xl pt-8 md:pt-16">
              <p>
                <span>Fellows와 함께하면 더 </span>
                <Typewriter
                  text={["정확합니다.", "간단합니다.", "효과적입니다.", "창의적입니다."]}
                  speed={70}
                  waitTime={1500}
                  deleteSpeed={40}
                  cursorChar="_"
                  className="text-yellow-500"
                />
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 flex flex-col space-y-24 lg:space-y-2">
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
              Kicking off with a discovery to learn in (more detail) about your brand, clients, goals, personality, services, ethos and more. We want to know
              you and your business inside and out. The goal here is to gather as much information as possible to help us understand your brand as thoroughly as
              possible, so there is no second-guessing. We want to know your goals, dislikes, and expectations.
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
              Kicking off with a discovery to learn in (more detail) about your brand, clients, goals, personality, services, ethos and more. We want to know
              you and your business inside and out. The goal here is to gather as much information as possible to help us understand your brand as thoroughly as
              possible, so there is no second-guessing. We want to know your goals, dislikes, and expectations.
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
              Kicking off with a discovery to learn in (more detail) about your brand, clients, goals, personality, services, ethos and more. We want to know
              you and your business inside and out. The goal here is to gather as much information as possible to help us understand your brand as thoroughly as
              possible, so there is no second-guessing. We want to know your goals, dislikes, and expectations.
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
