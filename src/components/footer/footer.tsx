import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const compony_info = `주식회사 IIH | 대표 김동현
  사업자등록번호: xxx-xx-xxxxx
  대전광역시 xxx로 xx xxx - xxxx
  제2025-서울관악-xxxx호 
  원집은 통신판매 중개자로 상품정보 및 거래에 대한 책임은 입점판매자에게 있음을 고지합니다
  Copyright ©IIH. All rights reserved.`;

  return (
    <footer className="w-full bg-muted flex flex-col px-6 py-10">
      <Image src="/onezip/logo-with-korean.svg" alt="흑백 로고" width={100} height={41.69} className="grayscale opacity-35" />

      <div className="flex justify-between mt-6">
        <div className="flex flex-col space-y-2">
          <Link href="/">
            <div className="text-sm font-bold">고객센터</div>
          </Link>
          <Link href="/">
            <div className="text-sm font-bold">문의하기</div>
          </Link>
        </div>
      </div>

      <div className="flex mt-6">
        <div className="text-[13px] font-normal text-zinc-500 whitespace-pre-line">{compony_info}</div>
      </div>
    </footer>
  );
}
