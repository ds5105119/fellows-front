"use client";

import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return isVisible ? (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full bg-black text-white text-sm opacity-25">
      {message}
    </div>
  ) : (
    <div />
  );
}
