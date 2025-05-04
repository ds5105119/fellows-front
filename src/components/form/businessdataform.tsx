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
      { name: "JA1101", label: "예비창업자" },
      { name: "JA1102", label: "영업중" },
      { name: "JA1103", label: "생계곤란/폐업예정자" },
    ],
  },
  {
    title: "사업 업종 (1차)",
    fields: [
      { name: "JA1201", label: "음식점업" },
      { name: "JA1202", label: "제조업" },
      { name: "JA1299", label: "기타업종" },
    ],
  },
  {
    title: "사업 유형",
    fields: [
      { name: "JA2101", label: "중소기업" },
      { name: "JA2102", label: "사회복지시설" },
      { name: "JA2103", label: "기관/단체" },
    ],
  },
  {
    title: "사업 업종 (2차)",
    fields: [
      { name: "JA2201", label: "제조업" },
      { name: "JA2202", label: "농업/임업/어업" },
      { name: "JA2203", label: "정보통신업" },
      { name: "JA2299", label: "기타업종" },
    ],
  },
];

export default function UserBusinessDataForm({ data }: UserBusinessDataFormProps) {
  const form = useForm<UserBusinessData>({
    resolver: zodResolver(UserBusinessDataSchema),
    defaultValues: {
      JA1101: data?.JA1101 ?? false,
      JA1102: data?.JA1102 ?? false,
      JA1103: data?.JA1103 ?? false,
      JA1201: data?.JA1201 ?? false,
      JA1202: data?.JA1202 ?? false,
      JA1299: data?.JA1299 ?? false,
      JA2101: data?.JA2101 ?? false,
      JA2102: data?.JA2102 ?? false,
      JA2103: data?.JA2103 ?? false,
      JA2201: data?.JA2201 ?? false,
      JA2202: data?.JA2202 ?? false,
      JA2203: data?.JA2203 ?? false,
      JA2299: data?.JA2299 ?? false,
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
