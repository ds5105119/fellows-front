"use client";

import { Share } from "lucide-react";
import MobileHeaderButton from "./mobileheaderbutton";

export default function MobileHeaderShareButton() {
  const handleShare = () => {
    navigator.share({
      title: "",
      text: "",
      url: window.location.href,
    });
  };

  return <MobileHeaderButton icon={Share} size={6} onClick={handleShare} />;
}
