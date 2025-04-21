"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Check, ChevronDown, X } from "lucide-react";
import { formatNumberKoreanWon, formatNumberKoreanWontoFixed } from "@/lib/utils";
import { FiscalByYearResponse } from "@/@types/openApi/fiscal";

interface FiscalDrawerProps {
  year?: string;
  data: FiscalByYearResponse;
}

export default function FiscalDrawer({ year, data }: FiscalDrawerProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const currentIndex = data.findIndex((item) => `${item.FSCL_YY}` === year);
  const currentData = data[currentIndex];
  const amt = formatNumberKoreanWontoFixed(currentData?.Y_YY_DFN_MEDI_KCUR_AMT ?? currentData?.Y_YY_MEDI_KCUR_AMT ?? 0);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    isMounted && (
      <Drawer direction="bottom">
        <DrawerTrigger>
          <div className="flex px-8 mt-6 w-full justify-start">
            <div className="flex space-x-1 items-baseline">
              <span className="rounded-md bg-green-200/40 px-2 py-0.5 text-green-700 font-normal">{year}</span>
              <div className="flex items-center text-lg font-semibold space-x-2">
                <span>년 예산은 총 {amt} 원 이에요</span> <ChevronDown />
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex w-full items-start justify-between">
              <div className="flex-1">
                <DrawerTitle>다른 년도의 예산이 궁금하신가요?</DrawerTitle>
                <DrawerDescription>드래그하여 밑으로 내릴 수 있습니다.</DrawerDescription>
              </div>
              <DrawerClose>
                <X />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <Carousel
              opts={{
                align: "start",
                startIndex: currentIndex > 0 ? currentIndex - 1 : 0,
              }}
              orientation="vertical"
              className="w-full"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <CarouselContent className="-mt-1 h-52 z-50">
                {data.map((value, index) => (
                  <CarouselItem
                    key={index}
                    className="pt-1 flex justify-between items-center basis-1/4 cursor-pointer"
                    onClick={() => router.push(`/explore/fiscal/${value.FSCL_YY}`)}
                  >
                    <div className="flex flex-col">
                      <span className={`${value.FSCL_YY}` === year ? "font-bold text-sky-600" : "font-medium"}>{value.FSCL_YY}</span>
                      <span className="text-sm font-extralight">{formatNumberKoreanWon(value.Y_YY_DFN_MEDI_KCUR_AMT ?? value.Y_YY_MEDI_KCUR_AMT ?? 0)} 원</span>
                    </div>
                    {`${value.FSCL_YY}` === year && <Check className="text-sky-600" strokeWidth={3} />}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  );
}
