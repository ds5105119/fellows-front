"use client";

import { Link, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogShare({ title, text }: { title: string; text: string }) {
  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: window.location.href,
      });
    } else {
      toast("공유 기능이 지원되지 않는 브라우저입니다.");
    }
  };

  const copylink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("링크가 복사되었습니다!");
  };

  return (
    <div className="flex items-center space-x-6">
      <button onClick={share}>
        <Share2 className="size-5 text-gray-600 hover:text-gray-800 transition-colors duration-200" strokeWidth={2.2} />
      </button>
      <button onClick={copylink}>
        <Link className="size-5 text-gray-600 hover:text-gray-800 transition-colors duration-200" strokeWidth={2.2} />
      </button>
    </div>
  );
}
