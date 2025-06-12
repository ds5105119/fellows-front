import { BlogPostDto } from "@/@types/service/blog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import MarkdownPreview from "@/components/ui/markdownpreview";
import BlogShare from "@/components/blog/blog-share";
import dayjs from "dayjs";
import Image from "next/image";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/path`);
  const posts = await res.json();

  return posts.map((id: string) => ({
    id: id,
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const post_id = (await params).id;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/${post_id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return <div>Post not found</div>;
  }

  const post_json = await response.json();
  const post = BlogPostDto.parse(post_json);

  return (
    <main className="relative w-full pt-13">
      <div className="mx-auto px-6 lg:px-0 w-full md:w-lg lg:w-2xl flex flex-col space-y-6 py-20">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">{post.category?.name ?? "카테고리 없음"}</p>
          <p className="text-sm font-semibold text-muted-foreground">{dayjs(post.published_at).format("YYYY-MM-DD")}</p>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold">{post.summary}</h1>
        <h2 className="text-xl md:text-2xl font-semibold">{post.title}</h2>

        <BlogShare title="Fellows 블로그" text={post.title} />
      </div>

      <div className="mx-auto w-full md:w-xl lg:w-4xl min-[70rem]:w-[62.25rem]">
        <AspectRatio ratio={16 / 10} className="md:rounded-2xl overflow-hidden">
          <Image src={post.title_image} alt={post.title} fill className="object-cover" />
        </AspectRatio>
      </div>

      <div className="mx-auto px-6 lg:px-0 w-full md:w-lg lg:w-2xl py-20">
        <div className="w-full prose prose-base md:prose-lg prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary prose-img:rounded-md prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl">
          <MarkdownPreview loading={false}>{post.content}</MarkdownPreview>
        </div>
      </div>
    </main>
  );
}
