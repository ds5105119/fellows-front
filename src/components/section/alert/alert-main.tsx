"use client";

import { deleteAlert, useAlerts } from "@/hooks/fetch/alert";
import { useEffect, useRef, useState } from "react";
import { useInView, motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Bell, X, ExternalLinkIcon } from "lucide-react";
import dayjs from "@/lib/dayjs";
import type { AlertDto } from "@/@types/accounts/alert";
import { useRouter } from "next/navigation";

interface AlertItemProps {
  alert: AlertDto;
  onDelete: (alert: AlertDto) => Promise<void>;
  onOpen: (alert: AlertDto) => void;
}

function AlertItem({ alert, onDelete, onOpen }: AlertItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeState, setSwipeState] = useState<"none" | "delete" | "open">("none");
  const [isAnimating, setIsAnimating] = useState(false);
  const x = useMotionValue(0);

  // 버튼이 나타나는 임계점
  const BUTTON_THRESHOLD = 90;
  // 자동 실행되는 임계점
  const AUTO_ACTION_THRESHOLD = 250;
  // 버튼 기본 크기
  const BUTTON_MIN_WIDTH = 80;

  // x 값에 따른 버튼 투명도 계산 (임계점 이후에만 나타남)
  const deleteOpacity = useTransform(x, [-BUTTON_THRESHOLD + 10, -BUTTON_THRESHOLD], [0, 1]);
  const readOpacity = useTransform(x, [BUTTON_THRESHOLD - 10, BUTTON_THRESHOLD], [0, 1]);

  // x 값에 따른 버튼 너비 계산 (드래그 거리만큼 늘어남, 최대 제한 없음)
  const deleteButtonWidth = useTransform(x, (value) => {
    if (value >= -BUTTON_THRESHOLD) return BUTTON_MIN_WIDTH;
    return Math.abs(value + 16);
  });

  const readButtonWidth = useTransform(x, (value) => {
    if (value <= BUTTON_THRESHOLD) return BUTTON_MIN_WIDTH;
    return Math.abs(value - 16);
  });

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = () => {
    const currentX = x.get();
    if (currentX < -BUTTON_THRESHOLD) {
      setSwipeState("delete");
    } else if (currentX > BUTTON_THRESHOLD) {
      setSwipeState("open");
    } else {
      setSwipeState("none");
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();

    // 자동 실행 임계점을 넘으면 바로 실행
    if (currentX < -AUTO_ACTION_THRESHOLD) {
      handleDeleteClick();
      return;
    } else if (currentX > AUTO_ACTION_THRESHOLD) {
      handleOpenClick();
      return;
    }

    // 버튼 임계점을 넘으면 버튼 위치에 스냅
    if (currentX < -BUTTON_THRESHOLD) {
      animate(x, -BUTTON_THRESHOLD, {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });
      setSwipeState("delete");
    } else if (currentX > BUTTON_THRESHOLD) {
      animate(x, BUTTON_THRESHOLD, {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });
      setSwipeState("open");
    } else {
      // 임계점을 넘지 않으면 원래 위치로
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });
      setSwipeState("none");
    }
  };

  const handleDeleteClick = async () => {
    setIsAnimating(true);
    // 왼쪽으로 스와이프 (삭제 버튼이 오른쪽에 있으므로)
    await animate(x, -400, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    try {
      await onDelete(alert);
    } catch (error) {
      console.error("Delete failed:", error);
      setIsAnimating(false);
    }
  };

  const handleOpenClick = async () => {
    setIsAnimating(true);
    // 오른쪽으로 스와이프 (읽기 버튼이 왼쪽에 있으므로)
    await animate(x, 400, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    setTimeout(() => {
      onOpen(alert);
    }, 200);
  };

  // 다른 곳을 터치하면 원래 위치로 복귀
  const resetPosition = () => {
    if (!isDragging && swipeState !== "none" && !isAnimating) {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });
      setSwipeState("none");
    }
  };

  return (
    <motion.div
      className="relative mb-3 mx-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1],
        },
      }}
      onTap={resetPosition}
    >
      {/* Delete button - 알림 오른쪽 끝 밖에 위치 */}
      <motion.div
        className="absolute top-0 bottom-0 flex items-center justify-start z-10"
        style={{
          right: 0,
          opacity: deleteOpacity,
        }}
      >
        <motion.button
          className="flex items-center justify-center bg-red-500 rounded-2xl shadow-lg h-full"
          style={{
            width: deleteButtonWidth,
          }}
          onClick={handleDeleteClick}
          whileTap={{ scale: 0.95 }}
          disabled={isAnimating}
        >
          <X className="w-6 h-6 text-white" />
        </motion.button>
      </motion.div>

      {/* Read button - 알림 왼쪽 끝 밖에 위치 */}
      <motion.div
        className="absolute top-0 bottom-0 flex items-center justify-end z-10"
        style={{
          left: 0,
          opacity: readOpacity,
        }}
      >
        <motion.button
          className="flex items-center justify-center bg-blue-500 rounded-2xl shadow-lg h-full"
          style={{
            width: readButtonWidth,
          }}
          onClick={handleOpenClick}
          whileTap={{ scale: 0.95 }}
          disabled={isAnimating}
        >
          <ExternalLinkIcon className="w-6 h-6 text-white" />
        </motion.button>
      </motion.div>

      {/* Alert card */}
      <motion.div
        drag="x"
        dragDirectionLock={true}
        dragElastic={0.1}
        dragMomentum={false}
        dragConstraints={{ left: -300, right: 300 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={isDragging ? {} : {}}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.6,
        }}
        className={`
          relative bg-white/70 rounded-2xl p-4 backdrop-blur-xl drop-shadow-2xl drop-shadow-black/10 z-20
          ${isDragging ? "cursor-grabbing" : "cursor-grab"}
          transition-shadow duration-200
          ${isAnimating ? "pointer-events-none" : ""}
        `}
        whileDrag={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
          scale: 1.02,
        }}
      >
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div
            className={`
            flex-shrink-0 size-12 rounded-lg flex items-center justify-center
            ${!alert.is_read ? "bg-blue-500" : "bg-gray-400"}
          `}
          >
            <Bell className="!size-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 h-fit flex flex-col justify-center">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">알림</h3>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{dayjs(alert.created_at).fromNow()}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{alert.message}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AlertMain() {
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
    <div className="relative w-full overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-md border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">알림</h1>
          <span className="text-sm text-gray-500">{alerts.filter((alert) => !alert.is_read).length}개의 새 알림</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mx-4 mt-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
        <p className="text-xs text-gray-600 text-center">💡 왼쪽으로 밀면 삭제, 오른쪽으로 밀면 읽음 처리</p>
      </div>

      {/* Alerts list */}
      <div className="pt-4 pb-20">
        {alerts.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">알림이 없습니다</h3>
            <p className="text-gray-500 text-center">새로운 알림이 도착하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {alerts.map((alert, idx) => (
              <AlertItem key={alert.id || `${alert.message}-${idx}`} alert={alert} onDelete={handleDeleteAlert} onOpen={handleOpenAlert} />
            ))}
          </AnimatePresence>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex space-x-2">
              <div className="size-1.5 bg-zinc-500 rounded-full animate-bounce" />
              <div className="size-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="size-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={infinitRef} className="h-4" />
      </div>
    </div>
  );
}
