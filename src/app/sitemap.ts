import { BlogPostDto } from "@/@types/service/blog";
import type { MetadataRoute } from "next";

const defaultSiteMap: MetadataRoute.Sitemap = [
  {
    url: "https://fellows.my",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "https://www.fellows.my",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "https://fellows.my/blog",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_URL}/path`);
  const posts = await res.json();

  const sitemapFromPosts = await Promise.all(
    posts.map(async (id: string) => {
      const response = await fetch(`https://api.fellows.my/api/blog/${id}`, {
        next: { revalidate: 60 },
      });

      if (!response.ok) return null;

      const post_json = await response.json();
      const post = BlogPostDto.parse(post_json);

      return {
        url: `https://fellows.my/blog/${id}`,
        lastModified: post.published_at ?? undefined,
        changeFrequency: "daily",
        priority: 0.7,
        images: [post.title_image],
      };
    })
  );

  return [...defaultSiteMap, ...sitemapFromPosts.filter(Boolean)];
}
