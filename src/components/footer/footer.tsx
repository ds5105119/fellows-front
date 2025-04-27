import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 px-80 py-14 inline-flex flex-col justify-start items-start gap-7">
      <Link href="/">
        <div className="w-20 h-5 relative">
          <Image src="/fellows.svg" width={100} height={100} alt="fellows" />
        </div>
      </Link>
      <div className="self-stretch inline-flex justify-start items-start gap-9">
        <div className="w-fit inline-flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch justify-start text-black text-sm font-semibold">Fellows* 정보</div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="justify-start text-neutral-500 text-sm font-normal">채용 안내</div>
            <div className="justify-start text-neutral-500 text-sm font-normal">채용 안내</div>
          </div>
        </div>
        <div className="inline-flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch justify-start text-black text-sm font-semibold">제품</div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="justify-start text-neutral-500 text-sm font-normal">에이전시</div>
            <div className="justify-start text-neutral-500 text-sm font-normal">팀 구독</div>
            <div className="justify-start text-neutral-500 text-sm font-normal">정부지원사업 조회</div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-start items-center flex-wrap content-center">
          <div className="flex-1 justify-start text-neutral-500 text-sm font-medium leading-none">Copyright © 2025 IIH Inc. All rights reserved.</div>
          <div className="flex justify-start items-center gap-2.5">
            <div className="justify-start text-neutral-500 text-sm font-normal leading-none">개인정보 처리방침</div>
            <div className="w-2.5 h-0 origin-top-left rotate-90 outline-1 outline-offset-[-0.50px] outline-muted"></div>
            <div className="justify-start text-neutral-500 text-sm font-normal leading-none">웹 사이트 이용약관</div>
            <div className="w-2.5 h-0 origin-top-left rotate-90 outline-1 outline-offset-[-0.50px] outline-muted"></div>
            <div className="justify-start text-neutral-500 text-sm font-normal leading-none">환불 규정</div>
          </div>
          <div className="flex-1 text-right justify-start text-neutral-500 text-sm font-normal leading-none">대한민국</div>
        </div>
        <div className="self-stretch justify-start text-neutral-500 text-sm font-normal leading-none">
          IIH | 대표이사: 김동현 | 주소: 서울특별시 강남구 XX대로 000 | 전화: 000-000-0000 | 사업자등록번호: 000-00-00000 | 통신판매업신고번호:
          제0000-서울강남-00000호
        </div>
      </div>
    </footer>
  );
}
