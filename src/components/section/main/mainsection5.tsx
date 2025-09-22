import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { InView } from "@/components/ui/in-view";

export default async function MainSection5() {
  return (
    <div className="w-full">
      <div className="w-full px-4 flex flex-col space-y-4 md:space-y-6 pb-12 lg:pb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-normal text-foreground">Fellows의 개발 프로세스</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end md:justify-between">
          <h4 className="text-base md:text-lg font-semibold text-foreground">
            외주 시작에서 퍼블리싱 후 유지보수까지,
            <br />
            Fellows 하나면 끝.
          </h4>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        {" "}
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          viewOptions={{ margin: "0px 0px 100px 0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="col-span-1 bg-muted aspect-square rounded-3xl">
            <div className="w-full h-full px-6 md:px-10 pt-6 md:pt-10 flex flex-col justify-between overflow-hidden relative">
              <div className="flex flex-col space-y-1.5 z-50 w-full shrink-0">
                <div className="flex flex-col space-y-2">
                  <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                    Fellows를 통해
                    <br />
                    원스톱으로 견적에서 계약까지
                  </p>
                </div>
              </div>

              <div className="pt-3 md:pt-5 grow w-full relative flex items-end justify-center">
                <div className="w-full h-fit">
                  <AspectRatio ratio={600 / 448}>
                    <Image src="/section-5-1.png" alt="메인 섹션 5 이미지" fill className="object-contain" />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </InView>
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          viewOptions={{ margin: "0px 0px 100px 0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="col-span-1 bg-muted aspect-square rounded-3xl">
            <div className="w-full h-full px-6 md:px-10 pt-6 md:pt-10 flex flex-col justify-between overflow-hidden relative">
              <div className="flex flex-col space-y-1.5 z-50 w-full shrink-0">
                <div className="flex flex-col space-y-2">
                  <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">디자인 및 개발 착수 </p>
                </div>
              </div>

              <div className="pt-3 md:pt-5 grow w-full relative flex items-end justify-center">
                <div className="w-full h-fit">
                  <AspectRatio ratio={600 / 490}>
                    <Image src="/section-5-2.png" alt="메인 섹션 5 이미지" fill className="object-contain" />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </InView>
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          viewOptions={{ margin: "0px 0px 100px 0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="col-span-1 bg-muted aspect-square rounded-3xl">
            <div className="w-full h-full px-6 md:px-10 pt-6 md:pt-10 flex flex-col justify-between overflow-hidden relative">
              <div className="flex flex-col space-y-1.5 z-50 w-full shrink-0">
                <div className="flex flex-col space-y-2">
                  <p className="text-xl md:text-2xl font-extrabold tracking-normal text-black leading-normal">
                    퍼블리싱 및 유지보수까지,
                    <br />
                    Fellows가 든든하게 책임집니다
                  </p>
                </div>
              </div>

              <div className="pt-3 md:pt-5 grow w-full relative flex items-end justify-center">
                <div className="w-full h-fit">
                  <AspectRatio ratio={600 / 490}>
                    <Image src="/section-5-3.png" alt="메인 섹션 5 이미지" fill className="object-contain" />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </div>
  );
}
