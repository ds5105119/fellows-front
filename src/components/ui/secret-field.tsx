"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  secret?: string | null;
};

export default function SecretField({ secret }: Props) {
  const [visible, setVisible] = useState(false);

  const handleCopy = async () => {
    if (!secret) return;
    await navigator.clipboard.writeText(secret);
    toast.info("복사되었습니다.");
  };

  if (!secret) {
    return (
      <div className="inline-flex items-center px-3 py-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-md">
        없거나 등록되지 않았어요
      </div>
    );
  }

  return (
    <div className="inline-flex items-center overflow-hidden">
      <div className="flex items-center min-w-0 pr-4">
        <code className={cn("text-sm font-mono text-foreground select-all", !visible && "tracking-wider")}>
          {visible ? secret : "*".repeat(Math.min(secret.length, 20))}
        </code>
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

        <button type="button" onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors" title="클립보드에 복사">
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
}
