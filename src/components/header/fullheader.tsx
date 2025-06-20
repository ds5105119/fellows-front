import Image from "next/image";
import Link from "next/link";

export default function FullHeader() {
  return (
    <div className="sticky top-0 z-50">
      <nav
        className="absolute z-10 h-13 w-full overflow-hidden bg-[hsla(0,0%,93%,0.42)]"
        style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      >
        <div className="h-full flex items-center justify-between px-7 md:px-1 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
          <Link href="/blog" className="flex space-x-2 group">
            <Image
              src="/fellows/logo-img.svg"
              width={20}
              height={20}
              alt="image logo"
              className="transition-transform duration-500 transform group-hover:rotate-y-180"
            />
            <p className="text-xl font-black">Blog</p>
          </Link>

          <div className="flex items-center space-x-6 md:space-x-10">
            <Link href="/" className="flex space-x-2 group">
              <p className="text-sm font-medium">홈</p>
            </Link>
            <Link href="/" className="flex space-x-2 group">
              <p className="text-sm font-medium">Work</p>
            </Link>
            <Link href="/" className="flex space-x-2 group">
              <p className="text-sm font-medium">요금</p>
            </Link>
            <Link href="/service/dashboard" className="flex space-x-2 group">
              <p className="text-sm font-medium">서비스</p>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
