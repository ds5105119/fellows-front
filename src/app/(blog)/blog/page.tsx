import BlogToolbar from "@/components/blog/blog-toolbar";
import Link from "next/link";
import { auth } from "@/auth";
import { FeaturedSection } from "@/components/blog/featured-section";
import { BlogSection } from "@/components/blog/blog-section";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";

export default async function Page() {
  const session = await auth();

  return (
    <div className="w-full h-fuil pt-12">
      <div className="bg-white pt-12 pb-14 md:py-20">
        <div className="px-0 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
          <FeaturedSection />
        </div>
      </div>

      <Link href="/service/dashboard" className="md:hidden group mx-auto w-full py-6 flex items-center justify-center bg-zinc-200/80 border border-zinc-200">
        <AnimatedGradientText speed={2} colorFrom="#4ade80" colorTo="#06b6d4" className="flex items-center text-base md:text-2xl font-bold tracking-tight">
          <span>Fellows</span>
          <span className="font-medium">가 궁금하다면?&nbsp;</span>
          <span>지금 무료로 체험해보세요</span>
          <ChevronRight className="ml-1 md:ml-2 size-5 md:size-6 stroke-[#06b6d4] transition-transform duration-500 ease-in-out group-hover:translate-x-1" />
        </AnimatedGradientText>
      </Link>

      <div className="bg-gray-100 py-20">
        <div className="px-6 md:px-0 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
          <BlogSection title="전체 글" />
        </div>
      </div>

      <BlogToolbar session={session} />
    </div>
  );
}
