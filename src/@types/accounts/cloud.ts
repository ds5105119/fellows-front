import { z } from "zod";

export const PresignedPutUrlResponseSchema = z.object({
  presigned_url: z.string(),
  key: z.string(),
  algorithm: z.string(),
  sse_key: z.string(),
  md5: z.string(),
});

export const FileRecordSchema = z.object({
  algorithm: z.string().optional().nullable().default("AES256"),
  key: z.string(),
  sse_key: z.string().optional().nullable(),
});

export type PresignedPutUrlResponseType = z.infer<typeof PresignedPutUrlResponseSchema>;
export type FileRecordType = z.infer<typeof FileRecordSchema>;
