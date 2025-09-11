"use client";

import Link from "next/link";
import ProjectDropdownMenu from "./projectdropdownmenu";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { SWRMeta } from "./projectmainsection";
import { Plus, PencilLine, Receipt, Calendar, ArrowRight, Clock5, Trash2, SquareMousePointer, Loader2 } from "lucide-react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import type { UserERPNextProject } from "@/@types/service/project";
import { deleteProject } from "@/hooks/fetch/project";
import { Session } from "next-auth";
dayjs.extend(relativeTime);
dayjs.locale("ko");

// 애니메이션 상태를 전역으로 관리하기 위한 Map
const animationPlayedMap = new Map<string, boolean>();

export default function ProjectContainer({
  meta,
  session,
  status,
  bg,
  text,
  border,
  className,
  setSelectedProject,
}: {
  meta: SWRMeta;
  session: Session;
  status: string;
  bg: string;
  text: string;
  border: string;
  className?: string;
  setSelectedProject: (project: UserERPNextProject | null) => void;
}) {
  const projects = meta.data?.items || [];
  const isLoading = meta.swr.isLoading;
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // 애니메이션 상태 관리
  const containerKey = `project-container-${status}`;
  const hasAnimated = useRef(animationPlayedMap.get(containerKey) || false);
  const [shouldAnimate, setShouldAnimate] = useState(!hasAnimated.current);

  // 컴포넌트가 마운트될 때 애니메이션 상태 확인
  useEffect(() => {
    if (!hasAnimated.current && projects.length > 0) {
      // 애니메이션이 실행되었음을 기록
      hasAnimated.current = true;
      animationPlayedMap.set(containerKey, true);

      // 애니메이션 완료 후 상태 업데이트
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, projects.length * 50 + 500); // 모든 아이템 애니메이션 + 여유시간

      return () => clearTimeout(timer);
    }
  }, [projects.length, containerKey]);

  // DnD 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [justDropped, setJustDropped] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // 센서 설정 - 드래그 감지를 위한 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        delay: 0,
        tolerance: 5,
      },
    })
  );

  // 현재 드래그 중인 프로젝트 찾기
  const activeProject = activeId ? projects.find((_, index) => `project-${index}` === activeId) : null;

  // 드래그 시작 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setIsDragging(true);
    setJustDropped(null);

    // 실제 드래그된 요소 (드래그 핸들) 찾기
    const dragHandle = event.activatorEvent?.target as HTMLElement;

    if (dragHandle && event.activatorEvent) {
      // 드래그 핸들의 부모 컴포넌트 찾기
      const projectCard = dragHandle.closest("[data-dnd-id]") as HTMLElement;

      if (projectCard && "clientX" in event.activatorEvent && "clientY" in event.activatorEvent) {
        const mouseEvent = event.activatorEvent as MouseEvent;
        const cardRect = projectCard.getBoundingClientRect();

        // 컴포넌트 기준 마우스 상대 위치 계산
        const offsetX = mouseEvent.clientX - cardRect.left - 10;
        const offsetY = mouseEvent.clientY - cardRect.top - 10;

        setMouseOffset({ x: offsetX, y: offsetY });
      }
    }
  };

  // 드래그 오버 핸들러
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    const overTrash = over?.id === "trash-zone";
    setIsOverTrash(overTrash);
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    const droppedId = activeId;

    // 쓰레기통 위에서 드래그가 끝났다면 삭제 처리
    if (over && over.id === "trash-zone") {
      removeProject(activeProject);
    }

    setActiveId(null);
    setIsDragging(false);
    setIsOverTrash(false);
    setMouseOffset({ x: 0, y: 0 }); // 마우스 오프셋 리셋

    // 드롭된 아이템 표시 (애니메이션 비활성화용)
    if (droppedId) {
      setJustDropped(droppedId);
      // 짧은 시간 후 상태 리셋
      setTimeout(() => setJustDropped(null), 100);
    }
  };

  // 프로젝트 삭제 핸들러
  const removeProject = async (project?: UserERPNextProject | null) => {
    if (!project) return;

    if (window.confirm("프로젝트를 삭제하면 모든 정보가 삭제됩니다. 계속 진행하시겠습니까?")) {
      await meta.swr.mutate();
      await deleteProject(project.project_name);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className={cn("flex flex-col space-y-1.5", className)}>
        <div className={cn("w-full flex flex-col justify-center rounded-sm space-y-1.5 p-1.5", bg, text)}>
          {/* 로딩 상태 */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <Loader2 className="size-4 text-blue-500 animate-spin" strokeWidth={2.5} />
            </motion.div>
          )}

          {/* 프로젝트 정보 박스 */}
          {!isLoading && (
            <AnimatePresence mode="popLayout">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.project_name}
                  // 애니메이션을 한 번만 실행하도록 조건부 설정
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                  animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    delay: shouldAnimate ? idx * 0.05 : 0,
                    // 드롭된 아이템은 애니메이션 비활성화
                    duration: justDropped === `project-${idx}` ? 0 : undefined,
                  }}
                  layout={justDropped !== `project-${idx}`} // 드롭된 아이템은 layout 애니메이션 비활성화
                >
                  <ProjectItem
                    session={session}
                    project={project}
                    idx={idx}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    meta={meta}
                    onClick={() => setSelectedProject(project)}
                    id={`project-${idx}`}
                    justDropped={justDropped === `project-${idx}`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {!isLoading && projects.length === 0 && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={shouldAnimate ? { opacity: 1 } : false}
              transition={{ delay: shouldAnimate ? 0.2 : 0 }}
            >
              <p className={cn("text-center text-xs", text)}>없음</p>
            </motion.div>
          )}

          {/* 신규 프로젝트 생성*/}
          {!isLoading && status === "draft" && (
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : false}
              transition={{ delay: shouldAnimate ? projects.length * 0.05 + 0.1 : 0 }}
            >
              <Link
                href="./project/new"
                className="cursor-pointer flex items-center justify-center w-full rounded-xs bg-white outline-[1px] outline-dashed py-2 hover:bg-muted transition-colors duration-200"
              >
                <Plus className="!size-6" strokeWidth={2.5} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* 쓰레기통 영역 - 드래그 중일 때만 표시 */}
      <AnimatePresence>{isDragging && <TrashZone isOverTrash={isOverTrash} />}</AnimatePresence>

      {/* 드래그 오버레이 - 드래그 중인 아이템의 시각적 표현 */}
      <DragOverlay>
        {activeId && activeProject && (
          <div
            className={cn(
              "w-[16rem] rounded-sm overflow-clip outline-[5px] outline-gray-900/10 border-1",
              isOverTrash ? "scale-90 opacity-70" : "drop-shadow-xl",
              border
            )}
            style={{
              transform: `translate(-${mouseOffset.x}px, -${mouseOffset.y}px) ${isOverTrash ? "scale(0.9)" : "scale(1.0)"}`,
              opacity: isOverTrash ? 0.7 : 1,
              transition: "none",
            }}
          >
            <div className="relative flex flex-col space-y-1.5 rounded-xs bg-white items-center p-4">
              <div className="w-full flex justify-between">
                <div className="flex space-x-1.5 items-center text-sm min-w-0 flex-1">
                  {activeProject.custom_emoji ? (
                    <div className="size-4 flex items-center justify-center flex-shrink-0">
                      <span className="text-center">{activeProject.custom_emoji}</span>
                    </div>
                  ) : (
                    <PencilLine className="!size-4 flex-shrink-0" />
                  )}
                  <div className="truncate font-bold min-w-0">{activeProject.custom_project_title}</div>
                </div>
              </div>

              <div className={cn("w-full flex mt-1 space-x-2 items-center font-medium", activeProject.estimated_costing ? "text-zinc-700" : "text-zinc-400")}>
                <Receipt className="!size-3.5 shrink-0" />
                <div className="truncate text-xs min-w-0 flex-1">
                  {activeProject.estimated_costing ? (
                    <p>
                      <span className="font-bold">{activeProject.estimated_costing.toLocaleString()}</span> 원
                    </p>
                  ) : (
                    <p>
                      <span className="font-bold">AI 견적을 생성하여 확인해보세요.</span> 원
                    </p>
                  )}
                </div>
              </div>

              <div className={cn("w-full flex space-x-2 items-center font-medium", activeProject.expected_start_date ? "text-zinc-700" : "text-zinc-400")}>
                <Calendar className="!size-3.5 shrink-0" />
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {activeProject.expected_start_date && (
                    <div className="truncate text-xs">{dayjs(activeProject.expected_start_date).format("YYYY-MM-DD") ?? "정해지지 않았어요"}</div>
                  )}
                  {activeProject.expected_start_date && !activeProject.expected_end_date && (
                    <div className="text-xs font-normal text-zinc-400 flex-shrink-0">시작</div>
                  )}
                  {activeProject.expected_end_date && <ArrowRight className="!size-3 flex-shrink-0" />}
                  {activeProject.expected_end_date && (
                    <div className="truncate text-xs">{dayjs(activeProject.expected_end_date).format("YYYY-MM-DD") ?? "정해지지 않았어요"}</div>
                  )}
                  {!activeProject.expected_start_date && !activeProject.expected_end_date && (
                    <div className="truncate text-xs">마감 목표를 설정할 수 있어요</div>
                  )}
                </div>
              </div>

              <div className={cn("w-full flex space-x-2 items-center font-medium", activeProject.creation ? "text-zinc-700" : "text-zinc-400")}>
                <Clock5 className="!size-3.5 shrink-0" />
                <div className="truncate text-xs min-w-0 flex-1">{dayjs(activeProject.creation).fromNow()}</div>
              </div>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// 쓰레기통 컴포넌트 - useDroppable 훅 사용
function TrashZone({ isOverTrash }: { isOverTrash: boolean }) {
  const { setNodeRef } = useDroppable({
    id: "trash-zone",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      ref={setNodeRef}
    >
      <div
        className={cn(
          "flex items-center justify-center px-4 py-4 rounded-lg transition-all duration-300 border-2 border-dashed",
          isOverTrash ? "bg-red-500/30 scale-110 border-red-500" : "bg-red-500/10 border-red-300"
        )}
      >
        <Trash2 className={cn("transition-all duration-300", isOverTrash ? "text-red-600 size-8" : "text-red-500 size-6")} />
      </div>
    </motion.div>
  );
}

interface ProjectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  session: Session;
  project: UserERPNextProject;
  idx: number;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  meta: SWRMeta;
  id: string;
  justDropped?: boolean;
}

// 드래그 가능한 프로젝트 아이템 컴포넌트
function ProjectItem({ session, project, idx, openMenu, setOpenMenu, meta, id, justDropped, ...props }: ProjectItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: {
      project,
      index: idx,
    },
  });

  // 드래그 중일 때는 투명하게 처리
  if (isDragging) {
    return <div className="opacity-30 h-[60px] border-2 border-dashed border-gray-300 rounded-xs"></div>;
  }

  return (
    <div className="w-full text-gray-900 select-none" data-dnd-id={id} {...props}>
      {/* 프로젝트 내용 - 클릭 가능 */}
      <div
        className={cn(
          "w-full flex flex-col space-y-1.5 rounded-xs bg-white items-center p-4 hover:bg-muted",
          justDropped ? "" : "transition-colors duration-200" // 드롭된 아이템은 transition 제거
        )}
      >
        <div className="w-full flex justify-between">
          <div className="flex space-x-1.5 items-center text-sm min-w-0 flex-1">
            {project.custom_emoji ? (
              <div className="size-4 flex items-center justify-center flex-shrink-0">
                <span className="text-center">{project.custom_emoji}</span>
              </div>
            ) : (
              <PencilLine className="!size-4 flex-shrink-0" />
            )}
            <div className="truncate font-bold min-w-0">{project.custom_project_title}</div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {project.customer === session.sub && (
              <div
                className="size-6 rounded-sm items-center justify-center hover:bg-neutral-200 cursor-grab active:cursor-grabbing hidden lg:flex"
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
              >
                <SquareMousePointer className="!size-4" />
              </div>
            )}
            <div className="w-6 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <ProjectDropdownMenu openMenu={openMenu} setOpenMenu={setOpenMenu} meta={meta} idx={idx} session={session} />
            </div>
          </div>
        </div>

        <div className={cn("w-full flex mt-1 space-x-2 items-center font-medium", project.estimated_costing ? "text-zinc-700" : "text-zinc-400")}>
          <Receipt className="!size-3.5 shrink-0" />
          <div className="truncate text-xs min-w-0 flex-1">
            {project.estimated_costing ? (
              <p>
                <span className="font-bold">{project.estimated_costing.toLocaleString()}</span> 원
              </p>
            ) : (
              <p>
                <span className="font-bold">{project.custom_project_status === "draft" ? "AI 견적을 생성하여 확인해보세요." : "정해지지 않았어요."}</span>
              </p>
            )}
          </div>
        </div>

        <div
          className={cn(
            "w-full flex space-x-2 items-center font-medium",
            project.expected_start_date || project.expected_end_date ? "text-zinc-700" : "text-zinc-400"
          )}
        >
          <Calendar className="!size-3.5 shrink-0" />
          <div className="flex items-center space-x-1.5 min-w-0 flex-1">
            {project.expected_start_date && (
              <div className="truncate text-xs text-zinc-700">{dayjs(project.expected_start_date).format("YYYY-MM-DD") ?? "정해지지 않았어요"}</div>
            )}
            {project.expected_start_date && !project.expected_end_date && <div className="text-xs font-normal text-zinc-400 flex-shrink-0">시작</div>}
            {project.expected_start_date && project.expected_end_date && <ArrowRight className="!size-3 flex-shrink-0" />}
            {project.expected_end_date && (
              <div className="truncate text-xs text-zinc-700">{dayjs(project.expected_end_date).format("YYYY-MM-DD") ?? "정해지지 않았어요"}</div>
            )}
            {!project.expected_start_date && project.expected_end_date && <div className="text-xs font-normal text-zinc-400 flex-shrink-0">종료</div>}
            {!project.expected_start_date && !project.expected_end_date && <div className="truncate text-xs">마감 목표를 설정할 수 있어요</div>}
          </div>
        </div>

        <div className={cn("w-full flex space-x-2 items-center font-medium", project.creation ? "text-zinc-700" : "text-zinc-400")}>
          <Clock5 className="!size-3.5 shrink-0" />
          <div className="truncate text-xs min-w-0 flex-1">{dayjs(project.creation).fromNow()}</div>
        </div>
      </div>
    </div>
  );
}
