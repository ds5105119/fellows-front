import { auth } from "@/auth";
import { BlogHeader } from "@/components/blog/blog-header";
import { FeaturedSection } from "@/components/blog/featured-section";
import { BlogSection } from "@/components/blog/blog-section";
import BlogToolbar from "@/components/blog/blog-toolbar";

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

      <BlogToolbar session={session} />
    </div>
  );
}
