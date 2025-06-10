"use client";

import type React from "react";

import { PresignedUrlResponseSchema, type PresignedUrlResponseType } from "@/@types/accounts/cloud";
import type { ERPNextProjectFileRowType } from "@/@types/service/erpnext";
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

// iOS 감지 함수
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
};

// iOS에서 호환 가능한 MIME 타입 확인
const isIOSCompatibleMimeType = (mime: string): boolean => {
  const compatibleTypes = ["image/", "text/", "application/pdf", "video/", "audio/"];
  return compatibleTypes.some((type) => mime.startsWith(type));
};

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

  if (isIOS()) {
    // iOS 전용 처리
    if (canPreview(mime, ext) || isIOSCompatibleMimeType(mime)) {
      // iOS에서 미리보기 가능한 파일은 새 탭에서 열기
      const newWindow = window.open();
      if (newWindow) {
        newWindow.location.href = url;
      } else {
        // 팝업이 차단된 경우 현재 탭에서 열기
        window.location.href = url;
      }
    } else {
      // iOS에서 다운로드가 어려운 파일은 전용 다운로드 페이지 제공
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>파일 다운로드</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                  padding: 20px; 
                  text-align: center;
                  background: #f5f5f5;
                  margin: 0;
                }
                .container {
                  background: white;
                  padding: 30px;
                  border-radius: 12px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                  max-width: 400px;
                  margin: 50px auto;
                }
                h2 {
                  color: #333;
                  margin-bottom: 20px;
                }
                p {
                  color: #666;
                  line-height: 1.5;
                  margin: 10px 0;
                }
                .filename {
                  font-weight: bold;
                  color: #007AFF;
                  word-break: break-all;
                }
                .download-btn {
                  background: #007AFF;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-size: 16px;
                  margin: 10px;
                  cursor: pointer;
                  min-width: 120px;
                }
                .download-btn:active {
                  background: #0056CC;
                }
                .close-btn {
                  background: #8E8E93;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-size: 16px;
                  margin: 10px;
                  cursor: pointer;
                  min-width: 120px;
                }
                .close-btn:active {
                  background: #636366;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>📁 파일 다운로드</h2>
                <p>파일명: <span class="filename">${filename}</span></p>
                <p>iOS에서는 아래 버튼을 눌러 파일을 다운로드하세요.</p>
                <div>
                  <button class="download-btn" onclick="downloadFile()">다운로드</button>
                </div>
                <div>
                  <button class="close-btn" onclick="window.close()">닫기</button>
                </div>
              </div>
              <script>
                function downloadFile() {
                  const a = document.createElement('a');
                  a.href = '${url}';
                  a.download = '${filename}';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              </script>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  } else {
    // 기존 데스크톱/안드로이드 처리
    const a = document.createElement("a");
    a.href = url;

    if (canPreview(mime, ext)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else {
      a.download = filename;
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

export function FileDownloadButton({ file, children, className }: { file: ERPNextProjectFileRowType; children: React.ReactNode; className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // iOS에서는 사용자 제스처 컨텍스트를 유지하기 위해 즉시 새 창을 열어둠
      let newWindow: Window | null = null;
      if (isIOS()) {
        newWindow = window.open("about:blank", "_blank");
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>파일 로딩 중...</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    margin: 0; 
                    background: #f5f5f5;
                  }
                  .loading {
                    text-align: center;
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                  }
                  .spinner {
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #007AFF;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                  }
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                </style>
              </head>
              <body>
                <div class="loading">
                  <div class="spinner"></div>
                  <p>파일을 준비하고 있습니다...</p>
                </div>
              </body>
            </html>
          `);
        }
      }

      const presigned = await getPresignedGetUrl(file.algorithm, file.key, file.sse_key);
      const { blob, mime } = await downloadFilefromPresignedUrl(presigned);

      if (isIOS() && newWindow && !newWindow.closed) {
        // iOS에서는 미리 열어둔 창에서 파일 처리
        const url = URL.createObjectURL(blob);
        const ext = file.file_name.split(".").pop() ?? "";

        if (canPreview(mime, ext) || isIOSCompatibleMimeType(mime)) {
          newWindow.location.href = url;
        } else {
          // 다운로드 페이지로 리다이렉트
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>파일 다운로드</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                    padding: 20px; 
                    text-align: center;
                    background: #f5f5f5;
                    margin: 0;
                  }
                  .container {
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    max-width: 400px;
                    margin: 50px auto;
                  }
                  .download-btn {
                    background: #007AFF;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    margin: 10px;
                    cursor: pointer;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>📁 파일 다운로드</h2>
                  <p>파일명: <strong>${file.file_name}</strong></p>
                  <button class="download-btn" onclick="downloadFile()">다운로드</button>
                </div>
                <script>
                  function downloadFile() {
                    const a = document.createElement('a');
                    a.href = '${url}';
                    a.download = '${file.file_name}';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }
                </script>
              </body>
            </html>
          `);
          newWindow.document.close();
        }

        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      } else {
        // 기존 방식
        handleFileDownloadOrPreview(blob, mime, file.file_name);
      }
    } catch (error) {
      console.error("Download failed:", error);
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
