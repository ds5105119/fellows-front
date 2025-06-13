"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import type { BlogPostDtoType } from "@/@types/service/blog";
import { deletePost, updatePost } from "@/hooks/fetch/blog";
import { Trash, Eye, EyeOff, Edit, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogToolbar({ session, post }: { session: Session | null; post?: BlogPostDtoType }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const onDelete = async (id: string) => {
    await deletePost(id);
    router.push("/blog");
  };

  const toggleToolbar = () => {
    setIsExpanded(!isExpanded);
  };

  if (session?.user.groups.includes("/manager") && post) {
    const togglePublish = async (id: string) => {
      const payload = {
        is_published: !post.is_published,
        published_at: post.is_published ? null : new Date().toISOString().slice(0, 19),
        tags: post.tags,
      };
      await updatePost(id, payload);
      router.push(`/blog/${post.id}`);
    };

    return (
      <div className="sticky bottom-10 left-10 md:bottom-8 md:left-8 flex flex-col items-center w-fit z-40">
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
                  onClick={() => onDelete(post.id)}
                  className="size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-red-500 bg-red-200 hover:bg-red-300"
                >
                  <Trash />
                </motion.button>
                {hoveredButton === "delete" && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full whitespace-nowrap"
                  >
                    포스트를 삭제합니다
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.05 }}
                className="relative mb-4"
                onMouseEnter={() => setHoveredButton("publish")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  onClick={() => togglePublish(post.id)}
                  className="size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-amber-500 bg-amber-200 hover:bg-amber-300"
                >
                  {post.is_published ? <EyeOff /> : <Eye />}
                </motion.button>
                {hoveredButton === "publish" && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full whitespace-nowrap"
                  >
                    {post.is_published ? "포스트를 비공개로 전환합니다" : "포스트를 공개로 전환합니다"}
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                className="relative mb-4"
                onMouseEnter={() => setHoveredButton("edit")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                  <Link
                    href="/blog/write"
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
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full whitespace-nowrap"
                  >
                    포스트를 수정합니다
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
  } else if (session?.user.groups.includes("/manager")) {
    return (
      <div className="sticky bottom-10 left-10 md:bottom-10 md:left-10 flex flex-col space-y-4 w-fit z-40">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
          <Link
            href="/blog/write"
            className="size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-blue-500 bg-blue-200 hover:bg-blue-300"
          >
            <Edit />
          </Link>
        </motion.div>
      </div>
    );
  }

  return null;
}
