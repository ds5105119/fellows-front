"use client";

import { useAlerts } from "@/hooks/fetch/alert";
import { useEffect, useRef, useState } from "react";
import { useInView, motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Bell, X, Eye } from "lucide-react";
import dayjs from "@/lib/dayjs";
import type { AlertDto } from "@/@types/accounts/alert";

interface AlertItemProps {
  alert: AlertDto;
  onDelete: (alert: AlertDto) => void;
  onRead: (alert: AlertDto) => void;
}

function AlertItem({ alert, onDelete, onRead }: AlertItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeState, setSwipeState] = useState<"none" | "delete" | "read">("none");
  const x = useMotionValue(0);

  // 버튼이 나타나는 임계점
  const BUTTON_THRESHOLD = 80;
  // 자동 실행되는 임계점
  const AUTO_ACTION_THRESHOLD = 200;

  // x 값에 따른 배경 투명도 계산
  const deleteOpacity = useTransform(x, [-BUTTON_THRESHOLD, 0], [1, 0]);
  const readOpacity = useTransform(x, [0, BUTTON_THRESHOLD], [0, 1]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = () => {
    const currentX = x.get();

    if (currentX < -BUTTON_THRESHOLD) {
      setSwipeState("delete");
    } else if (currentX > BUTTON_THRESHOLD) {
      setSwipeState("read");
    } else {
      setSwipeState("none");
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();

    // 자동 실행 임계점을 넘으면 바로 실행
    if (currentX < -AUTO_ACTION_THRESHOLD) {
      onDelete(alert);
      return;
    } else if (currentX > AUTO_ACTION_THRESHOLD) {
      onRead(alert);
      return;
    }

    // 버튼 임계점을 넘으면 버튼 위치에 스냅
    if (currentX < -BUTTON_THRESHOLD) {
      x.set(-BUTTON_THRESHOLD);
      setSwipeState("delete");
    } else if (currentX > BUTTON_THRESHOLD) {
      x.set(BUTTON_THRESHOLD);
      setSwipeState("read");
    } else {
      // 임계점을 넘지 않으면 원래 위치로
      x.set(0);
      setSwipeState("none");
    }
  };

  const handleDeleteClick = () => {
    onDelete(alert);
  };

  const handleReadClick = () => {
    onRead(alert);
  };

  // 다른 곳을 터치하면 원래 위치로 복귀
  const resetPosition = () => {
    if (!isDragging && swipeState !== "none") {
      x.set(0);
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
        x: x.get() > 0 ? 300 : -300,
        transition: { duration: 0.3 },
      }}
      onTap={resetPosition}
    >
      {/* Delete background */}
      <motion.div className="absolute inset-0 rounded-2xl flex items-center justify-end" style={{ opacity: deleteOpacity }}>
        <motion.button
          className="flex items-center justify-center w-18 h-full bg-red-50/70 rounded-2xl backdrop-blur-xl drop-shadow-2xl drop-shadow-black/10"
          onClick={handleDeleteClick}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: swipeState === "delete" ? 1 : 0.8,
            opacity: swipeState === "delete" ? 1 : 0.7,
          }}
        >
          <X className="w-6 h-6 text-red-500" />
        </motion.button>
      </motion.div>

      {/* Read background */}
      <motion.div className="absolute inset-0 rounded-2xl flex items-center justify-start" style={{ opacity: readOpacity }}>
        <motion.button
          className="flex items-center justify-center w-18 h-full bg-blue-50/70 rounded-2xl backdrop-blur-xl drop-shadow-2xl drop-shadow-black/10"
          onClick={handleReadClick}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: swipeState === "read" ? 1 : 0.8,
            opacity: swipeState === "read" ? 1 : 0.7,
          }}
        >
          <Eye className="w-6 h-6 text-blue-500" />
        </motion.button>
      </motion.div>

      {/* Alert card */}
      <motion.div
        drag="x"
        dragDirectionLock={true}
        dragElastic={0.1}
        dragMomentum={false}
        dragConstraints={{ left: -AUTO_ACTION_THRESHOLD, right: AUTO_ACTION_THRESHOLD }}
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
          relative bg-white/70 rounded-2xl p-4 backdrop-blur-xl drop-shadow-2xl drop-shadow-black/10
          ${isDragging ? "cursor-grabbing" : "cursor-grab"}
          transition-shadow duration-200
        `}
        whileDrag={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
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

  const handleDeleteAlert = (alert: AlertDto) => {
    // 삭제 로직 구현
    console.log("Delete alert:", alert);
  };

  const handleReadAlert = (alert: AlertDto) => {
    // 읽음 처리 로직 구현
    console.log("Mark as read:", alert);
  };

  return (
    <div className="relative w-full">
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
              <AlertItem key={alert.id || `${alert.message}-${idx}`} alert={alert} onDelete={handleDeleteAlert} onRead={handleReadAlert} />
            ))}
          </AnimatePresence>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={infinitRef} className="h-4" />
      </div>
    </div>
  );
}
