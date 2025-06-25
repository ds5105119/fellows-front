import { BlogPostDto } from "@/@types/service/blog";
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/path`);
  const posts = await res.json();

  return posts.map((id: string) => ({
    id: id,
  }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw Error();
  }

  const post_json = await response.json();
  const post = BlogPostDto.parse(post_json);

  return [
    {
      url: `https://fellows,my/blog/${id}`,
      lastModified: post.published_at ?? undefined,
      changeFrequency: "daily",
      priority: 0.5,
      images: [post.title_image],
    },
  ];
}
