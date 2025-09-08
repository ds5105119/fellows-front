"use client";

import Link from "next/link";
import { deleteHelp } from "@/hooks/fetch/help";
import { Trash, Edit, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Session } from "next-auth";

export default function HelpToolbar({ session, helpId }: { session: Session; helpId?: string }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const onDelete = async (id: string) => {
    if (confirm("정말로 이 도움말을 삭제하시겠습니까?")) {
      await deleteHelp(id);
      router.push("/help");
    }
  };

  const toggleToolbar = () => {
    setIsExpanded(!isExpanded);
  };

  if (session?.user?.groups?.includes("/manager") && helpId) {
    return (
      <div className="fixed bottom-10 left-10 md:bottom-8 md:left-8 flex flex-col items-center w-fit z-40">
        <AnimatePresence>
          {isExpanded && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="relative mb-4"
                onMouseEnter={() => setHoveredButton("delete")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  onClick={() => onDelete(helpId)}
                  className="size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-red-500 bg-red-200 hover:bg-red-300"
                >
                  <Trash />
                </motion.button>
                {hoveredButton === "delete" && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full whitespace-nowrap"
                  >
                    도움말을 삭제합니다
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.05 }}
                className="relative mb-4"
                onMouseEnter={() => setHoveredButton("edit")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                  <Link
                    href={`/help/${helpId}/edit`}
                    className="size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-blue-500 bg-blue-200 hover:bg-blue-300"
                  >
                    <Edit />
                  </Link>
                </motion.div>
                {hoveredButton === "edit" && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full whitespace-nowrap"
                  >
                    도움말을 수정합니다
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          onClick={toggleToolbar}
          className="size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-green-500 bg-green-200 hover:bg-green-300"
        >
          {isExpanded ? <X /> : <Plus />}
        </motion.button>
      </div>
    );
  } else if (session?.user?.groups?.includes("/manager")) {
    return (
      <div className="fixed bottom-10 left-10 md:bottom-8 md:left-8 flex flex-col space-y-4 w-fit z-40">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
          <Link
            href="/help/write"
            className="size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-blue-500 bg-blue-200 hover:bg-blue-300"
          >
            <Plus />
          </Link>
        </motion.div>
      </div>
    );
  }
  return null;
}
