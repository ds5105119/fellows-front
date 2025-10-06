"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCustomer, updateCustomer } from "@/hooks/fetch/project";
import { UpdateERPNextCustomer, UpdateERPNextCustomerSchema } from "@/@types/service/project";

const customerTypeLabels: Record<"Company" | "Individual", string> = {
  Company: "사업자",
  Individual: "개인",
};

export default function CompanySettings() {
  const customerSwr = useCustomer();

  const form = useForm<UpdateERPNextCustomer>({
    resolver: zodResolver(UpdateERPNextCustomerSchema),
    defaultValues: {
      customer_type: "Individual",
      tax_id: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = form;

  const customerType = useWatch({ control: form.control, name: "customer_type" });

  useEffect(() => {
    const rawType = customerSwr.data?.customer_type?.trim().toLowerCase();
    if (!rawType) return;

    const normalizedType = rawType === "company" ? "Company" : "Individual";
    const normalizedTaxId = normalizedType === "Company" ? customerSwr.data?.tax_id?.trim() ?? "" : "";

    const currentValues = form.getValues();
    if (currentValues.customer_type !== normalizedType || currentValues.tax_id !== normalizedTaxId) {
      reset(
        {
          customer_type: normalizedType,
          tax_id: normalizedTaxId,
        },
        {
          keepDirty: false,
          keepErrors: true,
        }
      );
    }
  }, [customerSwr.data?.customer_type, customerSwr.data?.tax_id, form, reset]);

  const onSubmit = async (values: UpdateERPNextCustomer) => {
    const normalizedType = values.customer_type === "Company" ? "Company" : "Individual";
    const payload: UpdateERPNextCustomer = {
      customer_type: normalizedType,
      tax_id: normalizedType === "Company" ? values.tax_id?.trim() || undefined : undefined,
    };

    try {
      const updated = await updateCustomer(payload);
      customerSwr.mutate(updated, false);
      const normalizedType = updated.customer_type === "Company" ? "Company" : "Individual";
      reset({
        customer_type: normalizedType,
        tax_id: normalizedType === "Company" ? updated.tax_id ?? "" : "",
      });
      toast.success("회사 정보가 저장됐어요.");
    } catch (error) {
      console.error(error);
      toast.error("회사 정보를 저장하지 못했어요.");
    }
  };

  if (customerSwr.isLoading && !customerSwr.data) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (customerSwr.error) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center space-y-3 text-sm text-muted-foreground">
        <p>회사 정보를 불러오지 못했어요.</p>
        <Button size="sm" onClick={() => customerSwr.mutate()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
        <div className="flex flex-col w-full space-y-12 h-full">
          <section className="space-y-6 grow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customer_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600 pb-2">고객 유형</FormLabel>
                    <Select
                      key={customerType ?? "__unset"}
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== "Company") {
                          const currentTaxId = form.getValues("tax_id");
                          form.setValue("tax_id", "", { shouldDirty: !!currentTaxId });
                        }
                      }}
                      value={field.value ?? "Individual"}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full !h-12 rounded-2xl border-none bg-muted/80 px-4 text-base font-medium shadow-none transition-colors duration-200 hover:bg-muted">
                          <SelectValue placeholder="고객 유형을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl">
                        {Object.entries(customerTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
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
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600 pb-2">사업자 등록번호</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={customerType === "Company" ? field.value ?? "" : ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder="000-00-00000"
                        className="h-12 rounded-2xl border-none bg-muted/80 px-4 text-base font-medium shadow-none transition-colors duration-200 hover:bg-muted"
                        disabled={isSubmitting || customerType !== "Company"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <div className="w-full sticky bottom-0 z-20">
            <div className="w-full h-4 bg-gradient-to-t from-background to-transparent" />
            <div className="w-full flex justify-between space-x-4 pb-4 pt-3 bg-background">
              <Button className="w-full h-[3.5rem] rounded-2xl text-lg font-semibold" disabled={isSubmitting || !isDirty} type="submit">
                {isSubmitting && <Loader2 className="!size-5 mr-2 animate-spin" />}회사 정보 저장
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
