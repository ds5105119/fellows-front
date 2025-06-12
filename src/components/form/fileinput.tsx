"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FcFile, FcAudioFile, FcImageFile, FcVideoFile } from "react-icons/fc";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getSSECPresignedPutUrl, uploadFileToSSECPresignedUrl, removeFile } from "@/hooks/fetch/presigned";
import { UploadProgressIndicator } from "../ui/uploadprogressindicator";
import { ERPNextProjectFileRowType, ERPNextProjectFileRowZod } from "@/@types/service/project";

interface FileInputProps {
  onChange: (val: ERPNextProjectFileRowType[]) => void;
}

export const fileIconMap: { [key: string]: React.ElementType } = {
  // 이미지
  jpg: FcImageFile,
  jpeg: FcImageFile,
  png: FcImageFile,
  gif: FcImageFile,
  svg: FcImageFile,
  webp: FcImageFile,
  // 오디오
  mp3: FcAudioFile,
  wav: FcAudioFile,
  ogg: FcAudioFile,
  // 비디오
  mp4: FcVideoFile,
  mov: FcVideoFile,
  avi: FcVideoFile,
  mkv: FcVideoFile,
  // 기본값
  default: FcFile,
};

export const getFileExtension = (filename: string): string => {
  if (!filename || typeof filename !== "string") return "";
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0 || lastDotIndex === filename.length - 1) {
    return "";
  }
  return filename.substring(lastDotIndex + 1).toLowerCase();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}Bytes`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)}MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)}GB`;
};

export default function FileInput({ onChange }: FileInputProps) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<{ record: ERPNextProjectFileRowType; name: string; size: number; progress: number }[]>([]);
  const controls = useAnimation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);

  const shake = () =>
    controls.start({
      x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
      transition: { duration: 0.4 },
    });

  const uploadFiles = async (file: File) => {
    const isDuplicate = filesRef.current.some((f) => f.name === file.name && f.size === file.size);
    if (isDuplicate) {
      shake();
      toast.info("이미 업로드된 파일입니다.");
      return;
    }

    try {
      const presigned = await getSSECPresignedPutUrl(file.name);
      const fileRecord = ERPNextProjectFileRowZod.parse({
        doctype: "Files",
        key: presigned.key,
        file_name: file.name,
        algorithm: "AES256",
        sse_key: presigned.sse_key,
        uploader: "user",
      });

      setFiles((prev) => [...prev, { record: fileRecord, name: file.name, size: file.size, progress: 0 }]);

      await uploadFileToSSECPresignedUrl({
        file,
        presigned,
        onProgress: ({ percent }) => {
          setFiles((prev) => prev.map((f) => (f.name === file.name && f.size === file.size ? { ...f, progress: percent } : f)));
        },
      });
    } catch {
      toast.warning("업로드에 실패했어요.");
      setFiles((prev) => prev.filter((f) => f.name !== file.name || f.size !== file.size));
    }
  };

  const handleRemoveFile = async (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    await removeFile(files[index].record.key, files[index].record.sse_key);
  };

  const handleChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFiles(file);
  };

  const handleDropupload = async (e: React.DragEvent<HTMLElement>) => {
    setDragOver(false);
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFiles(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    setDragOver(false);
    await handleDropupload(e);
  };

  useEffect(() => {
    filesRef.current = files;
    onChange(files.map((f) => f.record));
  }, [files, onChange]);

  return (
    <motion.div animate={controls} className="w-full rounded-2xl bg-gray-100 px-6 pt-5 pb-2 space-y-4 mt-6 ">
      <div className="flex flex-col space-y-1 justify-center px-1">
        <div className="font-semibold">추가로 전달해주고 싶은 파일이 있다면 첨부해주세요.</div>
        <div className="text-sm font-medium text-muted-foreground">올린 파일은 암호화되어 안전하게 보호됩니다.</div>
      </div>
      <label
        className={cn(
          "flex flex-col rounded-xl px-3 py-3 min-h-40 md:min-h-30 space-y-2.5",
          files.length === 0 && "justify-center items-center",
          dragOver ? "bg-blue-100 border-blue-400" : "bg-white"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
      >
        {files.length > 0 ? (
          files.map((f, idx) => {
            const extension = getFileExtension(f.name);
            const IconComponent = fileIconMap[extension] || fileIconMap.default;

            return (
              <div
                key={idx}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 w-full rounded-sm bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <IconComponent className="!size-7" />

                <div className="min-w-0 overflow-hidden">
                  <p className="truncate text-sm">{f.name}</p>
                  <p className="truncate text-xs font-normal">{formatFileSize(f.size)}</p>
                </div>

                <div className="w-9 h-9 flex items-center justify-center">
                  <UploadProgressIndicator progress={f.progress} onRemove={() => handleRemoveFile(idx)} size={36} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-1.5">
            <div className="text-4xl font-bold select-none pointer-events-none">📎</div>
            <div className="flex flex-col space-y-1 items-center justify-center select-none pointer-events-none">
              <div className="font-semibold">파일을 선택하거나 올려주세요</div>
              <div className="text-xs font-medium text-muted-foreground">30MB 이하</div>
            </div>
          </div>
        )}
      </label>
      <div className="flex justify-end">
        <Button type="button" onClick={() => fileInputRef.current?.click()}>
          업로드
        </Button>
      </div>
      <input id="fileInput" ref={fileInputRef} type="file" onChange={handleChangeUpload} style={{ display: "none" }} />
    </motion.div>
  );
}
