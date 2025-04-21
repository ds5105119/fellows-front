import Image from "next/image";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";

export default async function ExternalField() {
  const domain = `${process.env.NEXT_PUBLIC_QR_DIMAIN_URL}`;

  const compony_info = `주식회사 IIH | 대표 김동현
  사업자등록번호: xxx-xx-xxxxx
  서울 관악구 봉천로 536-1 피닉스빌딩
  제2022-서울관악-2391호 
  원집은 통신판매 중개자로 상품정보 및 거래에 대한 책임은 입점판매자에게 있음을 고지합니다
  Copyright ©IIH. All rights reserved.`;

  return (
    <div className="flex flex-col w-full bg-muted px-6 py-10 max-w-[400px]">
      <div className="flex flex-col space-y-10 items-center">
        <Image src="/onezip/logo-with-korean.svg" alt="흑백 로고" width={122.8} height={51.2} className="opacity-95" />

        <div className="flex h-10 w-full items-center space-x-2 rounded-4xl bg-white outline-2 outline-blue-600/50 drop-shadow-lg">
          <input type="text" placeholder="검색어를 입력해 주세요" className="text-sm w-full focus:outline-none focus:ring-0 px-4" />
          <Button variant="ghost">
            <Search className="!size-5 hover:bg-transparent" strokeWidth={3} />
          </Button>
        </div>
      </div>

      <div className="flex justify-between rounded-2xl bg-white p-4 mt-10">
        <div className="flex flex-col space-y-2 justify-end min-h-full">
          <div className="flex items-center space-x-2 font-semibold text-neutral-500 hover:underline decoration-wavy decoration-2 underline-offset-4 decoration-sky-500">
            <span>제휴 문의</span> <ChevronRight className="!size-5" />
          </div>
          <div className="flex items-center space-x-2 font-semibold text-neutral-500 hover:underline decoration-wavy decoration-2 underline-offset-4 decoration-sky-500">
            <span>근처 가게 찾기</span> <ChevronRight className="!size-5" />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="h-auto max-w-32 w-full">
            <QRCode size={512} className="h-auto max-w-full w-full" value={domain} viewBox={`0 0 512 512`} />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-10">
        <Button variant="default" className="w-full rounded-2xl">
          로그인
        </Button>
        <Button variant="outline" className="w-full rounded-2xl">
          회원가입
        </Button>
        <Button variant="outline" className="w-full rounded-2xl">
          이용약관
        </Button>
      </div>
    </div>
  );
}
