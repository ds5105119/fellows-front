"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserBusinessData, type UserBusinessDataNullable, UserBusinessDataSchema } from "@/@types/accounts/userdata";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createBusinessUserData, updateBusinessUserData } from "@/hooks/fetch/server/user";

interface UserBusinessDataFormProps {
  data: UserBusinessDataNullable;
}

const groups: { title: string; description?: string; fields: { name: keyof UserBusinessData; label: string }[] }[] = [
  {
    title: "창업 상태",
    description: "현재 사업 운영 상태를 선택해주세요",
    fields: [
      { name: "ja1101", label: "예비창업자" },
      { name: "ja1102", label: "영업중" },
      { name: "ja1103", label: "생계곤란/폐업예정자" },
    ],
  },
  {
    title: "사업 유형",
    description: "사업체의 유형을 선택해주세요",
    fields: [
      { name: "ja2101", label: "중소기업" },
      { name: "ja2102", label: "사회복지시설" },
      { name: "ja2103", label: "기관/단체" },
    ],
  },
  {
    title: "사업 업종 (1차)",
    description: "주요 사업 분야를 선택해주세요",
    fields: [
      { name: "ja1201", label: "음식점업" },
      { name: "ja1202", label: "제조업" },
      { name: "ja1299", label: "기타업종" },
    ],
  },
  {
    title: "사업 업종 (2차)",
    description: "세부 사업 분야를 선택해주세요",
    fields: [
      { name: "ja2201", label: "제조업" },
      { name: "ja2202", label: "농업/임업/어업" },
      { name: "ja2203", label: "정보통신업" },
      { name: "ja2299", label: "기타업종" },
    ],
  },
];

export default function UserBusinessDataForm({ data }: UserBusinessDataFormProps) {
  const form = useForm<UserBusinessData>({
    resolver: zodResolver(UserBusinessDataSchema),
    defaultValues: {
      ja1101: data?.ja1101 ?? false,
      ja1102: data?.ja1102 ?? false,
      ja1103: data?.ja1103 ?? false,
      ja1201: data?.ja1201 ?? false,
      ja1202: data?.ja1202 ?? false,
      ja1299: data?.ja1299 ?? false,
      ja2101: data?.ja2101 ?? false,
      ja2102: data?.ja2102 ?? false,
      ja2103: data?.ja2103 ?? false,
      ja2201: data?.ja2201 ?? false,
      ja2202: data?.ja2202 ?? false,
      ja2203: data?.ja2203 ?? false,
      ja2299: data?.ja2299 ?? false,
    },
  });

  const onSubmit = async (value: UserBusinessData) => {
    if (data?.sub) {
      await updateBusinessUserData(value);
    } else {
      await createBusinessUserData(value);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl w-full h-full space-y-10 bg-white rounded-3xl px-4 lg:px-8">
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.title} className="space-y-5">
              <div className="space-y-1.5">
                <h3 className="text-xl font-semibold text-gray-900">{group.title}</h3>
                {group.description && <p className="text-sm text-gray-500">{group.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.fields.map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <label
                          htmlFor={name}
                          className={`
                            block px-5 py-4 rounded-xl cursor-pointer transition-all duration-200
                            ${field.value ? "bg-blue-100 text-blue-700" : "bg-gray-50 hover:bg-gray-100 text-gray-700"}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`
                                text-base select-none
                                ${field.value ? "text-blue-700 font-medium" : "text-gray-700"}
                              `}
                            >
                              {label}
                            </span>
                            <FormControl>
                              <Checkbox
                                id={name}
                                checked={!!field.value}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                                className={`
                                  h-5 w-5 rounded-sm transition-all duration-200
                                  ${field.value ? "bg-blue-500 text-white border-blue-500" : "bg-white border-1 border-gray-300"}
                                `}
                              />
                            </FormControl>
                          </div>
                        </label>
                        <FormMessage className="ml-1 mt-1" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="w-full sticky bottom-0 z-20">
          <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
          <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
            <Button className="w-full h-[3.5rem] rounded-2xl text-lg font-semibold" type="submit">
              정보 저장하기
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
