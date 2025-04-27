"use client";

import { motion } from "framer-motion";
import React from "react";

interface SplitTextProps {
  children: React.ReactNode;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

function splitIntoLines(node: React.ReactNode): string[] {
  const result: string[] = [];

  const process = (n: React.ReactNode) => {
    if (typeof n === "string") {
      const lines = n.split(/\n/g);
      result.push(...lines);
    } else if (Array.isArray(n)) {
      n.forEach(process);
    } else if (React.isValidElement(n)) {
      const el = n as React.ReactElement<{ children?: React.ReactNode }>;
      if (el.type !== "br") {
        process(el.props.children);
      }
    }
  };

  process(node);
  return result;
}

export default function SplitText({ children }: SplitTextProps) {
  if (!React.isValidElement(children)) return null;

  const element = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
  const className = element.props.className ?? "";
  const lines = splitIntoLines(element.props.children);

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }} variants={containerVariants} className={className}>
      {lines.map((line, i) => (
        <div key={i} className="block">
          {line.split(" ").map((word, j) => (
            <motion.span key={`${i}-${j}`} variants={wordVariants} className="inline-block mx-1 whitespace-nowrap">
              {word}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
