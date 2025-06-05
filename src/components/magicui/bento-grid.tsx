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
  emoji?: string;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div className={cn("grid w-full auto-rows-[18rem] lg:auto-rows-[22rem] grid-cols-3 gap-5", className)} {...props}>
      {children}
    </div>
  );
};

const BentoCard = ({ name, className, background, emoji, Icon, description, href, cta, ...props }: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
      // light styles
      "bg-background",
      // dark styles
      "transform-gpu dark:bg-background",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 lg:gap-2 p-6 transition-all duration-300 group-hover:-translate-y-10">
      {emoji ? (
        <div className="h-12 w-12 mb-2 group-hover:mb-0 text-5xl origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:text-4xl">
          {emoji}
        </div>
      ) : (
        <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      )}
      <h3 className="text-xl lg:text-3xl font-bold text-neutral-700 dark:text-neutral-300">{name}</h3>
      <p className="max-w-lg font-medium text-neutral-400 whitespace-pre-wrap">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
