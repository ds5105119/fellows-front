"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { type HelpCreate, HelpCreateSchema } from "@/@types/service/help";
import { ArrowLeft, Save, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { imageUploadHandler } from "@/lib/imageUploadHandler";
import { Session } from "next-auth";

const categories = [
  { value: "일반", label: "일반" },
  { value: "프로젝트", label: "프로젝트" },
  { value: "견적서", label: "견적서" },
  { value: "테스크", label: "테스크" },
  { value: "보고서", label: "보고서" },
  { value: "이슈", label: "이슈" },
  { value: "구독", label: "구독" },
  { value: "기타", label: "기타" },
];

export default function HelpWriteForm({ session }: { session: Session }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const form = useForm<HelpCreate>({
    resolver: zodResolver(HelpCreateSchema),
    defaultValues: {
      title: "",
      title_image: "",
      content: "",
      summary: "",
      category: "",
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다");
      return;
    }

    setIsUploadingImage(true);
    try {
      const fileExtension = file.name.split(".").pop() || "jpg";
      const fileName = `help-${Date.now()}`;

      const imageUrl = await imageUploadHandler(file, fileExtension, fileName);

      // Update form field with uploaded image URL
      form.setValue("title_image", imageUrl);
      toast.success("이미지가 성공적으로 업로드되었습니다");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("이미지 업로드 중 오류가 발생했습니다");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: HelpCreate) => {
    setIsSubmitting(true);
    try {
      const helpUrl = process.env.NEXT_PUBLIC_HELP_URL;
      if (!helpUrl) {
        toast.error("API URL이 설정되지 않았습니다");
        return;
      }

      const response = await fetch(helpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }) },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log(await response.json(), response.status);
        throw new Error("도움말 저장에 실패했습니다");
      }

      toast.success("도움말이 성공적으로 저장되었습니다");
      router.push("/help");
    } catch (error) {
      toast.error("도움말 저장 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Link href="/help" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          도움말 목록으로 돌아가기
        </Link>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => setIsPreview(!isPreview)} className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {isPreview ? "편집 모드" : "미리보기"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>도움말 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="도움말 제목을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>대표 이미지</FormLabel>
                      <div>
                        <div className="flex gap-2">
                          <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} className="hidden" id="image-upload" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("image-upload")?.click()}
                            disabled={isUploadingImage}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            {isUploadingImage ? "업로드 중..." : "이미지 업로드"}
                          </Button>
                        </div>
                        <FormControl>
                          <Input className="sr-only hidden" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>요약</FormLabel>
                      <FormControl>
                        <Textarea placeholder="도움말의 간단한 요약을 입력하세요" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arcade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>내용</FormLabel>
                      <FormControl>
                        <Input placeholder="아케이드 URL을 입력하세요" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>내용</FormLabel>
                      <FormControl>
                        <Textarea placeholder="도움말의 상세 내용을 입력하세요" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "저장 중..." : "도움말 저장"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {watchedValues.title && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{watchedValues.title}</h2>
                  {watchedValues.category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{watchedValues.category}</span>
                  )}
                </div>
              )}

              {watchedValues.title_image && (
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={watchedValues.title_image || "/placeholder.svg"}
                    alt="미리보기 이미지"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {watchedValues.summary && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">요약</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{watchedValues.summary}</p>
                </div>
              )}

              {watchedValues.content && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">내용</h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">{watchedValues.content}</pre>
                  </div>
                </div>
              )}

              {!watchedValues.title && !watchedValues.content && (
                <div className="text-center py-12 text-gray-500">
                  <p>내용을 입력하면 여기에 미리보기가 표시됩니다</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
