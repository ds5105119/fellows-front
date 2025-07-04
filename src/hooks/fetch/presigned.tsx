"use client";

import {
  SSECPresignedUrlResponseSchema,
  SSECPresignedUrlResponseType,
  PresignedPutUrlResponseType,
  PresignedPutUrlResponseSchema,
} from "@/@types/accounts/cloud";
import { ERPNextFile } from "@/@types/service/project";
import { cn, isIOS } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const PREVIEWABLE = [
  /^image\//, // png, jpg, webp …
  /^audio\//,
  /^video\//, // mp4, mp3 …
  /^text\//, // txt, csv, html …
  /^application\/pdf$/, // pdf
];

function canPreview(mime = "", ext = ""): boolean {
  const okByMime = PREVIEWABLE.some((re) => re.test(mime));
  const okByExt = ["png", "jpg", "jpeg", "gif", "webp", "svg", "txt", "md", "pdf", "mp4", "mp3"].includes(ext.toLowerCase());
  return okByMime || okByExt;
}
export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

export async function getSSECPresignedGetUrl(algorithm: string, key: string, sse_key: string): Promise<SSECPresignedUrlResponseType> {
  const params = new URLSearchParams();

  params.append("algorithm", algorithm);
  params.append("key", key);
  params.append("sse_key", sse_key);

  const response = await fetch(`/api/cloud/object/presigned/get/sse/c?${params.toString()}`, {
    method: "get",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return SSECPresignedUrlResponseSchema.parse(data);
}

export const downloadFilefromSSECPresignedUrl = async (presigned: SSECPresignedUrlResponseType) => {
  const headers = {
    "x-amz-server-side-encryption-customer-algorithm": presigned.algorithm,
    "x-amz-server-side-encryption-customer-key": presigned.sse_key,
    "x-amz-server-side-encryption-customer-key-md5": presigned.md5,
  };

  const response = await fetch(presigned.presigned_url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch file");
  }

  const blob = await response.blob();
  const mime = response.headers.get("Content-Type") || blob.type || "";

  return { blob, mime };
};

export async function getPresignedPutUrl(suffix?: string, name?: string): Promise<PresignedPutUrlResponseType> {
  const response = await fetch(`/api/cloud/object/presigned/put?suffix=${suffix}&name=${name}`, {
    method: "get",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return PresignedPutUrlResponseSchema.parse(data);
}

export async function getSSECPresignedPutUrl(suffix?: string, name?: string): Promise<SSECPresignedUrlResponseType> {
  const response = await fetch(`/api/cloud/object/presigned/put/sse/c?suffix=${suffix}&name=${name}`, {
    method: "get",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return SSECPresignedUrlResponseSchema.parse(data);
}

export async function uploadFileToPresignedUrl({
  file,
  presigned,
  onProgress,
}: {
  file: File;
  presigned: PresignedPutUrlResponseType;
  onProgress?: (progress: UploadProgress) => void;
}): Promise<void> {
  const MAX_SIZE = 30 * 1024 * 1024; // 30MB

  if (file.size > MAX_SIZE) {
    toast.error("파일 용량은 30MB 이하만 업로드할 수 있어요.");
    return;
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presigned.presigned_url, true);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress({
          percent,
          loaded: event.loaded,
          total: event.total,
        });
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`업로드 실패 (status ${xhr.status})`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("업로드 중 오류가 발생했어요."));
    };

    xhr.send(file);
  });
}

export async function uploadFileToSSECPresignedUrl({
  file,
  presigned,
  onProgress,
}: {
  file: File;
  presigned: SSECPresignedUrlResponseType;
  onProgress?: (progress: UploadProgress) => void;
}): Promise<void> {
  const MAX_SIZE = 30 * 1024 * 1024; // 30MB

  if (file.size > MAX_SIZE) {
    toast.error("파일 용량은 30MB 이하만 업로드할 수 있어요.");
    return;
  }

  const headers = {
    "x-amz-server-side-encryption-customer-algorithm": presigned.algorithm,
    "x-amz-server-side-encryption-customer-key": presigned.sse_key,
    "x-amz-server-side-encryption-customer-key-md5": presigned.md5,
  };

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presigned.presigned_url, true);

    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress({
          percent,
          loaded: event.loaded,
          total: event.total,
        });
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`업로드 실패 (status ${xhr.status})`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("업로드 중 오류가 발생했어요."));
    };

    xhr.send(file);
  });
}

export const handleFileDownloadOrPreview = (blob: Blob, mime: string, filename: string) => {
  const ext = filename.split(".").pop() ?? "";
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;

  if (canPreview(mime, ext) && !isIOS()) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  } else {
    a.download = filename;
  }

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

export function SSECFileDownloadButton({ file, children, className }: { file: ERPNextFile; children: React.ReactNode; className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    if (!file.sse_key || !file.key || !file.algorithm) return;
    try {
      setLoading(true);
      const presigned = await getSSECPresignedGetUrl(file.algorithm, file.key, file.sse_key);
      const { blob, mime } = await downloadFilefromSSECPresignedUrl(presigned);
      handleFileDownloadOrPreview(blob, mime, file.file_name);
    } catch {
      toast("다운로드에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-sm transition-colors duration-200",
        "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

export const removeFile = async (key: string, sse_key?: string) => {
  const params = new URLSearchParams();
  params.append("key", key);
  if (sse_key) params.append("sse_key", sse_key);

  await fetch(`/api/cloud/object?${params.toString()}`, {
    method: "DELETE",
  });
};
