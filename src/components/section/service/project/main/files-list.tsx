"use client";

import { useRef, useCallback, useState } from "react";
import { Info, Plus, Check, X, DownloadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { fileIconMap, getFileExtension } from "@/components/form/fileinput";
import { UploadProgressIndicator } from "@/components/ui/uploadprogressindicator";
import { getSSECPresignedPutUrl, removeFile, SSECFileDownloadButton, uploadFileToSSECPresignedUrl } from "@/hooks/fetch/presigned";
import { ERPNextFile, erpNextFileSchema, UserERPNextProject, ERPNextTaskForUser } from "@/@types/service/project";
import { toast } from "sonner";
import { createFile, deleteFile, useFiles } from "@/hooks/fetch/project";

interface FilesListProps {
  project: UserERPNextProject;
  task?: ERPNextTaskForUser;
}

export function FilesList({ project, task }: FilesListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = useFiles({ projectId: project.project_name, params: { size: 20 } });
  const allFiles = files.data?.flatMap((page) => page.items) || [];

  const [fileProgress, setFileProgress] = useState(() =>
    allFiles.reduce((acc, f) => {
      acc[f.file_name] = 100;
      return acc;
    }, {} as Record<string, number>)
  );

  const groupedFiles = allFiles?.reduce<
    {
      uploader: string;
      files: ERPNextFile[];
    }[]
  >((acc, f) => {
    const last = acc[acc.length - 1];
    return !last || last.uploader !== f.uploader
      ? [...acc, { uploader: f.uploader, files: [f] }]
      : [...acc.slice(0, -1), { ...last, files: [...last.files, f] }];
  }, []);

  const uploadFiles = useCallback(
    async (file: File) => {
      try {
        const isDuplicate = (allFiles || []).some((f) => f.file_name === file.name);
        if (isDuplicate) {
          toast.info("이미 업로드된 파일입니다.");
          return;
        }

        const presigned = await getSSECPresignedPutUrl(file.name);
        const fileRecord = erpNextFileSchema.parse({
          file_name: file.name,
          key: presigned.key,
          algorithm: "AES256",
          sse_key: presigned.sse_key,
          uploader: "user",
          project: project?.project_name,
          task: task?.name,
        });

        files.mutate(
          (currentPages) => {
            if (!currentPages) return [{ items: [fileRecord] }];

            const newPages = [...currentPages];
            const lastPage = newPages[newPages.length - 1];

            newPages[newPages.length - 1] = {
              ...lastPage,
              items: [...lastPage.items, fileRecord],
            };

            return newPages;
          },
          {
            rollbackOnError: true,
            populateCache: true,
            revalidate: false,
          }
        );

        await uploadFileToSSECPresignedUrl({
          file,
          presigned,
          onProgress: ({ percent }) => {
            setFileProgress((prev) => ({
              ...prev,
              [file.name]: percent,
            }));
          },
        });

        await createFile({ projectId: project.project_name, filePayload: fileRecord });

        toast.success("파일이 성공적으로 업로드되었습니다.");
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("업로드에 실패했습니다.");
      }
    },
    [files, project.project_name]
  );

  const handleChangeUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.target.files?.[0];
      if (!file) return;

      await uploadFiles(file);
    },
    [uploadFiles]
  );

  const handleRemoveFile = useCallback(
    async (key: string, sse_key?: string | null) => {
      if (!sse_key) return;
      try {
        await removeFile(key, sse_key);
        await deleteFile({ projectId: project.project_name, key });

        files.mutate(
          (currentPages) => {
            if (!currentPages) return [];

            const newPages = currentPages.map((page) => ({
              ...page,
              items: page.items.filter((f) => f.key !== key),
            }));

            return newPages;
          },
          {
            rollbackOnError: true,
            populateCache: true,
            revalidate: false,
          }
        );

        toast.success("파일이 삭제되었습니다.");
      } catch (error) {
        console.error("File removal failed:", error);
        toast.error("파일 삭제에 실패했습니다.");
      }
    },
    [files, project.project_name]
  );

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-6">
      <div className="text-sm font-bold">파일: {allFiles.length}/50</div>
      <div className="flex items-center space-x-1.5 w-full rounded-sm bg-gray-100 px-4 py-2 mb-1 text-sm">
        <Info className="!size-4" />
        <p>파일 첨부는 최대 30MB까지 가능해요.</p>
      </div>

      {groupedFiles.map((fileGroup, idx) => (
        <section key={idx} className="space-y-3">
          <p className="text-xs font-medium text-blue-600">{fileGroup.uploader === "user" ? "내가 올린 파일" : "from Fellows"}</p>

          {fileGroup.files.map((f, i) => {
            const extension = getFileExtension(f.file_name);
            const IconComponent = fileIconMap[extension] || fileIconMap.default;

            return (
              <div
                key={i}
                className={cn(
                  "grid items-center gap-2 w-full rounded-sm outline-1 outline-gray-200 pl-4 pr-3 py-1 text-sm font-medium",
                  f.uploader === "user" ? "grid-cols-[auto_1fr_auto_auto]" : "grid-cols-[auto_1fr_auto]"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <IconComponent className="!size-5" />

                <div className="min-w-0 overflow-hidden">
                  <p className="truncate text-sm">{f.file_name}</p>
                </div>

                <SSECFileDownloadButton file={f}>
                  <DownloadCloud className="!size-5 text-blue-500" />
                </SSECFileDownloadButton>

                <div
                  className={cn(
                    "flex items-center justify-center rounded-sm",
                    f.uploader === "user" ? "w-8 h-8 hover:bg-muted cursor-pointer transition-colors duration-200" : "sr-only"
                  )}
                >
                  {f.uploader === "user" && (
                    <UploadProgressIndicator progress={fileProgress[f.file_name] ?? 100} size={32} onRemove={() => handleRemoveFile(f.key, f.sse_key)} />
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      {allFiles.length === 0 && (
        <div className="flex flex-col w-full">
          <div className="flex flex-col space-y-3 items-center w-full rounded-sm bg-gradient-to-b from-[#ffeee6] via-[#ffe5da] to-[#ffeee6] px-8 py-12 mb-1 text-sm select-none">
            <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
              <fileIconMap.default className="!size-4" />
              <p className="grow">Business Identity.zip</p>
              <DownloadCloud className="!size-4 text-blue-500" />
              <Check className="!size-4 text-emerald-500 ml-1" />
            </div>
            <div className="flex items-center space-x-2 w-full rounded-sm bg-white px-3 py-2 text-xs font-medium drop-shadow-xl drop-shadow-black/5">
              <fileIconMap.default className="!size-4" />
              <p className="grow">디자인 레퍼런스.docs</p>
              <DownloadCloud className="!size-4 text-blue-500" />
              <X className="!size-4 text-red-500 ml-1" />
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-4 pb-2 text-center">
            <div className="text-base font-semibold">프로젝트 파일 관리하기</div>
            <div className="text-sm font-medium text-muted-foreground">프로젝트에 사용한 파일들을 정리해드릴께요.</div>
          </div>
        </div>
      )}

      <button
        className="flex items-center justify-center space-x-1.5 mt-1 w-full rounded-sm bg-blue-200 hover:bg-blue-300 text-blue-500 font-bold px-4 py-3 mb-1 text-sm transition-colors duration-200 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Plus className="!size-5" strokeWidth={2} />
        <p>파일 추가하기</p>
      </button>

      <input id="fileInput" ref={fileInputRef} type="file" onChange={handleChangeUpload} style={{ display: "none" }} className="sr-only" />
    </div>
  );
}
