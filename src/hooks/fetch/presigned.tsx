import { PresignedPutUrlResponseSchema, PresignedPutUrlResponseType } from "@/@types/accounts/cloud";

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

export async function getPresignedPutUrl(suffix?: string): Promise<PresignedPutUrlResponseType> {
  const response = await fetch(suffix ? `/api/cloud/presigned/put?${suffix}` : "/api/cloud/presigned/put", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  console.log(data);
  PresignedPutUrlResponseSchema.parse(data);
  return data;
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
    throw new Error("파일 용량은 30MB 이하만 업로드할 수 있어요.");
  }

  const headers = {
    "x-amz-server-side-encryption-customer-algorithm": presigned.algorithm,
    "x-amz-server-side-encryption-customer-key": presigned.sse_key,
    "x-amz-server-side-encryption-customer-key-md5": presigned.md5,
  };

  console.log(presigned);

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
