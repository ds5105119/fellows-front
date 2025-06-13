import { BlogPostDto } from "@/@types/service/blog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MarkdownPreview from "@/components/ui/markdownpreview";
import BlogShare from "@/components/blog/blog-share";
import dayjs from "dayjs";
import Image from "next/image";
import BlogToolbar from "@/components/blog/blog-toolbar";

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
  const session = await auth();

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
      <div className="mx-auto px-10 lg:px-0 w-full md:w-lg lg:w-2xl flex flex-col space-y-6 py-20">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">{post.category?.name ?? "카테고리 없음"}</p>
          <p className="text-sm font-semibold text-muted-foreground">{post.published_at ? dayjs(post.published_at).format("YYYY-MM-DD") : "발행 전"}</p>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold">{post.summary}</h1>
        <h2 className="text-xl md:text-2xl font-semibold">{post.title}</h2>

        <div className="flex flex-wrap gap-2 items-center">
          {post.tags.map((tag, idx) => (
            <div className="flex text-sm font-semibold text-blue-500" key={idx}>
              <p className="mr-[1px]">#</p>
              {tag.name}
            </div>
          ))}
        </div>

        <div className="flex space-x-2 items-center">
          <p>by</p>
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={post.author.picture ?? ""} alt={post.author.name} />
            <AvatarFallback className="text-sm font-bold">{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <p>{post.author.name}</p>
        </div>

        <BlogShare title="Fellows 블로그" text={post.title} />
      </div>

      <div className="mx-auto px-6 md:px-0 w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
        <AspectRatio ratio={16 / 10} className="rounded-xl md:rounded-2xl overflow-hidden">
          <Image src={post.title_image} alt={post.title} fill className="object-cover" />
        </AspectRatio>
      </div>

      <div className="mx-auto px-10 lg:px-0 w-full max-w-full md:w-lg lg:w-2xl py-20">
        <div
          className="w-full overflow-hidden prose prose-base md:prose-lg
  prose-headings:font-medium
  prose-a:text-primary
  prose-img:rounded-md
  prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
  [&_*]:max-w-full [&_*]:break-words [&_*]:overflow-hidden
"
        >
          <MarkdownPreview loading={false}>{post.content}</MarkdownPreview>
        </div>{" "}
      </div>
      <BlogToolbar session={session} post={post} />
    </main>
  );
}
