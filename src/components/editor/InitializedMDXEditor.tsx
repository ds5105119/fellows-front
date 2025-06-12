"use client";

import Toolbar from "./toolbar";
import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  imagePlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import imageCompression from "browser-image-compression";
import { getPresignedPutUrl, uploadFileToPresignedUrl } from "@/hooks/fetch/presigned";

const codeBlockLanguages = {
  js: "JavaScript",
  ts: "Typescript",
  tsx: "TypeScript (React)",
  python: "Python",
  css: "CSS",
};

const compressionOptions = {
  maxSizeMB: 2.0,
  maxWidthOrHeight: 1980,
  useWebWorker: true,
};

async function compressImage(file: File): Promise<File> {
  try {
    // 이미지 압축기 정의
    const compressedFile = await imageCompression(file, compressionOptions);

    // JPG 변환을 위한 canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    const img = new Image();
    img.src = URL.createObjectURL(compressedFile);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(
                new File([blob], file.name.replace(/\..+$/, ".jpg"), {
                  type: "image/jpeg",
                })
              );
            } else {
              reject(new Error("Failed to convert image to JPG"));
            }
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}

async function imageUploadHandler(image: File) {
  const compressedImg = await compressImage(image);
  const presigned = await getPresignedPutUrl();
  await uploadFileToPresignedUrl({ file: compressedImg, presigned: presigned });

  return `${process.env.NEXT_PUBLIC_R2_URL}/${presigned.key}`;
}

export default function InitializedMDXEditor({ editorRef, ...props }: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        // ToolBar Plugin
        toolbarPlugin({
          toolbarContents: Toolbar,
        }),

        // Core Plugin
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),

        // CodeBlock Plugiin
        codeBlockPlugin({
          defaultCodeBlockLanguage: "js",
        }),
        codeMirrorPlugin({
          codeBlockLanguages: codeBlockLanguages,
        }),

        // Image Upload Plugin
        imagePlugin({ imageUploadHandler }),
      ]}
      {...props}
      ref={editorRef}
      contentEditableClassName="prose"
    />
  );
}
