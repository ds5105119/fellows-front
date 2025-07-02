"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Camera, Save, Loader2, X } from "lucide-react";
import { updateUser } from "@/hooks/fetch/server/user";
import { UpdateUserAttributesSchema, type UpdateUserAttributes } from "@/@types/accounts/userdata";
import { getPresignedPutUrl, removeFile, uploadFileToPresignedUrl } from "@/hooks/fetch/presigned";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { useDaumPostcodePopup } from "react-daum-postcode";

export default function UserProfile({ session }: { session: Session }) {
  const router = useRouter();
  const open = useDaumPostcodePopup();
  const [uploading, setUploading] = useState(false);
  console.log(session);

  const form = useForm<UpdateUserAttributes>({
    resolver: zodResolver(UpdateUserAttributesSchema),
    defaultValues: {
      name: [session.user.name],
      bio: [session.user.bio],
      birthdate: [session.user.birthdate],
      gender: [session.user.gender],
      link: session.user.link,
      picture: [session.user.image ?? undefined],
      street: [session.user.address.street_address],
      locality: [session.user.address.locality],
      region: [session.user.address.region],
      postal_code: [session.user.address.postal_code],
      country: [session.user.address.country],
      sub_locality: [session.user.address.sub_locality],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
    setValue,
  } = form;

  const onSubmit = async (data: UpdateUserAttributes) => {
    try {
      // Filter out empty values
      await updateUser(data);
      await fetch("/api/user/update");
      window.location.reload();

      reset();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const presigned = await getPresignedPutUrl();
        await uploadFileToPresignedUrl({ file, presigned });
        await removeFile(presigned.key);
        const result = `${process.env.NEXT_PUBLIC_R2_URL}/${presigned.key}`;

        setValue("picture", [result]);
        await updateUser({ picture: [result] });
        await fetch("/api/user/update");

        router.refresh();
      } catch (error) {
        console.error("업로드 중 오류:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const addLink = () => {
    const links = form.getValues("link");
    if (!links) {
      form.setValue("link", [""]);
    } else if (links.length < 4) {
      form.setValue("link", [...links, ""]);
    }
  };

  const removeLink = (index: number) => {
    const links = form.getValues("link");
    if (links) {
      const newLinks = links.filter((__, i) => i !== index);
      form.setValue("link", newLinks);
    }
  };

  const updateLink = (index: number, value: string) => {
    const links = form.getValues("link");
    if (links) {
      const newLinks = [...links];
      newLinks[index] = value;
      form.setValue("link", newLinks);
    }
  };

  const handleKoreanAddress = () => {
    open({
      onComplete: (data) => {
        setValue("street", [data.roadAddress]);
        setValue("postal_code", [data.zonecode]);
        setValue("region", [data.sido]);
        setValue("locality", [data.sigungu]);
        setValue("country", ["대한민국"]);
      },
    });
  };

  const genderOptions = [
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full space-y-16">
          {/* Personal Information */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">개인정보</h2>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full flex items-center gap-2 p-4 rounded-xl bg-muted"
            >
              <motion.div whileTap={{ scale: 0.98 }} className="relative select-none w-fit">
                <input id="profile" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading || isSubmitting} />

                <label htmlFor="profile" className="cursor-pointer">
                  <motion.div initial={{ opacity: 1 }} whileHover={{ opacity: 0.3 }} className="transition-opacity">
                    <Avatar className="size-12 md:size-16">
                      <AvatarImage className="object-cover" src={session.user.image || "/placeholder.svg"} alt={session.user?.name?.[0] || ""} />
                      <AvatarFallback className="text-2xl">{session.user?.name?.[0]?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 z-10 rounded-full bg-zinc-50 flex items-center justify-center"
                  >
                    <Camera className="size-5 text-gray-600" />
                  </motion.div>

                  {uploading && (
                    <motion.div className="absolute inset-0 z-30 rounded-full bg-zinc-50 flex items-center justify-center">
                      <Loader2 className="size-5 text-gray-600 animate-spin" />
                    </motion.div>
                  )}
                </label>
              </motion.div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">이름</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="이름을 입력하세요"
                        className="md:text-xl font-bold h-12 text-black w-full shadow-none border-0 focus-visible:ring-0"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">소개</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value?.[0] || ""}
                      onChange={(e) => field.onChange([e.target.value])}
                      placeholder="자신에 대해 알려주세요..."
                      maxLength={100}
                      className="min-h-[80px] resize-none"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">생년월일</FormLabel>
                    <FormControl>
                      <Input value={field.value?.[0] || ""} onChange={(e) => field.onChange([e.target.value])} type="date" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">성별</FormLabel>
                    <Select onValueChange={(value) => field.onChange([value])} value={field.value?.[0] || ""} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="성별을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.section>

          {/* Links */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">링크</h2>
              {(!session.user.link || session.user.link.length < 4) && (
                <Button onClick={addLink} variant="outline" type="button" disabled={isSubmitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  링크 추가
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value?.map((link, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input value={link} onChange={(e) => updateLink(index, e.target.value)} placeholder="https://example.com" disabled={isSubmitting} />
                          </div>
                          <Button
                            onClick={() => removeLink(index)}
                            variant="ghost"
                            size="sm"
                            type="button"
                            disabled={isSubmitting}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {(!field.value || field.value.length === 0) && <p className="text-gray-400 text-sm py-8 text-center">아직 링크가 없어요</p>}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.section>

          {/* Address Information */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">주소</h2>

            <Button onClick={handleKoreanAddress}>주소 검색</Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">도로명 주소</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="도로명 주소"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sub_locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">상세 주소</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="상세 주소"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">시/구/군</FormLabel>
                    <FormControl>
                      <Input value={field.value?.[0] || ""} onChange={(e) => field.onChange([e.target.value])} placeholder="도시" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">도/광역시</FormLabel>
                    <FormControl>
                      <Input value={field.value?.[0] || ""} onChange={(e) => field.onChange([e.target.value])} placeholder="주/지역" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">우편번호</FormLabel>
                    <FormControl>
                      <Input value={field.value?.[0] || ""} onChange={(e) => field.onChange([e.target.value])} placeholder="우편번호" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">국가</FormLabel>
                    <FormControl>
                      <Input value={field.value?.[0] || ""} onChange={(e) => field.onChange([e.target.value])} placeholder="국가" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.section>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end pt-8 border-t border-gray-200"
          >
            <Button type="submit" disabled={isSubmitting || !isDirty} className="px-8 py-3">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  프로필 저장
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  );
}
