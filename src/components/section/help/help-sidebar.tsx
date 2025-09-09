"use client";

import type { HelpRead, HelpsRead } from "@/@types/service/help";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, FolderOpen, Receipt, CheckSquare, FileBarChart, AlertCircle, CreditCard, MoreHorizontal, Menu, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const helpCategories = [
  { value: "일반", label: "일반", icon: HelpCircle },
  { value: "프로젝트", label: "프로젝트", icon: FolderOpen },
  { value: "견적서", label: "견적서", icon: Receipt },
  { value: "테스크", label: "테스크", icon: CheckSquare },
  { value: "보고서", label: "보고서", icon: FileBarChart },
  { value: "이슈", label: "이슈", icon: AlertCircle },
  { value: "구독", label: "구독", icon: CreditCard },
  { value: "기타", label: "기타", icon: MoreHorizontal },
] as const;

export default function HelpSidebar({ helps, help }: { helps: HelpsRead; help?: HelpRead }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => {
          const container = document.getElementById("main");
          container?.scrollTo({ top: 0, behavior: "smooth" });
          setIsOpen(false); // Close mobile menu after click
        }}
      >
        <FileText className="w-4 h-4 mr-2" />
        전체
      </Button>
      {helpCategories.map((category) => {
        const Icon = category.icon;
        const count = helps?.items?.filter((help) => help.category === category.value).length || 0;

        return (
          <Button
            key={category.value}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              if (help) {
                router.push(`/help/#${category.value}`);
                setIsOpen(false); // Close mobile menu after click
                return;
              }
              const target = document.getElementById(category.value);
              target?.scrollIntoView({ behavior: "smooth", block: "start" });
              setIsOpen(false); // Close mobile menu after click
            }}
          >
            <Icon className="w-4 h-4 mr-2" />
            {category.label}
            <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{count}</span>
          </Button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar - unchanged */}
      <div className="hidden md:block w-48 bg-card border-r border-border p-4 absolute top-0 h-full overflow-y-auto">
        <h2 className="font-semibold text-lg mb-4 ml-3">카테고리</h2>
        <SidebarContent />
      </div>

      <div className="md:hidden fixed top-4 left-4 right-4 z-50">
        <Button variant="outline" className="w-full justify-between bg-background shadow-lg" onClick={() => setIsOpen(!isOpen)}>
          <span className="flex items-center">
            <Menu className="w-4 h-4 mr-2" />
            카테고리
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              style={{ top: "80px" }} // Start below the button
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scaleY: 0 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              style={{ transformOrigin: "top" }}
              className="md:hidden fixed top-16 left-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
