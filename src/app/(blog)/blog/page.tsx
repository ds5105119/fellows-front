import { auth } from "@/auth";
import { BlogHeader } from "@/components/blog/blog-header";
import { FeaturedSection } from "@/components/blog/featured-section";
import { BlogSection } from "@/components/blog/blog-section";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const session = await auth();

  return (
    <div className="w-full h-fuil pt-24 md:pt-24">
      <div className="px-6 md:px-0 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
        <BlogHeader />
      </div>

      <div className="bg-white pt-10 pb-20">
        <div className="px-6 md:px-0 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
          <FeaturedSection />
        </div>
      </div>

      <div className="bg-gray-100 py-20">
        <div className="px-6 md:px-0 mx-auto w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
          <BlogSection title="전체 글" />
        </div>
      </div>

      {session?.user.groups.includes("/manager") && (
        <Link
          href="/blog/write"
          className="sticky bottom-16 left-16 md:bottom-8 md:left-8 z-40 size-14 md:size-16 text-base md:text-lg font-bold transition-all flex items-center justify-center rounded-full text-blue-500 bg-blue-200 hover:bg-blue-300"
        >
          <Plus />
        </Link>
      )}
    </div>
  );
}
