import { z } from "zod";

export const SSECPresignedUrlResponseSchema = z.object({
  presigned_url: z.string(),
  key: z.string(),
  algorithm: z.string(),
  sse_key: z.string(),
  md5: z.string(),
});

export const FileRecordSchema = z.object({
  key: z.string(),
  name: z.string(),
  algorithm: z.string().optional().nullable().default("AES256"),
  sse_key: z.string(),
});

export const PresignedPutUrlRequestSchema = z.object({
  ext: z.string(),
});

export const PresignedPutUrlResponseSchema = z.object({
  presigned_url: z.string(),
  key: z.string(),
});

export type SSECPresignedUrlResponseType = z.infer<typeof SSECPresignedUrlResponseSchema>;
export type FileRecordType = z.infer<typeof FileRecordSchema>;
export type PresignedPutUrlResponseType = z.infer<typeof PresignedPutUrlResponseSchema>;
