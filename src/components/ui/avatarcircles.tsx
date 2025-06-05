"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface AvatarData {
  src: string;
  fallback: string;
}

interface StackedAvatarsProps {
  avatars: AvatarData[];
  maxDisplayed?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarCircles({ avatars, maxDisplayed = 5, size = "md", className }: StackedAvatarsProps) {
  // Limit the number of avatars displayed
  const displayedAvatars = avatars.slice(0, maxDisplayed);
  const remainingCount = avatars.length - maxDisplayed > 0 ? avatars.length - maxDisplayed : 0;

  // Size configuration
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }[size];

  // Overlap configuration (in pixels)
  const overlapClass = {
    sm: "-ml-3",
    md: "-ml-5",
    lg: "-ml-4",
  }[size];

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center">
        {displayedAvatars.map((avatar, index) => (
          <div
            key={`${avatar.fallback}-${index}`}
            className={cn("rounded-full border-2 border-background", index !== 0 && overlapClass)}
            style={{ zIndex: displayedAvatars.length - index }}
          >
            <Avatar className={cn(sizeClass, "ring-2 ring-background")}>
              <AvatarImage src={avatar.src || "/placeholder.svg"} alt={avatar.fallback} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className={cn(
              "ring-2 ring-background flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
              sizeClass,
              overlapClass
            )}
            style={{ zIndex: 0 }}
          >
            <span className="text-xs">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
