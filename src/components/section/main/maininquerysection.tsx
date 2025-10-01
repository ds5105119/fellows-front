"use client";

import type React from "react";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import VariableFontHoverByLetter from "@/components/fancy/text/variable-font-hover-by-letter";
import AnimatedUnderlineTextarea from "@/components/ui/animatedunderlinetextarea";
import { toast } from "sonner";
import AnimatedUnderlineInput from "@/components/ui/animatedunderlineinput";

export default function MainInquerySection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name")?.toString().trim(),
      company: formData.get("company")?.toString().trim(),
      level: formData.get("level")?.toString().trim(),
      budget: formData.get("budget")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      description: formData.get("description")?.toString().trim(),
    };

    // Validation
    if (!data.name || !data.email || !data.budget || !data.description) {
      toast("성함, 이메일, 전화번호, 메시지는 필수 입력 항목입니다.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast("이메일 형식이 올바르지 않습니다");
      return;
    }

    try {
      const response = await fetch("https://api.fellows.my/api/contact/homepage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.info("문의가 접수되었습니다 🥳");
    } catch (error) {
      toast.info("오류가 발생했습니다 🤔");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4">
      <div className="w-full pb-8 md:pb-10">
        <div className="flex flex-col space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">Tell us about your project ✽</h1>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
            <h4 className="text-base md:text-lg font-semibold text-foreground">우리가 잘 해낼 수 있는 프로젝트인지 검토 후 3일이내 연락 드리겠습니다.</h4>
          </div>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-2 gap-6 md:gap-10">
          <div className="col-span-1 flex flex-col space-y-1">
            <div className="text-sm md:text-base font-bold">
              성함<span className="text-destructive">*</span>
            </div>
            <AnimatedUnderlineInput name="name" className="!text-base md:!text-2xl min-h-[1.4em] md:min-h-[2em]" placeholder="성함을 입력해주세요." required />
          </div>

          <div className="col-span-1 flex flex-col space-y-1">
            <div className="text-sm md:text-base font-bold">
              예산(만원)<span className="text-destructive">*</span>
            </div>
            <AnimatedUnderlineInput
              name="budget"
              className="!text-base md:!text-2xl min-h-[1.4em] md:min-h-[2em]"
              placeholder="예산을 입력해주세요."
              required
            />
          </div>

          <div className="col-span-1 flex flex-col space-y-1">
            <div className="text-sm md:text-base font-bold">회사명</div>
            <AnimatedUnderlineInput name="company" className="!text-base md:!text-2xl min-h-[1.4em] md:min-h-[2em]" placeholder="회사명을 입력해주세요." />
          </div>

          <div className="col-span-1 flex flex-col space-y-1">
            <div className="text-sm md:text-base font-bold">직급</div>
            <AnimatedUnderlineInput name="level" className="!text-base md:!text-2xl min-h-[1.4em] md:min-h-[2em]" placeholder="직급을 입력해주세요." />
          </div>

          <div className="col-span-full md:col-span-1 flex flex-col space-y-1">
            <div className="text-sm md:text-base font-bold">
              이메일<span className="text-destructive">*</span>
            </div>
            <AnimatedUnderlineInput
              name="email"
              type="email"
              className="!text-base md:!text-2xl min-h-[1.4em] md:min-h-[2em]"
              placeholder="이메일을 입력해주세요."
              required
            />
          </div>

          <div className="col-span-full md:col-span-1 flex flex-col space-y-1">
            <div className="text-sm md:text-base font-bold">전화번호</div>
            <AnimatedUnderlineInput
              name="phone"
              type="tel"
              className="!text-base md:!text-2xl min-h-[1.4em] md:min-h-[2em]"
              placeholder="전화번호를 입력해주세요."
            />
          </div>

          <div className="col-span-full flex flex-col space-y-1">
            <div className="text-sm md:text-base font-bold">
              메시지<span className="text-destructive">*</span>
            </div>
            <AnimatedUnderlineTextarea
              name="description"
              containerClassName="col-span-full"
              className="!text-base md:!text-2xl min-h-[6em] md:min-h-[8em]"
              placeholder="자유롭게 메시지를 작성해주세요."
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-fit flex items-center justify-start gap-1.5 text-2xl font-light">
            <ArrowRight strokeWidth={1} size={32} />
            <VariableFontHoverByLetter
              label={isSubmitting ? "Sending..." : "Send"}
              staggerDuration={0.03}
              fromFontVariationSettings="'wght' 400, 'slnt' 0"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
