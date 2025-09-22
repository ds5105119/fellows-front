import Image from "next/image";
import SelectLogo from "@/components/resource/selectlogo";
import Link from "next/link";
import HelpDialog from "@/components/section/help/help-dialog";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 w-full grid grid-cols-4 md:grid-cols-12 gap-6">
      <div className="z-10 col-span-full mx-6 my-12 md:mx-0 md:my-20 md:col-span-10 md:col-start-2">
        <div className="w-full flex justify-between items-center">
          <SelectLogo />
          <div className="h-5 md:h-8 flex justify-end">
            <Image src="/shopify partners logo.png" alt="쇼피파이 파트너 로고" width={438} height={74} className="h-full w-auto object-contain grayscale" />
          </div>
        </div>

        <div className="self-stretch inline-flex justify-start items-start gap-9 mt-4">
          <div className="w-fit inline-flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch justify-start text-black text-sm font-semibold">Fellows* 정보</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <Link href="/" className="justify-start text-neutral-500 text-sm font-normal">
                홈
              </Link>
              <Link href="/price" className="justify-start text-neutral-500 text-sm font-normal">
                가격
              </Link>
              <Link href="/blog" className="justify-start text-neutral-500 text-sm font-normal">
                블로그
              </Link>
              <HelpDialog>
                <div className="justify-start text-neutral-500 text-sm font-normal cursor-pointer">도움말</div>
              </HelpDialog>
            </div>
          </div>

          <div className="inline-flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch justify-start text-black text-sm font-semibold">제품</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <Link href="/service/dashboard" className="justify-start text-neutral-500 text-sm font-normal">
                Fellows SaaS
              </Link>
              <div className="justify-start text-neutral-500 text-sm font-normal">팀 구독</div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mt-8" />

        <div className="self-stretch flex flex-col justify-start items-start gap-4 mt-8">
          <div className="self-stretch space-y-4 justify-start items-center flex-wrap content-center hidden md:flex">
            <div className="flex-1 justify-start text-neutral-500 text-xs font-medium leading-none">Copyright © 2025 IIH Inc. All rights reserved.</div>

            <div className="flex justify-start items-center gap-2.5">
              <div className="justify-start text-neutral-500 text-xs font-normal leading-none">개인정보 처리방침</div>
              <div className="w-0 h-2.5 outline-[0.25px] outline-neutral-500"></div>
              <div className="justify-start text-neutral-500 text-xs lfont-normal leading-none">웹 사이트 이용약관</div>
              <div className="w-0 h-2.5 outline-[0.25px] outline-neutral-500"></div>
              <div className="justify-start text-neutral-500 text-xs font-normal leading-none">환불 규정</div>
            </div>

            <div className="flex-1 text-right justify-start text-neutral-500 text-xs font-normal leading-none">대한민국</div>
          </div>

          <div className="self-stretch space-y-4 justify-start items-center flex-wrap content-center mb-4 flex-col md:hidden">
            <div className="flex-1 justify-start text-neutral-500 text-xs font-normal leading-none">대한민국</div>

            <div className="flex justify-start gap-2.5">
              <div className="justify-start text-neutral-500 text-xs font-normal leading-none">개인정보 처리방침</div>
              <div className="w-0 h-2.5 outline-[0.25px] outline-neutral-500"></div>
              <div className="justify-start text-neutral-500 text-xs lfont-normal leading-none">웹 사이트 이용약관</div>
              <div className="w-0 h-2.5 outline-[0.25px] outline-neutral-500"></div>
              <div className="justify-start text-neutral-500 text-xs font-normal leading-none">환불 규정</div>
            </div>

            <div className="flex-1 justify-start text-neutral-500 text-xs font-medium leading-none">Copyright © 2025 IIH Inc. All rights reserved.</div>
          </div>

          <div className="self-stretch justify-start text-neutral-500 text-xs md:text-xs font-normal leading-none text-center">
            IIH | 대표이사: 김동현 | 주소: 서울시 강남구 영동대로 602, 6층 | 사업자등록번호: 000-00-00000
          </div>
        </div>
      </div>
    </footer>
  );
}
