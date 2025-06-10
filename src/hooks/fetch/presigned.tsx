"use client";

import { PresignedUrlResponseSchema, PresignedUrlResponseType } from "@/@types/accounts/cloud";
import { ERPNextProjectFileRowType } from "@/@types/service/erpnext";
import { cn } from "@/lib/utils";
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

export async function getPresignedGetUrl(algorithm: string, key: string, sse_key: string): Promise<PresignedUrlResponseType> {
  const params = new URLSearchParams();

  params.append("algorithm", algorithm);
  params.append("key", key);
  params.append("sse_key", sse_key);

  const response = await fetch(`/api/cloud/object/presigned/get?${params.toString()}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return PresignedUrlResponseSchema.parse(data);
}

export const downloadFilefromPresignedUrl = async (presigned: PresignedUrlResponseType) => {
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

export async function getPresignedPutUrl(name: string): Promise<PresignedUrlResponseType> {
  const response = await fetch(`/api/cloud/object/presigned/put?name=${name}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return PresignedUrlResponseSchema.parse(data);
}

export async function uploadFileToPresignedUrl({
  file,
  presigned,
  onProgress,
}: {
  file: File;
  presigned: PresignedUrlResponseType;
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

  if (canPreview(mime, ext)) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

export function FileDownloadButton({ file, children, className }: { file: ERPNextProjectFileRowType; children: React.ReactNode; className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const presigned = await getPresignedGetUrl(file.algorithm, file.key, file.sse_key);
      const { blob, mime } = await downloadFilefromPresignedUrl(presigned);
      handleFileDownloadOrPreview(blob, mime, file.file_name);
    } catch {
      toast("다운로드에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <a
      href="#"
      role="button"
      onClick={handleClick}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-sm transition-colors duration-200",
        "hover:bg-muted cursor-pointer touch-manipulation select-auto",
        className
      )}
    >
      {children}
    </a>
  );
}
