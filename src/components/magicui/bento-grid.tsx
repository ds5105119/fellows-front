import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div className={cn("grid w-full auto-rows-[18rem] lg:auto-rows-[24rem] grid-cols-3 gap-5 lg:gap-8", className)} {...props}>
      {children}
    </div>
  );
};

const BentoCard = ({ name, className, background, description, href, cta, ...props }: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl lg:rounded-3xl",
      // light styles
      "bg-background",
      // dark styles
      "transform-gpu dark:bg-background",
      className
    )}
    {...props}
  >
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 lg:gap-3 p-8 lg:p-12 transition-all">
      <h3 className="text-xl lg:text-4xl font-extrabold text-white dark:text-neutral-300">{name}</h3>
      <p className="max-w-lg text-lg font-semibold text-muted whitespace-pre-wrap hidden lg:block">{description}</p>
      <div className="block lg:hidden">
        <a href={href} className="pointer-events-auto text-white py-1 flex items-center">
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </div>
    </div>

    <div>{background}</div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 hidden lg:flex w-full translate-y-10 transform-gpu flex-row items-center p-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto text-white">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:hover:bg-white/10 group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
