"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Autoplay from "embla-carousel-autoplay";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { fetchEventSource, EventSourceMessage } from "@microsoft/fetch-event-source";
import { ProjectSchemaType } from "@/@types/service/project";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

interface Props {
  project: ProjectSchemaType;
  session: Session;
}

const marqueeItems = [
  [
    { img: "/imagestack-logo1.svg", text: "Shopify" },
    { img: "/imagestack-logo2.svg", text: "Next.js" },
    { img: "/imagestack-logo3.svg", text: "Shopping" },
    { img: "/imagestack-logo4.svg", text: "React" },
    { img: "/imagestack-logo5.svg", text: "Framer" },
  ],
  [
    { img: "/imagestack-logo1.svg", text: "Shopify" },
    { img: "/imagestack-logo2.svg", text: "Next.js" },
    { img: "/imagestack-logo3.svg", text: "Shopping" },
    { img: "/imagestack-logo4.svg", text: "React" },
    { img: "/imagestack-logo5.svg", text: "Framer" },
  ],
] as const;

const MarqueeCard = ({ img, text }: { img: string; text: string }) => {
  return (
    <div className="flex flex-row items-center gap-3 px-2">
      <Image src={img} height={45} width={45} alt="imagestack logo" className="rounded-lg pointer-events-none select-none" />
      <p className="text-lg font-semibold pointer-events-none select-none">{text}</p>
    </div>
  );
};

export default function ProjectEstimator({ project, session }: Props) {
  const [markdown, setMarkdown] = useState<string>(project.ai_estimate ?? "");
  const [ctrl, setCtrl] = useState<AbortController | null>(null);
  const [rateLimit, setRateLimit] = useState<string>("");

  const onClick = () => {
    if (ctrl) {
      ctrl.abort();
    }

    const url = `${process.env.NEXT_PUBLIC_PROJECT_ESTIMATE_URL}/${project.project_id}`;
    const newCtrl = new AbortController();
    setMarkdown("");
    setCtrl(newCtrl);

    fetchEventSource(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "text/event-stream",
      },
      signal: newCtrl.signal,
      openWhenHidden: true,

      onopen: async (response) => {
        if (response.ok) {
          const rateLimit = response.headers.get("x-ratelimit-remaining") ?? "";
          setRateLimit(rateLimit);
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          const errorData = await response.json().catch(() => ({ message: "Client error" }));
          toast.error("API 호출에 실패했습니다.", {
            description: errorData.message,
          });
          newCtrl.abort();
        } else if (response.status === 429) {
          toast.warning("API 한도를 초과했습니다.", {
            description: "잠시 뒤 다시 시도해주세요.",
          });
          newCtrl.abort();
        } else {
          toast.error("API 호출에 실패했습니다.", {
            description: "알 수 없는 에러가 발생했습니다.",
          });
          console.log(response, response.status, response.statusText, response.headers);
          newCtrl.abort();
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
        setCtrl(null); // 컨트롤러 정리
      },
      onerror: (err) => {
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          toast("네트워크 오류로 견적을 생성할 수 없습니다.");
        } else {
          toast("AI 견적 생성 중 오류가 발생했습니다.");
        }
        newCtrl.abort();
        setCtrl(null);
      },
    });
  };

  useEffect(() => {
    return () => {
      if (ctrl) {
        ctrl.abort();
        setCtrl(null);
      }
    };
  }, [ctrl]);

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      <div className="flex flex-col w-full h-full">
        {!markdown ? (
          <div className="flex flex-col justify-center w-full h-full space-y-6 p-4">
            <div className="flex flex-col w-full items-center justify-center space-y-3 rounded-xl md:rounded-2xl drop-shadow-xl/5">
              <Carousel
                className="w-full"
                opts={{ loop: true }}
                plugins={[
                  Autoplay({
                    delay: 5000,
                    stopOnInteraction: false,
                  }),
                ]}
              >
                <CarouselContent>
                  <CarouselItem>
                    <Link href="/service/welfare">
                      <AspectRatio ratio={344 / 80} className="pointer-events-none select-none">
                        <Image src="/fellows/carousel1-344-80.jpg" fill alt="imagestack logo" className="rounded-3xl" />
                      </AspectRatio>
                    </Link>
                  </CarouselItem>
                  <CarouselItem>
                    <AspectRatio ratio={344 / 80} className="pointer-events-none select-none">
                      <Image src="/fellows/carousel2-344-80.jpg" fill alt="imagestack logo" className="rounded-3xl" />
                    </AspectRatio>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>

            <div className="flex flex-col w-full items-center justify-center space-y-3 rounded-xl md:rounded-2xl bg-white drop-shadow-xl/5 py-10">
              <div className="w-full flex flex-col space-y-0">
                {marqueeItems.map((items, i) => {
                  return (
                    <Marquee className="[--duration:36s] w-full" reverse={i % 2 == 1} key={i}>
                      {items.map((item, j) => (
                        <MarqueeCard img={item.img} text={item.text} key={(i + 1) * j} />
                      ))}
                    </Marquee>
                  );
                })}
              </div>

              <div className="text-lg text-center font-bold pt-3">
                아직 견적을 만들지 않았어요 <br />
                AI로 견적 작성을 시작해보세요!
              </div>
              <div className="w-full h-14 px-10">
                <Button onClick={onClick} className="w-full h-14">
                  <BreathingSparkles />
                  <AnimatedGradientText className="text-base font-bold">AI 견적 작성하기 </AnimatedGradientText>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {markdown && (
          <div className="p-8 prose prose-sm md:prose-base max-w-none prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary prose-img:rounded-md prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
