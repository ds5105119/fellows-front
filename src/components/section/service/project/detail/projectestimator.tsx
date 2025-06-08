"use client";

import BreathingSparkles from "@/components/resource/breathingsparkles";
import MarkdownPreview from "@/components/ui/markdownpreview";
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchEventSource, EventSourceMessage } from "@microsoft/fetch-event-source";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { ERPNextProjectType } from "@/@types/service/erpnext";

interface Props {
  project: ERPNextProjectType;
}

export default function ProjectEstimator({ project }: Props) {
  const [markdown, setMarkdown] = useState<string>(project.custom_ai_estimate ?? "");
  const [lastMarkdown, setLastMarkdown] = useState<string>(project.custom_ai_estimate ?? "");
  const [ctrl, setCtrl] = useState<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState<number>(1);
  const initialized = useRef(false);

  const onClick = useCallback(() => {
    if (ctrl) {
      ctrl.abort();
    }

    const newCtrl = new AbortController();
    setIsLoading(true);
    setMarkdown("");
    setCtrl(newCtrl);

    fetchEventSource(`/api/service/project/${project.project_name}/estimate`, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
      },
      signal: newCtrl.signal,
      openWhenHidden: true,

      onopen: async (response) => {
        const ratelimit = parseInt(response.headers.get("x-ratelimit-remaining") ?? "0");
        const retryAfter = parseInt(response.headers.get("Retry-After") ?? "0");
        setRemaining(ratelimit);

        if (response.ok) {
          toast.info("AI 견적이 생성 중 입니다.", { description: `남은 요청 횟수: ${ratelimit}` });
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          const errorData = await response.json().catch(() => ({ message: "Client error" }));
          toast.error("API 호출에 실패했습니다.", {
            description: errorData.message,
          });
          newCtrl.abort();
        } else if (response.status === 429) {
          toast.warning("API 한도를 초과했습니다.", {
            description: `${format(Date.now() + retryAfter * 1000, "yyyy-MM-dd:HH:mm:ss")} 부터 사용 가능합니다.`,
          });
          newCtrl.abort();
        } else {
          toast.error("API 호출에 실패했습니다.", {
            description: "알 수 없는 에러가 발생했습니다.",
          });
          newCtrl.abort();
        }

        if (!response.ok) {
          setMarkdown(lastMarkdown);
          setIsLoading(false);
        }
      },
      onmessage: (event: EventSourceMessage) => {
        if (event.data === "") {
          setMarkdown((prev) => prev + "\n");
        } else {
          setMarkdown((prev) => prev + event.data);
        }
      },
      onclose: () => {
        setIsLoading(false);
        setLastMarkdown(markdown);
        setCtrl(null);
      },
      onerror: (err) => {
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          toast("네트워크 오류로 견적을 생성할 수 없습니다.");
        } else {
          toast("AI 견적 생성 중 오류가 발생했습니다.");
        }
        setIsLoading(false);
        newCtrl.abort();
        setCtrl(null);
      },
    });
  }, [ctrl, lastMarkdown, markdown, project.project_name]);

  useEffect(() => {
    if (!initialized.current && !project.custom_ai_estimate) {
      initialized.current = true;
      onClick();
    }
  }, [project.custom_ai_estimate, onClick]);

  useEffect(() => {
    return () => {
      if (ctrl) {
        ctrl.abort();
        setCtrl(null);
      }
    };
  }, [ctrl]);

  return (
    <div className="flex flex-col w-full h-full space-y-4 overflow-x-hidden">
      <div className="flex flex-col w-full h-full">
        <div className="w-full h-full flex flex-col p-8 space-y-6">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-bold">AI 견적</h2>
            <Button onClick={onClick} disabled={isLoading || remaining <= 0} className="bg-black hover:bg-neutral-700 transition-colors duration-200">
              <BreathingSparkles />
              {remaining <= 0 ? "제한 초과" : isLoading ? "견적 생성 중..." : "견적 다시 작성하기"}
            </Button>
          </div>
          <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary prose-img:rounded-md prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl">
            <MarkdownPreview loading={isLoading}>{markdown}</MarkdownPreview>
          </div>
        </div>
      </div>
    </div>
  );
}
