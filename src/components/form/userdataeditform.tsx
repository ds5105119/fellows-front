"use client";

import { cn } from "@/lib/utils";
import { UserData } from "@/@types/accounts/userdata";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, RotateCcw } from "lucide-react";
import { PartialUserData, PartialUserDataSchema } from "@/@types/accounts/userdata";
import ToggleButton from "@/components/button/ToggleButton";
interface UserDataEditFormProps {
  data: UserData;
}

const household_size = [
  { label: "1명", value: 1 },
  { label: "2명", value: 2 },
  { label: "3명", value: 3 },
  { label: "4명", value: 4 },
  { label: "5명", value: 5 },
  { label: "6명", value: 6 },
  { label: "7명", value: 7 },
  { label: "8명 이상", value: 8 },
] as const;

const academic_status = [
  { label: "초등학생", value: 1 },
  { label: "중학생", value: 2 },
  { label: "고등학생", value: 3 },
  { label: "대학(원)생", value: 4 },
  { label: "해당없음", value: 0 },
] as const;

const life_status = [
  { label: "예비부모/난임", name: "prospective_parents_or_infertility" },
  { label: "임산부", name: "pregnant" },
  { label: "출산·입양", name: "childbirth_or_adoption" },
] as const;

const working_status = [
  { label: "근로자/직장인", name: "employed" },
  { label: "구직자/실업자", name: "unemployed" },
] as const;

const family_status = [
  { label: "다문화가족", name: "multicultural" },
  { label: "북한이탈주민", name: "north_korean" },
  { label: "한부모·조손가정", name: "single_parent_or_grandparent" },
  { label: "무주택세대", name: "homeless" },
  { label: "신규전입", name: "new_resident" },
  { label: "다자녀가구", name: "multi_child_family" },
  { label: "확대가족", name: "extend_family" },
] as const;

const other_status = [
  { label: "장애인", name: "disable" },
  { label: "국가보훈대상자", name: "veteran" },
  { label: "질병·질환자", name: "disease" },
] as const;

export default function UserDataEditForm({ data }: UserDataEditFormProps) {
  const form = useForm<PartialUserData>({
    resolver: zodResolver(PartialUserDataSchema),
    defaultValues: {
      ...data,
    },
  });

  const onSubmit = async (values: PartialUserData) => {
    if (!data.sub) {
      const response = await fetch("/api/user/user-data", {
        method: "POST",
        body: JSON.stringify(values),
        redirect: "follow",
        credentials: "include",
      });
      location.reload();
    } else {
      const response = await fetch("/api/user/user-data", {
        method: "PATCH",
        body: JSON.stringify(values),
        redirect: "follow",
        credentials: "include",
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="overcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>가구원 수입</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="가구원 총 수입을 입력해주세요..." defaultValue={field.value} />
                </FormControl>
                <FormMessage />
                <FormDescription>가구의 총 수입은 ""에서 확인할 수 있습니다.</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="household_size"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>가구원 수</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox" className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}>
                        {field.value && field.value !== 0 ? household_size.find((value) => value.value === field.value)?.label : "가구원 수를 선택하세요"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {household_size.map((value) => (
                            <CommandItem
                              value={value.label}
                              key={value.label}
                              onSelect={() => {
                                form.setValue("household_size", value.value);
                              }}
                            >
                              {value.label}
                              <Check className={cn("ml-auto", value.value === field.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academic_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>학력</FormLabel>
                <FormControl>
                  <fieldset>
                    <div className="flex flex-wrap gap-2">
                      {academic_status.map((value) => (
                        <ToggleButton
                          type="radio"
                          name={field.name}
                          text={value.label}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          id={value.label}
                          value={value.value}
                          key={value.label}
                          defaultChecked={field.value === value.value}
                        />
                      ))}
                    </div>
                  </fieldset>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <FormLabel>출산 육아 상태</FormLabel>
            <div className="flex flex-wrap gap-2">
              {life_status.map((value) => (
                <FormField
                  control={form.control}
                  key={value.name}
                  name={value.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ToggleButton text={value.label} defaultChecked={field.value} onChange={field.onChange} id={field.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <FormLabel>취직 정보</FormLabel>
            <div className="flex flex-wrap gap-2">
              {working_status.map((value) => (
                <FormField
                  control={form.control}
                  key={value.name}
                  name={value.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ToggleButton text={value.label} defaultChecked={field.value} onChange={field.onChange} id={field.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <FormLabel>가족 정보</FormLabel>
            <div className="flex flex-wrap gap-2">
              {family_status.map((value) => (
                <FormField
                  control={form.control}
                  key={value.name}
                  name={value.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ToggleButton text={value.label} defaultChecked={field.value} onChange={field.onChange} id={field.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <FormLabel>기타 정보</FormLabel>
            <div className="flex flex-wrap gap-2">
              {other_status.map((value) => (
                <FormField
                  control={form.control}
                  key={value.name}
                  name={value.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ToggleButton text={value.label} defaultChecked={field.value} onChange={field.onChange} id={field.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex w-full space-x-4">
            <Button type="reset" size="lg" variant="ghost">
              <RotateCcw />
              초기화
            </Button>
            <Button type="submit" size="lg" className="flex-1" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {form.formState.isSubmitting && "저장중"}
              {!form.formState.isSubmitting && "저장하기"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
