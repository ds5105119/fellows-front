"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserBusinessData, UserBusinessDataNullable, UserBusinessDataSchema } from "@/@types/accounts/userdata";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

interface UserBusinessDataFormProps {
  data: UserBusinessDataNullable;
}

const groups: { title: string; fields: { name: keyof UserBusinessData; label: string }[] }[] = [
  {
    title: "창업 상태",
    fields: [
      { name: "ja1101", label: "예비창업자" },
      { name: "ja1102", label: "영업중" },
      { name: "ja1103", label: "생계곤란/폐업예정자" },
    ],
  },
  {
    title: "사업 업종 (1차)",
    fields: [
      { name: "ja1201", label: "음식점업" },
      { name: "ja1202", label: "제조업" },
      { name: "ja1299", label: "기타업종" },
    ],
  },
  {
    title: "사업 유형",
    fields: [
      { name: "ja2101", label: "중소기업" },
      { name: "ja2102", label: "사회복지시설" },
      { name: "ja2103", label: "기관/단체" },
    ],
  },
  {
    title: "사업 업종 (2차)",
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
    if (!data?.sub) {
      const response = await fetch("/api/user/user-data/business", {
        method: "POST",
        body: JSON.stringify(value),
        redirect: "follow",
        credentials: "include",
      });
      location.reload();
    } else {
      const response = await fetch("/api/user/user-data/business", {
        method: "PATCH",
        body: JSON.stringify(value),
        redirect: "follow",
        credentials: "include",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8 p-6 bg-white rounded-3xl shadow-md">
        {groups.map((group) => (
          <Card key={group.title} className="p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{group.title}</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {group.fields.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                      </FormControl>
                      <FormLabel className="text-gray-700">{label}</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </Card>
        ))}
        <div className="flex justify-end">
          <Button type="submit" className="px-6 py-2 rounded-xl text-base">
            제출
          </Button>
        </div>
      </form>
    </Form>
  );
}
