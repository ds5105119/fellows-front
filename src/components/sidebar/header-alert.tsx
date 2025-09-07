"use client";

import type React from "react";

import type { AlertDto } from "@/@types/accounts/alert";
import { deleteAlert, useAlerts } from "@/hooks/fetch/alert";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { AnimatePresence, useInView } from "framer-motion";
import { BellIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function AlertItem({ alert, onDelete, onOpen }: { alert: AlertDto; onDelete: (alert: AlertDto) => Promise<void>; onOpen: (alert: AlertDto) => void }) {
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    currentX: 0,
    deltaX: 0,
  });

  const handleStart = (clientX: number) => {
    setDragState({
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      deltaX: 0,
    });
  };

  const handleMove = (clientX: number) => {
    if (!dragState.isDragging) return;

    const deltaX = clientX - dragState.startX;
    // Only allow left swipe (negative deltaX)
    const clampedDeltaX = Math.min(0, deltaX);

    setDragState((prev) => ({
      ...prev,
      currentX: clientX,
      deltaX: clampedDeltaX,
    }));
  };

  const handleEnd = async () => {
    if (!dragState.isDragging) return;

    const threshold = -100; // Swipe left threshold

    if (dragState.deltaX < threshold) {
      // Delete the alert
      try {
        await onDelete(alert);
      } catch (error) {
        console.error("Failed to delete alert:", error);
      }
    }

    // Reset drag state
    setDragState({
      isDragging: false,
      startX: 0,
      currentX: 0,
      deltaX: 0,
    });
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we were dragging
    if (Math.abs(dragState.deltaX) > 5) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onOpen(alert);
  };

  return (
    <div
      className="w-full h-22 px-4 hover:bg-black/5 transition-all duration-200 flex items-center space-x-3 select-none relative overflow-hidden"
      style={{
        transform: `translateX(${dragState.deltaX}px)`,
        backgroundColor: dragState.deltaX < -50 ? "rgba(239, 68, 68, 0.1)" : undefined,
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={dragState.isDragging ? handleMouseMove : undefined}
      onMouseUp={dragState.isDragging ? handleMouseUp : undefined}
      onMouseLeave={dragState.isDragging ? handleMouseUp : undefined}
    >
      <div className={cn("flex-shrink-0 size-12 rounded-xl flex items-center justify-center", !alert.is_read ? "bg-blue-500" : "bg-gray-400")}>
        <BellIcon className="!size-5 text-white" />
      </div>

      <div className="flex-1 min-w-0 h-fit flex flex-col justify-center">
        <p className="text-sm text-gray-700 leading-tight">{alert.message}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 flex-shrink-0 mt-1">{dayjs(alert.created_at).fromNow()}</div>
      </div>
    </div>
  );
}

export default function HeaderAlert() {
  const alertSwr = useAlerts(50);
  const router = useRouter();

  // 데이터 처리
  const alerts = alertSwr.data?.flatMap((issue) => issue.items) ?? [];
  const isReachedEnd = alertSwr.data && alertSwr.data.length > 0 && alertSwr.data[alertSwr.data.length - 1].items.length === 0;
  const isLoading = !isReachedEnd && (alertSwr.isLoading || (alertSwr.data && alertSwr.size > 0 && typeof alertSwr.data[alertSwr.size - 1] === "undefined"));

  // 무한 스크롤
  const infinitRef = useRef<HTMLDivElement>(null);
  const isReachingEnd = useInView(infinitRef, {
    once: false,
    margin: "-50px 0px -50px 0px",
  });

  useEffect(() => {
    if (isReachingEnd && !isLoading && !isReachedEnd) {
      alertSwr.setSize((s) => s + 1);
    }
  }, [isReachingEnd, isLoading, isReachedEnd]);

  const handleDeleteAlert = async (alert: AlertDto) => {
    try {
      await deleteAlert(`${alert.id}`);
      alertSwr.mutate();
    } catch (error) {
      console.error("Failed to delete alert:", error);
      throw error;
    }
  };

  const handleOpenAlert = (alert: AlertDto) => {
    router.push(alert.link);
  };

  return (
    <div className="relative w-full h-full overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 h-14 px-4 z-10 flex items-center bg-white">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl font-bold text-gray-900">알림</h1>
          <span className="mr-10 md:mr-0 text-sm text-gray-500 px-2.5 py-1 rounded-full bg-black/5">
            {alerts.filter((alert) => !alert.is_read).length}개의 새 알림
          </span>
        </div>
      </div>

      {/* Alerts list */}
      <div>
        {alerts.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <BellIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">알림이 없습니다</h3>
            <p className="text-gray-500 text-center">새로운 알림이 도착하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="divide-y divide-black/10">
              {alerts.map((alert, idx) => (
                <AlertItem key={alert.id || `${alert.message}-${idx}`} alert={alert} onDelete={handleDeleteAlert} onOpen={handleOpenAlert} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex space-x-2">
              <div className="size-1 bg-zinc-500 rounded-full animate-bounce" />
              <div className="size-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="size-1 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={infinitRef} className="h-4" />
      </div>
    </div>
  );
}
