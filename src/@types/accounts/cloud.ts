import { z } from "zod";

export const PresignedUrlResponseSchema = z.object({
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

export type PresignedUrlResponseType = z.infer<typeof PresignedUrlResponseSchema>;
export type FileRecordType = z.infer<typeof FileRecordSchema>;
