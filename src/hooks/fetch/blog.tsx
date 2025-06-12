"use client";

import useSWR, { SWRResponse } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { BlogPostPaginatedResponse, BlogPostDto, BlogPostDtoType, UpsertBlogPostType } from "@/@types/service/blog";
import { toast } from "sonner";

// CRREATE

export const createPost = async (payload: UpsertBlogPostType): Promise<BlogPostDtoType | undefined> => {
  const response = await fetch("/api/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    toast.error("프로젝트 저장 중 오류가 발생했어요");
  }

  try {
    const responseData = await response.json();
    return BlogPostDto.parse(responseData);
  } catch {
    toast.error("프로젝트 저장 중 오류가 발생했어요");
  }
};

// READ

export const usePost = (post_id: string): SWRResponse<BlogPostDtoType | undefined> => {
  const fetcher = async (url: string) => {
    if (!url) return undefined;

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const parsedData = BlogPostDto.parse(responseData);

      return parsedData;
    } catch (error) {
      throw error;
    }
  };

  return useSWR(`/api/blog${post_id}`, fetcher);
};

const blogsGetKeyFactory = ({
  size,
  category,
  tag,
  keyword,
  order_by,
  descending,
}: {
  size?: number;
  category?: string;
  tag?: string;
  keyword?: string;
  order_by?: string;
  descending?: boolean;
}): SWRInfiniteKeyLoader => {
  return (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.items.length) return null;
    const params = new URLSearchParams();
    params.append("page", `${pageIndex}`);

    if (size) params.append("size", `${size}`);
    if (category) params.append("category", `${category}`);
    if (tag) params.append("tag", `${tag}`);
    if (keyword) params.append("keyword", `${keyword}`);
    if (order_by) params.append("order_by", `${order_by}`);
    if (descending) params.append("descending", `${descending}`);

    return `/api/blog?${params.toString()}`;
  };
};

const blogsFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch failed");
  const data = await res.json();
  return BlogPostPaginatedResponse.parse(data);
};

export const usePosts = (size?: number, category?: string, tag?: string, keyword?: string, order_by?: string, descending?: boolean) => {
  const getKey = blogsGetKeyFactory({ size, category, tag, keyword, order_by, descending });
  return useSWRInfinite(getKey, blogsFetcher, {
    refreshInterval: 60000,
  });
};

// PUT

export const updatePost = async (post_id: string, payload: UpsertBlogPostType) => {
  await fetch(`/api/blog${post_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

// DELETE

export const deletePost = async (post_id: string) => {
  await fetch(`/api/blog${post_id}`, {
    method: "DELETE",
  });
};
