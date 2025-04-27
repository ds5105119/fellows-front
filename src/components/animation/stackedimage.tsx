"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import React from "react";

interface StackedImageAnimationProps {
  children: React.ReactNode;
}

const containerVariants = {
  start: {},
  stop: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const ImageVariants = [
  {
    start: { opacity: 1, y: 0, scale: 1 },
    stop: {
      opacity: 0,
      y: 10,
      scale: 0.9,
      transition: {
        type: "spring",
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },
  {
    start: { opacity: 1, y: -21, scale: 0.77 },
    stop: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 1.5,
        ease: "easeOut",
      },
    },
  },
  {
    start: { opacity: 0.9, y: -42, scale: 0.5 },
    stop: {
      opacity: 1,
      y: -21,
      scale: 0.77,
      transition: {
        type: "spring",
        duration: 1.5,
        ease: "easeOut",
      },
    },
  },
  {
    start: { opacity: 0.6, y: -21, scale: 0.5 },
    stop: {
      opacity: 0.9,
      y: -42,
      scale: 0.5,
      transition: {
        type: "spring",
        duration: 1.0,
        ease: "easeIn",
      },
    },
  },
] as const;

export default function StackedImageAnimation({ children }: StackedImageAnimationProps) {
  const controls = useAnimation();
  const count = React.Children.count(children);
  const [index, setIndex] = React.useState(0);
  const childrenArray = React.Children.toArray(children);

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start("stop");
      setIndex((prevIndex) => (prevIndex + 1) % count);
      controls.start("start");
    }, 2500);

    return () => clearInterval(interval);
  }, [controls, setIndex, count]);

  return (
    <motion.ul initial="start" animate={controls} variants={containerVariants} className="relative block w-fit h-auto">
      <li className="invisible select-none pointer-events-none">{childrenArray.at(index)}</li>
      {Array.from({ length: 4 }, (_, i) => childrenArray.at((index + i) % count)).map((child, i) => {
        return (
          <motion.li
            key={i + "-" + index}
            variants={ImageVariants[i]}
            initial="start"
            animate="stop"
            style={{ zIndex: 3 - i }}
            className={`absolute inline-block top-0 select-none pointer-events-none`}
          >
            {child}
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
