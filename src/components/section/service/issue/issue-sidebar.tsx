"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Filter, Info, X } from "lucide-react";
import type { OverviewERPNextProject } from "@/@types/service/project";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";

type Props = {
  session: Session;
  project: string[] | undefined;
  setProject: (project: string[] | undefined) => void;
  overviewProjects: OverviewERPNextProject[];
};

/**
 * Responsive IssueSidebar
 * - xl and up: classic left sidebar
 * - lg and below: top bar with [일별 | 월별] and a hamburger. Clicking opens a sliding panel from the right under the bar.
 */
export default function IssueSidebar({ session, project, setProject, overviewProjects }: Props) {
  const [openMobile, setOpenMobile] = useState(false);

  // Measure the top bar bottom to anchor the overlay panel directly below it,
  // filling the remaining viewport height without pushing layout.
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [panelTop, setPanelTop] = useState(0);

  const recalcPanelTop = () => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setPanelTop(rect.bottom);
  };

  useEffect(() => {
    recalcPanelTop();
    const ro = new ResizeObserver(() => recalcPanelTop());
    if (headerRef.current) ro.observe(headerRef.current);

    const onScroll = () => {
      if (openMobile) recalcPanelTop();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recalcPanelTop);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recalcPanelTop);
    };
  }, [openMobile]);

  const filteredProjects = useMemo(
    () =>
      overviewProjects
        // Member filter
        .filter((p) => p.custom_team.filter((m) => m.member === session.sub).some((m) => m.level < 3))
        // Exclude drafts
        .filter((p) => p.custom_project_status !== "draft"),
    [overviewProjects, session.sub]
  );

  const toggleOpenMobile = () => setOpenMobile((v) => !v);

  const ProjectList = ({ compact = false }: { compact?: boolean }) => (
    <Command className={cn("rounded-sm bg-zinc-50", compact && "border")}>
      <CommandInput placeholder="프로젝트 이름 또는 ID 입력" />
      <CommandList className="overflow-y-auto">
        <CommandEmpty>결과가 없어요</CommandEmpty>
        <CommandGroup>
          {filteredProjects.map((val, idx) => (
            <CommandItem
              key={idx}
              className={cn(
                "flex items-center space-x-2 cursor-pointer",
                project?.includes(val.project_name) ? "bg-zinc-200 hover:!bg-zinc-200 data-[selected=true]:bg-zinc-200" : ""
              )}
              value={val.project_name + " " + val.custom_project_title}
              onSelect={() =>
                project?.includes(val.project_name)
                  ? project.length == 1
                    ? setProject([])
                    : setProject(project.filter((p) => p != val.project_name))
                  : project
                  ? setProject([...project, val.project_name])
                  : setProject([val.project_name])
              }
            >
              <p className="w-3/4 truncate font-semibold">{val.custom_project_title}</p>
              <p className="grow truncate text-xs">{val.project_name}</p>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  return (
    <>
      {/* Desktop / xl+ left sidebar */}
      <aside className="hidden xl:flex flex-col shrink-0 min-w-72 w-72 h-full px-4 py-3 border-r">
        <div className="sticky top-16 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">이슈</h2>
            <div />
          </div>
          <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 text-sm mt-4">
            <Info className="size-4" aria-hidden="true" />
            <p>진행 중인 프로젝트만 표시되요.</p>
          </div>
          <div className="mt-4">
            <ProjectList />
          </div>
        </div>
      </aside>

      {/* Mobile / lg and below: top bar + fixed sliding panel below it */}
      <div className="xl:hidden z-10 w-full border-b border-b-sidebar-border sticky top-12 md:top-16 bg-background">
        <div ref={headerRef} className="flex items-center justify-between px-4 h-13">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={toggleOpenMobile}
            aria-expanded={openMobile}
            aria-controls="report-mobile-panel"
            className="rounded-sm bg-muted font-bold flex items-center !pl-1.5 !h-8 py-0 hover:bg-zinc-200 transition-colors duration-300 relative"
          >
            <AnimatePresence mode="wait" initial={false}>
              {openMobile ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <X className="size-4" aria-hidden="true" />
                  <span className="sr-only">메뉴 닫기</span>
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Filter className="size-4" aria-hidden="true" />
                  <span className="sr-only">메뉴 열기</span>
                </motion.span>
              )}
            </AnimatePresence>
            필터
          </Button>

          <div className="flex items-center gap-2">
            <div />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {openMobile && (
            <motion.div
              id="report-mobile-panel"
              role="region"
              aria-label="이슈 필터"
              key="panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              // Fixed overlay: directly under the top bar, fills remaining viewport height, no layout shift or overflow flicker.
              className="fixed left-0 right-0 z-40 bg-white border-b shadow-md overflow-y-auto"
              style={{
                top: panelTop,
                height: `calc(100dvh - ${panelTop}px)`,
              }}
            >
              <div className="px-4 pb-4 pt-2">
                <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 text-sm mb-3">
                  <Info className="size-4" aria-hidden="true" />
                  <p>진행 중인 프로젝트만 표시되요.</p>
                </div>
                <ProjectList compact />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
