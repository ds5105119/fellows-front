import { BlogPostDto } from "@/@types/service/blog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Metadata, ResolvingMetadata } from "next";
import MarkdownPreview from "@/components/ui/markdownpreview";
import BlogShare from "@/components/blog/blog-share";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const post_id = (await params).id;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/${post_id}`, {
    next: { revalidate: 60 },
  });

  const post_json = await response.json();
  const post = BlogPostDto.parse(post_json);
  const previousImages = (await parent).openGraph?.images || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    alternativeHeadline: post.summary,
    image: [post.title_image, ...previousImages],
    author: {
      "@type": "Person",
      name: post.author.name,
      image: post.author.picture || undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "Fellows 블로그",
      logo: {
        "@type": "ImageObject",
        url: "https://fellows.my/logo-favicon.svg",
      },
    },
    datePublished: post.published_at,
    dateModified: post.published_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://fellows.my/blog/${post_id}`,
    },
    description: post.summary,
  };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `https://fellows.my/blog/${post_id}`,
      images: [post.title_image, ...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.title_image, ...previousImages],
    },
    other: {
      "script:type": "application/ld+json",
      "script:dangerouslySetInnerHTML": JSON.stringify(jsonLd),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const post_id = (await params).id;
  const session = await auth();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/${post_id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return notFound();
  }

  const post_json = await response.json();
  const post = BlogPostDto.parse(post_json);

  return (
    <main className="relative w-full pt-13">
      <div className="mx-auto px-8 lg:px-0 w-full md:w-lg lg:w-2xl flex flex-col space-y-6 py-20">
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

        <div className="flex space-x-2 items-center pb-4">
          <p>by</p>
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={post.author.picture ?? ""} alt={post.author.name} />
            <AvatarFallback className="text-sm font-bold">{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <p>{post.author.name}</p>
        </div>

        <BlogShare title="Fellows 블로그" text={post.title} />
      </div>

      <div className="mx-auto px-5 md:px-0 w-full md:max-w-[42.25rem] min-[70rem]:max-w-[62.25rem]">
        <AspectRatio ratio={16 / 9} className="rounded-xl md:rounded-2xl overflow-hidden">
          <Image src={post.title_image} alt={post.title} fill className="object-cover" />
        </AspectRatio>
      </div>

      <div className="prose mx-auto px-8 lg:px-0 w-full max-w-full md:w-lg lg:w-2xl py-20">
        <MarkdownPreview loading={false} className="prose-h1:text-3xl prose-h1:font-extrabold [&_p]:my-1">
          {post.content.replace(/\\n/g, "\n")}
        </MarkdownPreview>
      </div>

      <div className="mx-auto px-8 lg:px-0 w-full md:w-lg lg:w-2xl flex flex-col space-y-20">
        <div className="space-y-4">
          <p className="text-base md:text-lg font-bold text-gray-900">글 공유하기</p>
          <BlogShare title="Fellows 블로그" text={post.title} />
        </div>
      </div>

      <div className={cn("bg-gradient-to-b from-[#ffffff] to-[#e5f1ff]")}>
        <div className="mx-auto px-8 lg:px-0 w-full md:w-lg lg:w-2xl flex flex-col space-y-10 py-28 justify-center items-center">
          <div className="text-center text-2xl md:text-4xl leading-normal font-extrabold text-gray-800">
            웹, 앱 외주는
            <span className="font-black underline underline-offset-[3px] md:underline-offset-4 decoration-2 md:decoration-[3px] decoration-wavy decoration-blue-500">
              Fellows
            </span>
            인 이유
            <br />
            직접 사용해보고 확인하세요
          </div>
          <div className="flex space-x-4">
            <Link
              className="flex items-center px-8 h-12 md:h-16 md:text-lg font-medium text-white rounded-xl bg-black hover:bg-zinc-800 transition-colors duration-300"
              href="/service/dashboard"
            >
              시작하기
            </Link>
            <Link
              className="flex items-center px-8 h-12 md:h-16 md:text-lg font-medium text-black rounded-xl bg-white hover:bg-zinc-200 transition-colors duration-300 border border-gray-200"
              href="/price"
            >
              가격 및 플랜
            </Link>
          </div>
        </div>
      </div>

      <BlogToolbar session={session} post={post} />
    </main>
  );
}
