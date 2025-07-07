"use client";

import { useAlerts } from "@/hooks/fetch/alert";
import { useEffect, useRef, useState } from "react";
import { useInView, motion, AnimatePresence, type PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Bell, X, ExternalLink } from "lucide-react";
import dayjs from "@/lib/dayjs";
import { AlertDto } from "@/@types/accounts/alert";

interface AlertItemProps {
  alert: AlertDto;
  onDelete: (alert: AlertDto) => void;
}

function AlertItem({ alert, onDelete }: AlertItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  // x 값에 따른 삭제 배경 투명도 계산
  const deleteOpacity = useTransform(x, [-100, 0, 100], [1, 0, 1]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    // 스와이프 거리가 충분하면 삭제 (100px 이상)
    if (Math.abs(info.offset.x) > 100) {
      onDelete(alert);
    }
    // 제자리로 돌아가기는 animate={{ x: 0 }}이 자동 처리
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
    >
      {/* Delete background */}
      <motion.div className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-end pr-6" style={{ opacity: deleteOpacity }}>
        <X className="w-6 h-6 text-white" />
      </motion.div>

      {/* Alert card */}
      <motion.div
        drag="x"
        dragDirectionLock={true}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={isDragging ? {} : { x: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.6,
        }}
        className={`
          relative bg-white rounded-2xl p-4 glass border border-gray-100
          ${!alert.is_read ? "bg-blue-50 border-blue-200" : ""}
          ${isDragging ? "cursor-grabbing" : "cursor-grab"}
          transition-shadow duration-200
        `}
        whileDrag={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div
            className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            ${!alert.is_read ? "bg-blue-500" : "bg-gray-400"}
          `}
          >
            <Bell className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">알림</h3>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{dayjs(alert.created_at).fromNow()}</span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-2">{alert.message}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{dayjs(alert.created_at).format("YYYY년 M월 D일 HH:mm")}</span>

              {alert.link && (
                <button className="text-blue-500 hover:text-blue-600 transition-colors" onClick={() => window.open(alert.link, "_blank")}>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Unread indicator */}
          {!alert.is_read && <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />}
        </div>

        {/* Swipe hint - 50px 이상 드래그했을 때만 표시 */}
        <motion.div
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-red-500 text-xs font-medium pointer-events-none"
          style={{
            opacity: useTransform(x, [-100, -50, 0, 50, 100], [1, 1, 0, 1, 1]),
          }}
        >
          놓아서 삭제
        </motion.div>
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

  const handleDeleteAlert = () => {};

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
      <div className="mx-4 mt-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">💡 알림을 좌우로 밀어서 삭제할 수 있습니다</p>
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
              <AlertItem key={alert.id || `${alert.message}-${idx}`} alert={alert} onDelete={handleDeleteAlert} />
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
