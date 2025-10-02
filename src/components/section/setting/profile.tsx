"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Camera, Loader2, X } from "lucide-react";
import { updateUser, deletePhone } from "@/hooks/fetch/server/user";
import { UpdateUserAttributesSchema, type UpdateUserAttributes } from "@/@types/accounts/userdata";
import { getPresignedPutUrl, removeFile, uploadFileToPresignedUrl } from "@/hooks/fetch/presigned";
import DaumPostcodeEmbed from "react-daum-postcode";
import useGeolocation from "@/lib/geolocation";
import Link from "next/link";

export default function UserProfile({ session }: { session: Session }) {
  const router = useRouter();
  const geoLocation = useGeolocation();
  const [uploading, setUploading] = useState(false);
  const [addressSearching, setAddressSearching] = useState(false);

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
        const presigned = await getPresignedPutUrl("profile", "image");
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

  const genderOptions = [
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
  ];

  const handleDeletePhone = async () => {
    const ok = window.confirm("등록된 전화번호를 삭제하시겠습니까?");

    if (ok) {
      deletePhone();
      await fetch("/api/user/update");
    }
  };

  useEffect(() => {
    if (
      geoLocation.location.loaded &&
      geoLocation.location.response &&
      geoLocation.location.response.documents &&
      geoLocation.location.response.documents.length > 0
    ) {
      setAddressSearching(false);
      setValue("sub_locality", [geoLocation.location.response.documents[0].road_address.building_name], { shouldDirty: true });
      setValue(
        "street",
        [geoLocation.location.response.documents[0].road_address.road_name + " " + geoLocation.location.response.documents[0].road_address.main_building_no],
        { shouldDirty: true }
      );
      setValue("postal_code", [geoLocation.location.response.documents[0].road_address.zone_no], { shouldDirty: true });
      setValue("region", [geoLocation.location.response.documents[0].road_address.region_1depth_name], { shouldDirty: true });
      setValue("locality", [geoLocation.location.response.documents[0].road_address.region_2depth_name], { shouldDirty: true });
      setValue("country", ["대한민국"], { shouldDirty: true });
    }
  }, [geoLocation.location]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="w-full space-y-16">
          {/* Personal Information */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="w-full space-y-3">
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full flex items-center gap-4 p-3 md:p-4 rounded-xl bg-muted hover:bg-zinc-200 transition-colors duration-200"
              >
                <motion.div whileTap={{ scale: 0.98 }} className="relative select-none w-fit">
                  <input id="profile" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading || isSubmitting} />

                  <label htmlFor="profile" className="cursor-pointer">
                    <motion.div initial={{ opacity: 1 }} whileHover={{ opacity: 0.3 }} className="transition-opacity">
                      <Avatar className="size-14 md:size-16">
                        <AvatarImage className="object-cover" src={session.user.image || "/placeholder.svg"} alt={session.user?.name?.[0] || ""} />
                        <AvatarFallback className="text-2xl">{session.user?.name?.[0]?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 z-10 rounded-full bg-zinc-100 flex items-center justify-center"
                    >
                      <Camera className="size-5 text-gray-600" />
                    </motion.div>

                    {uploading && (
                      <motion.div className="absolute inset-0 z-30 rounded-full bg-zinc-100 flex items-center justify-center">
                        <Loader2 className="size-5 text-gray-600 animate-spin" />
                      </motion.div>
                    )}
                  </label>
                </motion.div>

                <div className="w-full flex flex-col space-y-0.5">
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
                            className="!text-xl font-bold text-black w-full shadow-none border-0 focus-visible:ring-0 p-0 h-fit rounded-none"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-xs md:text-sm text-muted-foreground font-semibold">@{session.user.username}</div>
                </div>
              </motion.div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">개인정보</h2>
            <div className="w-full flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-600">
                전화번호 <span className="text-xs font-bold text-black">(필수)</span>
              </div>
              <div className="flex space-x-2 w-full">
                <div className="shadow-none border-none w-full focus-visible:ring-0 bg-muted  hover:bg-zinc-200 transition-colors duration-200 h-9 flex items-center md:text-sm rounded-md px-3 py-1 text-base">
                  {session.user.phone_number}
                </div>
                <Button className="h-9 shadow-none" asChild>
                  <Link href="/service/settings/profile/phone">변경</Link>
                </Button>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-600">
                ID <span className="text-xs font-bold text-black">(필수)</span>
              </div>
              <div className="flex space-x-2 w-full">
                <div className="shadow-none border-none w-full focus-visible:ring-0 bg-muted  hover:bg-zinc-200 transition-colors duration-200 h-9 flex items-center md:text-sm rounded-md px-3 py-1 text-base">
                  {session.user.username}
                </div>
                <Button className="h-9 shadow-none" asChild>
                  <Link href="/service/settings/profile/email">변경</Link>
                </Button>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-600">
                이메일 <span className="text-xs font-bold text-black">(필수)</span>
              </div>
              <div className="flex space-x-2 w-full">
                <div className="shadow-none border-none w-full focus-visible:ring-0 bg-muted  hover:bg-zinc-200 transition-colors duration-200 h-9 flex items-center md:text-sm rounded-md px-3 py-1 text-base">
                  {session.user.email}
                </div>
                <Button className="h-9 shadow-none" asChild>
                  <Link href="/service/settings/profile/email">변경</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600 gap-1">
                      생년월일 <span className="text-xs font-bold text-black">(필수)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        type="date"
                        disabled={isSubmitting}
                        className="shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
                      />
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
                    <FormLabel className="text-sm font-medium text-gray-600 gap-1">
                      성별 <span className="text-xs font-bold text-black">(필수)</span>
                    </FormLabel>
                    <Select onValueChange={(value) => field.onChange([value])} value={field.value?.[0] || ""} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger className="w-full shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200">
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

          {/* Address Information */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-8">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                주소 <span className="text-xs font-bold text-black">(필수)</span>
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="px-2 py-1 rounded-md border border-zinc-200 bg-zinc-50 flex items-center text-xs font-bold"
                  onClick={() => geoLocation.get()}
                  disabled={isSubmitting}
                >
                  현재 위치
                </button>
                <button
                  type="button"
                  className="px-2 py-1 rounded-md border border-zinc-200 bg-zinc-50 flex items-center text-xs font-bold"
                  onClick={() => setAddressSearching(!addressSearching)}
                  disabled={isSubmitting}
                >
                  주소 검색
                </button>
              </div>
            </div>

            <div className="relative">
              {addressSearching && (
                <DaumPostcodeEmbed
                  animation={true}
                  onComplete={(data) => {
                    setAddressSearching(false);
                    setValue("street", [data.roadAddress]);
                    setValue("postal_code", [data.zonecode]);
                    setValue("region", [data.sido]);
                    setValue("locality", [data.sigungu]);
                    setValue("country", ["대한민국"]);
                  }}
                  className="absolute top-0 left-0 h-full w-full bg-white border border-gray-300 rounded-md overflow-hidden"
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="도로명 주소"
                        disabled={isSubmitting}
                        className="shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
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
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="상세 주소"
                        disabled={isSubmitting}
                        className="shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
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
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="도시"
                        disabled={isSubmitting}
                        className="shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
                      />
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
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="주/지역"
                        disabled={isSubmitting}
                        className="shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem className="pt-4">
                    <FormLabel className="text-sm font-medium text-gray-600">우편번호</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="우편번호"
                        disabled={isSubmitting}
                        className="shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="pt-4">
                    <FormLabel className="text-sm font-medium text-gray-600">국가</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="국가"
                        disabled={isSubmitting}
                        className="shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.section>

          {/* Links */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-8">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">기타 정보</h2>
            </div>

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
                      className="min-h-[80px] resize-none shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                className="px-2 py-1 rounded-md border border-zinc-200 bg-zinc-50 flex items-center text-xs font-bold"
                onClick={addLink}
                disabled={isSubmitting}
              >
                링크 추가
              </button>
            </div>

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value?.map((link, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              value={link}
                              onChange={(e) => updateLink(index, e.target.value)}
                              placeholder="https://example.com"
                              disabled={isSubmitting}
                              className="shadow-none border-none focus-visible:ring-0 bg-muted hover:bg-zinc-200 transition-colors duration-200"
                            />
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

          <div className="w-full sticky bottom-0 z-20">
            <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
            <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
              <Button className={cn("w-full h-[3.5rem] rounded-2xl text-lg font-semibold")} disabled={isSubmitting || !isDirty} type="submit">
                {isSubmitting ? <Loader2 className="!size-5 mr-2 animate-spin" /> : "프로필 저장"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
