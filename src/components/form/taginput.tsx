"use client";

import { useState, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, useAnimation } from "framer-motion";

export default function TagInput({
  value,
  onChange,
  placeholder = "쉼표(,)로 구분",
}: {
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [pendingComma, setPendingComma] = useState(false);
  const controls = useAnimation();

  const addTag = () => {
    const trimmed = input.trim().replace(/,$/, "");

    if (!trimmed) return;

    if (value.includes(trimmed)) {
      // 중복이면 흔들기만 하고 추가하지 않음
      controls.start({
        x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
        transition: { duration: 0.4 },
      });
      toast("이미 입력한 기술이에요.");
    } else {
      onChange(Array.from(new Set([...value, trimmed])));
    }

    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ",") {
      if (isComposing) {
        setPendingComma(true);
      } else {
        e.preventDefault();
        addTag();
      }
    } else if (e.key === "Backspace" && input === "") {
      onChange(value.slice(0, -1));
    }
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
    if (pendingComma) {
      addTag();
      setPendingComma(false);
    }
  };

  return (
    <motion.div animate={controls} className="flex flex-wrap items-center gap-1 py-4 px-4 rounded-2xl bg-gray-100 border-0 min-h-12">
      {value.map((tag, i) => (
        <Badge key={i} variant="secondary" className="flex items-center gap-1 font-bold bg-blue-500/15 max-w-[150px] overflow-hidden">
          <p className="truncate whitespace-nowrap" title={tag}>
            {tag}
          </p>
          <button
            type="button"
            onClick={() => {
              const newTags = [...value];
              newTags.splice(i, 1);
              onChange(newTags);
            }}
            className="ml-1 cursor-pointer flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        className="grow min-w-[120px] border-none shadow-none focus-visible:ring-0 focus:outline-none font-semibold pl-1 h-fit w-fit"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
      />
    </motion.div>
  );
}
