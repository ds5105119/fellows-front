"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  subtitle: string;
  description: string;
  price?: number;
  period?: string;
  features: { title: string; bold: boolean }[];
}

interface PlanCardProps {
  plan: Plan;
  showButton?: boolean;
  buttonText?: string;
}

function PlanCard({ plan, showButton = true, buttonText = "문의하기" }: PlanCardProps) {
  return (
    <div>
      <div className="mb-6">
        <div className="h-16">
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
          <p className="text-gray-500 text-sm font-medium">{plan.subtitle}</p>
        </div>
        {plan.price !== undefined ? (
          <p className="text-gray-600 text-xl font-bold mb-4">
            {plan.price}만 원 <span className="text-sm">VAT 별도</span>
          </p>
        ) : (
          <p className="text-gray-600 text-xl font-bold mb-4">별도 문의</p>
        )}

        {showButton && (
          <Button className="w-full mb-4 bg-white" variant="outline">
            {buttonText}
          </Button>
        )}
        <div className="h-22">
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">{plan.description}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="text-gray-600 flex items-start gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className={cn("text-sm", feature.bold ? "font-extrabold" : "")}>{feature.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PlanSectionProps {
  plans: Plan[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  carouselHeight: number | null;
  hiddenRefs: React.RefObject<(HTMLDivElement | null)[]>;
  slideRefs: React.RefObject<(HTMLDivElement | null)[]>;
  buttonText?: string;
}

export default function PlanSection({
  plans,
  currentSlide,
  setCurrentSlide,
  nextSlide,
  prevSlide,
  carouselHeight,
  hiddenRefs,
  slideRefs,
  buttonText = "문의하기",
}: PlanSectionProps) {
  return (
    <div className="px-4 md:px-0">
      {/* Desktop Grid */}
      <div className="hidden lg:block bg-zinc-100 rounded-xl">
        <div className="grid grid-cols-4 divide-x-3 divide-background">
          {plans.map((plan, index) => (
            <div key={index} className="p-6 hover:bg-zinc-50 transition-colors duration-300">
              <PlanCard plan={plan} buttonText={buttonText} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex space-x-3">
              {plans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? "bg-gray-800" : "bg-gray-300"}`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              <button onClick={prevSlide} className="bg-black/5 hover:bg-gray-200 rounded-full p-3 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={nextSlide} className="bg-black/5 hover:bg-gray-200 rounded-full p-3 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              height: carouselHeight ? `${carouselHeight}px` : "auto",
            }}
          >
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                  ref={(el) => {
                    if (slideRefs.current) {
                      slideRefs.current[index] = el;
                    }
                  }}
                >
                  <div className="rounded-2xl bg-zinc-100 p-5">
                    <PlanCard plan={plan} showButton={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden elements for height measurement */}
      <div className="fixed -top-[9999px] left-0 w-full opacity-0 pointer-events-none">
        <div className="w-full px-4">
          {plans.map((plan, index) => (
            <div
              key={`hidden-${index}`}
              ref={(el) => {
                if (hiddenRefs.current) {
                  hiddenRefs.current[index] = el;
                }
              }}
              className="w-full rounded-2xl bg-zinc-100 p-5"
            >
              <PlanCard plan={plan} showButton={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
