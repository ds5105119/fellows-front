import { z } from "zod";

// AuthorInlineDto
export const AuthorInlineDto = z.object({
  sub: z.string(),
  name: z.string(),
  bio: z.string().nullish(),
  picture: z.string().nullish(),
});

// CategoryInlineDto
export const CategoryInlineDto = z.object({
  name: z.string(),
});

// TagInlineDto
export const TagInlineDto = z.object({
  name: z.string(),
});

// BlogPostDto
export const UpsertBlogPostDto = z.object({
  title: z.string(),
  title_image: z.string(),
  content: z.string(),
  summary: z.string().nullable().optional(),
  is_published: z.boolean().default(false),

  category: CategoryInlineDto.nullable().optional(),
  tags: z.array(TagInlineDto).default([]),
});

// BlogPostDto
export const BlogPostDto = z.object({
  id: z.string(),
  title: z.string(),
  title_image: z.string(),
  content: z.string(),
  summary: z.string().nullable().optional(),
  is_published: z.boolean().default(false),
  published_at: z.coerce.date().nullable().optional(),

  author: AuthorInlineDto,
  category: CategoryInlineDto.nullable().optional(),
  tags: z.array(TagInlineDto).default([]),
});

// BlogPostListQueryDto
export const BlogPostListQueryDto = z.object({
  page: z.coerce.number().int().nonnegative().default(0),
  size: z.coerce.number().int().positive().max(100).default(10),

  category: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  keyword: z.string().optional().nullable(),
  order_by: z.string().default("published_at").optional(),
  descending: z.boolean().default(true),
});

// BlogPostPaginatedResponse
export const BlogPostPaginatedResponse = z.object({
  total: z.number().int(),
  items: z.array(BlogPostDto),
});

export type AuthorInlineDtoType = z.infer<typeof AuthorInlineDto>;
export type CategoryInlineDtoType = z.infer<typeof CategoryInlineDto>;
export type TagInlineDtoType = z.infer<typeof TagInlineDto>;
export type UpsertBlogPostType = z.infer<typeof UpsertBlogPostDto>;
export type BlogPostDtoType = z.infer<typeof BlogPostDto>;
export type BlogPostListQueryDtoType = z.infer<typeof BlogPostListQueryDto>;
export type BlogPostPaginatedResponseType = z.infer<typeof BlogPostPaginatedResponse>;
