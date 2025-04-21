import { ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelfareActionsProps {
  applyUrl?: string | null;
  contact?: string | null;
}

export function WelfareActions({ applyUrl, contact }: WelfareActionsProps) {
  return (
    <div className="border-y bg-background p-4 w-full">
      <div className="container max-w-screen-md flex gap-2">
        {applyUrl && (
          <Button className="flex-1" asChild>
            <a href={applyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              사이트로 이동
            </a>
          </Button>
        )}
        {contact && (
          <Button variant="outline" className="flex-1">
            <Phone className="mr-2 h-4 w-4" />
            담당부서 전화
          </Button>
        )}
      </div>
    </div>
  );
}
